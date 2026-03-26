"use client";

import Link from "next/link";
import { FormEvent, useState } from "react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useRouter, useSearchParams } from "next/navigation";
import { posterRepository } from "@/lib/api/posterRepository";

type PendingPosterDraft = {
  title: string;
  content: string;
  image_url: string;
};

const PENDING_POSTER_DRAFT_KEY = "pendingPosterDraft";

export function NewUserForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const queryClient = useQueryClient();
  const returnTo = searchParams.get("returnTo") || "/poster/new";
  const missingUserId = searchParams.get("missingUserId");

  const [username, setUsername] = useState("");
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  function readPendingDraft(): PendingPosterDraft | null {
    const raw = window.sessionStorage.getItem(PENDING_POSTER_DRAFT_KEY);
    if (!raw) {
      return null;
    }

    try {
      const parsed = JSON.parse(raw) as PendingPosterDraft;
      if (!parsed.title || !parsed.content || !parsed.image_url) {
        return null;
      }
      return parsed;
    } catch {
      return null;
    }
  }

  const createUserMutation = useMutation({
    mutationFn: async () => {
      const user = await posterRepository.createUser({
        username: username.trim()
      });
      const draft = readPendingDraft();

      if (!draft) {
        return { user, postId: null as number | null };
      }

      const post = await posterRepository.createPoster({
        title: draft.title,
        content: draft.content,
        image_url: draft.image_url,
        user_id: user.id
      });

      return { user, postId: post.id };
    },
    onSuccess: ({ user, postId }) => {
      queryClient.invalidateQueries({ queryKey: ["user", user.id] });
      window.sessionStorage.removeItem(PENDING_POSTER_DRAFT_KEY);

      if (postId) {
        queryClient.invalidateQueries({ queryKey: ["posters"] });
        router.push(`/poster/${postId}`);
        return;
      }

      const join = returnTo.includes("?") ? "&" : "?";
      router.push(`${returnTo}${join}userId=${user.id}`);
    }
  });

  function onSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setErrorMessage(null);

    if (!username.trim()) {
      setErrorMessage("Username is required.");
      return;
    }

    createUserMutation.mutate();
  }

  return (
    <article className="space-y-4">
      <Link href={returnTo} className="text-sm font-semibold text-accent hover:underline">
        {"<-"} Back
      </Link>

      <section className="rounded-2xl border border-black/5 bg-white/85 p-5 shadow-card">
        <header className="mb-4 space-y-1">
          <p className="text-xs uppercase tracking-[0.2em] text-ink/60">New User</p>
          <h1 className="text-2xl font-extrabold tracking-tight text-ink">Create a User</h1>
          <p className="text-sm text-ink/70">
            This user will be created with the existing <code>POST /users</code> endpoint.
          </p>
          {missingUserId && (
            <p className="text-xs text-ink/60">User ID {missingUserId} was not found.</p>
          )}
        </header>

        <form onSubmit={onSubmit} className="space-y-4">
          <label className="block space-y-1">
            <span className="text-sm font-semibold text-ink">Username</span>
            <input
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              className="w-full rounded-lg border border-black/10 bg-white px-3 py-2 text-sm text-ink outline-none focus-visible:ring-2 focus-visible:ring-accent"
              placeholder="new_username"
              maxLength={50}
              required
            />
          </label>

          {(errorMessage || createUserMutation.isError) && (
            <p className="rounded-lg border border-red-200 bg-red-50 p-3 text-sm text-red-700">
              {errorMessage ??
                (createUserMutation.error as Error)?.message ??
                "Could not create user."}
            </p>
          )}

          <button
            type="submit"
            disabled={createUserMutation.isPending}
            className="rounded-lg bg-accent px-4 py-2 text-sm font-semibold text-white focus-visible:ring-2 focus-visible:ring-accent disabled:cursor-not-allowed disabled:opacity-70"
          >
            {createUserMutation.isPending ? "Creating..." : "Create User"}
          </button>
        </form>
      </section>
    </article>
  );
}
