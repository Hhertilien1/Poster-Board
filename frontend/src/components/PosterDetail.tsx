"use client";

import Image from "next/image";
import Link from "next/link";
import { useQuery } from "@tanstack/react-query";
import { posterRepository } from "@/lib/api/posterRepository";
import { formatDateTime } from "@/lib/utils/formatDate";

type PosterDetailProps = {
  id: string;
};

export function PosterDetail({ id }: PosterDetailProps) {
  const { data, isPending, isError, refetch } = useQuery({
    queryKey: ["poster", id],
    queryFn: () => posterRepository.getPosterById(id),
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

  return (
    <article className="space-y-4">
      <Link href="/" className="text-sm font-semibold text-accent hover:underline">
        {"<-"} Back to feed
      </Link>
      <div className="overflow-hidden rounded-2xl border border-black/5 bg-white/85 shadow-card">
        <div className="relative aspect-[5/7] w-full">
          <Image
            src={data.image.mediumUrl}
            alt={`${data.title} poster`}
            fill
            priority
            sizes="(max-width: 768px) 100vw, 768px"
            className="object-cover"
          />
        </div>
        <div className="space-y-2 p-5">
          <h1 className="text-2xl font-extrabold tracking-tight text-ink">{data.title}</h1>
          <p className="text-ink/80">{formatDateTime(data.startTime)}</p>
          <p className="text-ink/75">{data.location}</p>
        </div>
      </div>
    </article>
  );
}