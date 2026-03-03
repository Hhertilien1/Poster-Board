import Image from "next/image";
import Link from "next/link";
import { Poster } from "@/lib/api/types";
import { formatDateTime } from "@/lib/utils/formatDate";

type PosterCardProps = {
  poster: Poster;
  priority?: boolean;
};

export function PosterCard({ poster, priority = false }: PosterCardProps) {
  return (
    <Link
      href={`/poster/${poster.id}`}
      className="group block overflow-hidden rounded-2xl border border-black/5 bg-white/85 shadow-card transition hover:-translate-y-0.5 hover:shadow-xl focus:outline-none focus-visible:ring-2 focus-visible:ring-accent"
    >
      <div className="relative aspect-[5/7] w-full">
        <Image
          src={poster.image.mediumUrl}
          alt={`${poster.title} poster`}
          fill
          priority={priority}
          sizes="(max-width: 768px) 100vw, 50vw"
          className="object-cover transition duration-300 group-hover:scale-[1.015]"
        />
      </div>
      <div className="space-y-1 p-4">
        <h2 className="line-clamp-2 text-base font-bold text-ink">{poster.title}</h2>
        <p className="text-sm text-ink/75">{formatDateTime(poster.startTime)}</p>
        <p className="text-sm text-ink/70">{poster.location}</p>
      </div>
    </Link>
  );
}