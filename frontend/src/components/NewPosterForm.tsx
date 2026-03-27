"use client";

import Link from "next/link";
import { FormEvent, useRef, useState } from "react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useRouter, useSearchParams } from "next/navigation";
import { posterRepository } from "@/lib/api/posterRepository";

type FormState = {
  title: string;
  content: string;
  username: string;
};

const DEFAULT_STATE: FormState = {
  title: "",
  content: "",
  username: ""
};
const PENDING_POSTER_DRAFT_KEY = "pendingPosterDraft";

type PendingPosterDraft = {
  title: string;
  content: string;
  image_url: string;
  username: string;
  created_at: string;
};

function isSupportedPosterFile(file: File) {
  const fileName = file.name.toLowerCase();
  return (
    file.type === "application/pdf" ||
    file.type === "image/png" ||
    file.type === "image/jpeg" ||
    fileName.endsWith(".pdf") ||
    fileName.endsWith(".png") ||
    fileName.endsWith(".jpg") ||
    fileName.endsWith(".jpeg")
  );
}

function fileToDataUrl(file: File): Promise<string> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => {
      if (typeof reader.result === "string") {
        resolve(reader.result);
      } else {
        reject(new Error("Failed to read file content."));
      }
    };
    reader.onerror = () => reject(new Error("Failed to read file content."));
    reader.readAsDataURL(file);
  });
}

export function NewPosterForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const queryClient = useQueryClient();
  const initialUsername = searchParams.get("username") ?? "";
  const [form, setForm] = useState<FormState>(() => ({
    ...DEFAULT_STATE,
    username: initialUsername
  }));
  const [posterFile, setPosterFile] = useState<File | null>(null);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const fileInputRef = useRef<HTMLInputElement | null>(null);

  const createMutation = useMutation({
    mutationFn: async () => {
      if (!posterFile || !isSupportedPosterFile(posterFile)) {
        throw new Error("A poster file is required (PNG, JPEG, or PDF).");
      }

      const posterDataUrl = await fileToDataUrl(posterFile);
      const user = await posterRepository.getUserByUsername(form.username.trim());

      return posterRepository.createPoster({
        title: form.title.trim(),
        content: form.content.trim(),
        image_url: posterDataUrl,
        user_id: user.id
      });
    },
    onSuccess: (post) => {
      queryClient.invalidateQueries({ queryKey: ["posters"] });
      router.push(`/poster/${post.id}`);
    },
    onSettled: () => {
      setIsSubmitting(false);
    }
  });

  function resetForm() {
    setForm({
      ...DEFAULT_STATE,
      username: initialUsername
    });
    setPosterFile(null);
    setErrorMessage(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  }

  function onFileChange(file: File | null) {
    if (!file) {
      setPosterFile(null);
      return;
    }

    if (!isSupportedPosterFile(file)) {
      setPosterFile(null);
      setErrorMessage("Poster upload must be a PNG, JPEG, or PDF file.");
      return;
    }

    setErrorMessage(null);
    setPosterFile(file);
  }

  async function onSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();

    if (isSubmitting || createMutation.isPending) {
      return;
    }

    setErrorMessage(null);

    if (!form.title.trim()) {
      setErrorMessage("Title is required.");
      return;
    }

    if (!form.content.trim()) {
      setErrorMessage("Content is required.");
      return;
    }

    if (!posterFile || !isSupportedPosterFile(posterFile)) {
      setErrorMessage("Poster upload is required and must be a PNG, JPEG, or PDF file.");
      return;
    }

    const username = form.username.trim();
    if (!username) {
      setErrorMessage("Username is required.");
      return;
    }

    setIsSubmitting(true);

    try {
      await posterRepository.getUserByUsername(username);
    } catch (error) {
      const message = (error as Error)?.message ?? "";
      if (message.includes("404")) {
        try {
          const posterDataUrl = await fileToDataUrl(posterFile);
          const draft = {
            title: form.title.trim(),
            content: form.content.trim(),
            image_url: posterDataUrl,
            username,
            created_at: new Date().toISOString()
          } satisfies PendingPosterDraft;
          window.sessionStorage.setItem(PENDING_POSTER_DRAFT_KEY, JSON.stringify(draft));
        } catch {
          setErrorMessage("Could not prepare poster draft for user creation flow.");
          setIsSubmitting(false);
          return;
        }

        const returnTo = encodeURIComponent("/poster/new");
        const usernameParam = encodeURIComponent(username);
        router.push(`/user/new?returnTo=${returnTo}&username=${usernameParam}`);
        return;
      }

      setErrorMessage("Could not validate username. Please try again.");
      setIsSubmitting(false);
      return;
    }

    window.sessionStorage.removeItem(PENDING_POSTER_DRAFT_KEY);
    createMutation.mutate();
  }

  return (
    <article className="space-y-4">
      <Link href="/" className="text-sm font-semibold text-accent hover:underline">
        {"<-"} Back to feed
      </Link>

      <section className="rounded-2xl border border-black/5 bg-white/85 p-5 shadow-card">
        <header className="mb-4 space-y-1">
          <p className="text-xs uppercase tracking-[0.2em] text-ink/60">New Poster</p>
          <h1 className="text-2xl font-extrabold tracking-tight text-ink">Create a Post</h1>
          <p className="text-sm text-ink/70">
            Upload a poster file (PNG, JPEG, or PDF) and details for your event.
          </p>
        </header>

        <form onSubmit={onSubmit} className="space-y-4">
          <label className="block space-y-1">
            <span className="text-sm font-semibold text-ink">Title</span>
            <input
              value={form.title}
              onChange={(e) => setForm((prev) => ({ ...prev, title: e.target.value }))}
              className="w-full rounded-lg border border-black/10 bg-white px-3 py-2 text-sm text-ink outline-none focus-visible:ring-2 focus-visible:ring-accent"
              placeholder="Poster title"
              maxLength={200}
              required
            />
          </label>

          <label className="block space-y-1">
            <span className="text-sm font-semibold text-ink">Content</span>
            <textarea
              value={form.content}
              onChange={(e) => setForm((prev) => ({ ...prev, content: e.target.value }))}
              className="min-h-32 w-full rounded-lg border border-black/10 bg-white px-3 py-2 text-sm text-ink outline-none focus-visible:ring-2 focus-visible:ring-accent"
              placeholder="Describe the event or poster details"
              required
            />
          </label>

          <label className="block space-y-1">
            <span className="text-sm font-semibold text-ink">Poster File</span>
            <input
              ref={fileInputRef}
              onChange={(e) => onFileChange(e.target.files?.[0] ?? null)}
              className="w-full rounded-lg border border-black/10 bg-white px-3 py-2 text-sm text-ink file:mr-3 file:rounded-md file:border-0 file:bg-accent file:px-3 file:py-2 file:text-sm file:font-semibold file:text-white"
              type="file"
              accept="application/pdf,image/png,image/jpeg,.pdf,.png,.jpg,.jpeg"
              required
            />
            <p className="text-xs text-ink/60">
              {posterFile ? `Selected: ${posterFile.name}` : "Poster upload is required (PNG, JPEG, or PDF)."}
            </p>
          </label>

          <label className="block space-y-1">
            <span className="text-sm font-semibold text-ink">Username</span>
            <input
              value={form.username}
              onChange={(e) => setForm((prev) => ({ ...prev, username: e.target.value }))}
              className="w-full rounded-lg border border-black/10 bg-white px-3 py-2 text-sm text-ink outline-none focus-visible:ring-2 focus-visible:ring-accent"
              type="text"
              placeholder="existing_username"
              required
            />
            <p className="text-xs text-ink/60">
              Username must exist. Missing users will be redirected to user creation.
            </p>
          </label>

          {(errorMessage || createMutation.isError) && (
            <p className="rounded-lg border border-red-200 bg-red-50 p-3 text-sm text-red-700">
              {errorMessage ?? (createMutation.error as Error)?.message ?? "Could not create post."}
            </p>
          )}

          <div className="flex items-center gap-3">
            <button
              type="submit"
              disabled={isSubmitting || createMutation.isPending}
              className="rounded-lg bg-accent px-4 py-2 text-sm font-semibold text-white focus-visible:ring-2 focus-visible:ring-accent disabled:cursor-not-allowed disabled:opacity-70"
            >
              {isSubmitting || createMutation.isPending ? "Creating..." : "Create Poster"}
            </button>
            <button
              type="button"
              onClick={resetForm}
              className="rounded-lg border border-black/10 bg-white px-4 py-2 text-sm font-semibold text-ink focus-visible:ring-2 focus-visible:ring-accent"
            >
              Reset
            </button>
          </div>
        </form>
      </section>
    </article>
  );
}
