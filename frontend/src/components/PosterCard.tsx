import Link from "next/link";
import { Post } from "@/lib/api/types";
import { formatDateTime } from "@/lib/utils/formatDate";

type PosterCardProps = {
  poster: Post;
  priority?: boolean;
};

export function PosterCard({ poster, priority = false }: PosterCardProps) {
  void priority;

  return (
    <Link
      href={`/poster/${poster.id}`}
      className="group block overflow-hidden rounded-2xl border border-black/5 bg-white/85 shadow-card transition hover:-translate-y-0.5 hover:shadow-xl focus:outline-none focus-visible:ring-2 focus-visible:ring-accent"
    >
      <div className="relative aspect-[5/7] w-full">
        <img
          src={poster.image_url ?? "https://picsum.photos/800/1120?grayscale"}
          alt={`${poster.title} poster`}
          loading="lazy"
          className="h-full w-full object-cover transition duration-300 group-hover:scale-[1.015]"
        />
      </div>
      <div className="space-y-1 p-4">
        <h2 className="line-clamp-2 text-base font-bold text-ink">{poster.title}</h2>
        <p className="text-sm text-ink/75">{formatDateTime(poster.created_at)}</p>
        <p className="line-clamp-2 text-sm text-ink/70">{poster.content}</p>
      </div>
    </Link>
  );
}
