"use client";

import Link from "next/link";
import { useEffect, useRef, useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { posterRepository } from "@/lib/api/posterRepository";
import { formatDateTime } from "@/lib/utils/formatDate";

type PosterDetailProps = {
  id: string;
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

export function PosterDetail({ id }: PosterDetailProps) {
  const { data, isPending, isError, refetch } = useQuery({
    queryKey: ["poster", id],
    queryFn: () => posterRepository.getPosterById(id),
    staleTime: 5 * 60 * 1000
  });
  const { data: userData } = useQuery({
    queryKey: ["user", data?.user_id],
    queryFn: () => posterRepository.getUserById(data!.user_id),
    enabled: Boolean(data?.user_id),
    staleTime: 5 * 60 * 1000
  });

  if (isPending) {
    return <p className="rounded-xl bg-white/80 p-4 text-sm text-ink/70">Loading poster...</p>;
  }

  if (isError || !data) {
    return (
      <div className="space-y-3 rounded-2xl border border-red-200 bg-red-50 p-4">
        <p className="text-sm text-red-700">Could not load poster details.</p>
        <button
          onClick={() => refetch()}
          className="rounded-lg bg-red-600 px-4 py-2 text-sm font-semibold text-white focus-visible:ring-2 focus-visible:ring-red-400"
        >
          Retry
        </button>
      </div>
    );
  }

  const imageUrl = data.image_url ?? "https://picsum.photos/800/1120?grayscale";
  const uploadedAt = data.uploaded_at ?? data.created_at;
  const viewCount = data.view_count ?? 0;
  const isPdfPoster =
    imageUrl.startsWith("data:application/pdf") || imageUrl.toLowerCase().endsWith(".pdf");

  return (
    <article className="space-y-4">
      <Link href="/" className="text-sm font-semibold text-accent hover:underline">
        {"<-"} Back to feed
      </Link>
      <div className="overflow-hidden rounded-2xl border border-black/5 bg-white/85 shadow-card">
        <div className="relative aspect-[5/7] w-full">
          {isPdfPoster ? (
            <iframe
              src={imageUrl}
              title={`${data.title} PDF poster`}
              className="h-full w-full bg-white"
            />
          ) : (
            <img src={imageUrl} alt={`${data.title} poster`} className="h-full w-full object-cover" />
          )}
        </div>
        <div className="space-y-2 p-5">
          <h1 className="text-2xl font-extrabold tracking-tight text-ink">{data.title}</h1>
          <p className="text-ink/80">Uploaded {formatDateTime(uploadedAt)}</p>
          <div className="flex items-center justify-between text-xs text-ink/60">
            <p>{viewCount} views</p>
            <SharePostButton postId={data.id} />
          </div>
          <p className="text-ink/75">{data.content}</p>
          <p className="text-xs text-ink/60">Posted by @{userData?.username ?? "loading"}</p>
        </div>
      </div>
    </article>
  );
}
