"use client";

import Link from "next/link";
import { useEffect, useRef, useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { posterRepository } from "@/lib/api/posterRepository";
import { Post } from "@/lib/api/types";
import { formatDateTime } from "@/lib/utils/formatDate";

type PosterCardProps = {
  poster: Post;
  priority?: boolean;
};

type ShareState = "idle" | "copied" | "error";

const RESET_DELAY_MS = 1500;

function getPostUrl(postId: number) {
  return `${window.location.origin}/poster/${postId}`;
}

function fallbackCopyToClipboard(text: string) {
  const input = document.createElement("textarea");
  input.value = text;
  input.setAttribute("readonly", "true");
  input.style.position = "absolute";
  input.style.left = "-9999px";
  document.body.appendChild(input);
  input.select();

  const wasCopied = document.execCommand("copy");
  document.body.removeChild(input);
  return wasCopied;
}

async function copyText(text: string) {
  try {
    if (navigator.clipboard?.writeText) {
      await navigator.clipboard.writeText(text);
      return;
    }
  } catch {
    // Intentionally falling back to execCommand for older/browser-restricted environments.
  }

  if (!fallbackCopyToClipboard(text)) {
    throw new Error("Clipboard copy failed");
  }
}

function SharePostButton({ postId }: { postId: number }) {
  const [shareState, setShareState] = useState<ShareState>("idle");
  const resetTimeoutRef = useRef<number | null>(null);

  useEffect(() => {
    return () => {
      if (resetTimeoutRef.current) {
        window.clearTimeout(resetTimeoutRef.current);
      }
    };
  }, []);

  async function handleShareClick() {
    if (resetTimeoutRef.current) {
      window.clearTimeout(resetTimeoutRef.current);
    }

    try {
      await copyText(getPostUrl(postId));
      setShareState("copied");
    } catch {
      setShareState("error");
    }

    resetTimeoutRef.current = window.setTimeout(() => {
      setShareState("idle");
      resetTimeoutRef.current = null;
    }, RESET_DELAY_MS);
  }

  const statusText = shareState === "copied" ? "Copied" : shareState === "error" ? "Copy failed" : "";

  return (
    <span className="inline-flex items-center gap-2">
      <button
        type="button"
        onClick={handleShareClick}
        className="text-xs font-semibold text-accent hover:underline focus-visible:ring-2 focus-visible:ring-accent"
      >
        Share
      </button>
      {statusText ? <span className="text-xs text-ink/65">{statusText}</span> : null}
    </span>
  );
}

export function PosterCard({ poster, priority = false }: PosterCardProps) {
  void priority;
  const imageUrl = poster.image_url ?? "https://picsum.photos/800/1120?grayscale";
  const uploadedAt = poster.uploaded_at ?? poster.created_at;
  const viewCount = poster.view_count ?? 0;
  const isPdfPoster =
    imageUrl.startsWith("data:application/pdf") || imageUrl.toLowerCase().endsWith(".pdf");
  const { data: userData } = useQuery({
    queryKey: ["user", poster.user_id],
    queryFn: () => posterRepository.getUserById(poster.user_id),
    staleTime: 5 * 60 * 1000
  });

  return (
    <article className="group overflow-hidden rounded-2xl border border-black/5 bg-white/85 shadow-card transition hover:-translate-y-0.5 hover:shadow-xl">
      <Link href={`/poster/${poster.id}`} className="block focus:outline-none focus-visible:ring-2 focus-visible:ring-accent">
        <div className="relative aspect-[5/7] w-full">
          {isPdfPoster ? (
            <iframe
              src={imageUrl}
              title={`${poster.title} PDF poster`}
              className="h-full w-full bg-white pointer-events-none"
            />
          ) : (
            <img
              src={imageUrl}
              alt={`${poster.title} poster`}
              loading="lazy"
              className="h-full w-full object-cover transition duration-300 group-hover:scale-[1.015]"
            />
          )}
        </div>
        <div className="space-y-1 p-4 pb-2">
          <h2 className="line-clamp-2 text-base font-bold text-ink">{poster.title}</h2>
          <p className="text-sm text-ink/75">Uploaded {formatDateTime(uploadedAt)}</p>
          <p className="text-xs text-ink/60">Posted by @{userData?.username ?? "loading"}</p>
          <p className="line-clamp-2 text-sm text-ink/70">{poster.content}</p>
        </div>
      </Link>
      <div className="flex items-center justify-between px-4 pb-4">
        <p className="text-xs text-ink/60">{viewCount} views</p>
        <SharePostButton postId={poster.id} />
      </div>
    </article>
  );
}
