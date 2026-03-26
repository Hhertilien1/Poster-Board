"use client";

import Link from "next/link";
import { useQuery } from "@tanstack/react-query";
import { posterRepository } from "@/lib/api/posterRepository";
import { Post } from "@/lib/api/types";
import { formatDateTime } from "@/lib/utils/formatDate";

type PosterCardProps = {
  poster: Post;
  priority?: boolean;
};

export function PosterCard({ poster, priority = false }: PosterCardProps) {
  void priority;
  const imageUrl = poster.image_url ?? "https://picsum.photos/800/1120?grayscale";
  const isPdfPoster =
    imageUrl.startsWith("data:application/pdf") || imageUrl.toLowerCase().endsWith(".pdf");
  const { data: userData } = useQuery({
    queryKey: ["user", poster.user_id],
    queryFn: () => posterRepository.getUserById(poster.user_id),
    staleTime: 5 * 60 * 1000
  });

  return (
    <Link
      href={`/poster/${poster.id}`}
      className="group block overflow-hidden rounded-2xl border border-black/5 bg-white/85 shadow-card transition hover:-translate-y-0.5 hover:shadow-xl focus:outline-none focus-visible:ring-2 focus-visible:ring-accent"
    >
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
      <div className="space-y-1 p-4">
        <h2 className="line-clamp-2 text-base font-bold text-ink">{poster.title}</h2>
        <p className="text-sm text-ink/75">{formatDateTime(poster.created_at)}</p>
        <p className="text-xs text-ink/60">Posted by @{userData?.username ?? "loading"}</p>
        <p className="line-clamp-2 text-sm text-ink/70">{poster.content}</p>
      </div>
    </Link>
  );
}
