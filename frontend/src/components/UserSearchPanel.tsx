"use client";

import Link from "next/link";
import { useDeferredValue, useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { posterRepository } from "@/lib/api/posterRepository";
import { formatDateTime } from "@/lib/utils/formatDate";

export function UserSearchPanel() {
  const [query, setQuery] = useState("");
  const deferredQuery = useDeferredValue(query.trim());

  const { data, isPending, isError, error } = useQuery({
    queryKey: ["user-search", deferredQuery],
    queryFn: () => posterRepository.searchUsers(deferredQuery),
    enabled: deferredQuery.length >= 2,
    staleTime: 30 * 1000,
  });

  const results = data ?? [];

  return (
    <section className="mb-6 rounded-2xl border border-black/5 bg-white/85 p-5 shadow-card">
      <header className="mb-4 space-y-1">
        <p className="text-xs uppercase tracking-[0.2em] text-ink/60">User Search</p>
        <h2 className="text-xl font-extrabold tracking-tight text-ink">Find users and their posts</h2>
        <p className="text-sm text-ink/70">
          Search by username to view matching accounts and jump straight to their posters.
        </p>
      </header>

      <label className="block space-y-2">
        <span className="text-sm font-semibold text-ink">Username</span>
        <input
          value={query}
          onChange={(event) => setQuery(event.target.value)}
          className="w-full rounded-lg border border-black/10 bg-white px-3 py-2 text-sm text-ink outline-none focus-visible:ring-2 focus-visible:ring-accent"
          type="search"
          placeholder="Search users..."
        />
      </label>

      {deferredQuery.length > 0 && deferredQuery.length < 2 ? (
        <p className="mt-3 text-sm text-ink/65">Type at least 2 characters to search.</p>
      ) : null}

      {isPending ? <p className="mt-3 text-sm text-ink/65">Searching users...</p> : null}

      {isError ? (
        <p className="mt-3 rounded-lg border border-red-200 bg-red-50 p-3 text-sm text-red-700">
          Could not search users. {(error as Error)?.message ?? ""}
        </p>
      ) : null}

      {!isPending && deferredQuery.length >= 2 && !isError && results.length === 0 ? (
        <p className="mt-3 text-sm text-ink/65">No users matched "{deferredQuery}".</p>
      ) : null}

      {results.length > 0 ? (
        <div className="mt-4 space-y-4">
          {results.map((user) => (
            <article key={user.id} className="rounded-xl border border-black/8 bg-surface/60 p-4">
              <div className="flex flex-col gap-1 sm:flex-row sm:items-end sm:justify-between">
                <div>
                  <h3 className="text-lg font-bold text-ink">@{user.username}</h3>
                  <p className="text-sm text-ink/65">
                    Joined {formatDateTime(user.created_at)} · {user.posts.length} post{user.posts.length === 1 ? "" : "s"}
                  </p>
                </div>
                <Link
                  href={`/poster/new?username=${encodeURIComponent(user.username)}`}
                  className="text-sm font-semibold text-accent hover:underline"
                >
                  Upload for this user
                </Link>
              </div>

              {user.posts.length > 0 ? (
                <div className="mt-3 grid grid-cols-1 gap-3 md:grid-cols-2">
                  {user.posts.map((post) => {
                    const uploadedAt = post.uploaded_at ?? post.created_at;

                    return (
                      <Link
                        key={post.id}
                        href={`/poster/${post.id}`}
                        className="block rounded-lg border border-black/8 bg-white/80 p-3 transition hover:-translate-y-0.5 hover:shadow-sm focus-visible:ring-2 focus-visible:ring-accent"
                      >
                        <p className="text-sm font-bold text-ink">{post.title}</p>
                        <p className="mt-1 text-xs text-ink/60">Uploaded {formatDateTime(uploadedAt)}</p>
                        <p className="mt-2 line-clamp-2 text-sm text-ink/70">{post.content}</p>
                      </Link>
                    );
                  })}
                </div>
              ) : (
                <p className="mt-3 text-sm text-ink/65">This user has not uploaded any posts yet.</p>
              )}
            </article>
          ))}
        </div>
      ) : null}
    </section>
  );
}