"use client";

import { useQuery } from "@tanstack/react-query";
import { posterRepository } from "@/lib/api/posterRepository";
import { PosterCard } from "@/components/PosterCard";
import { PosterCardSkeleton } from "@/components/PosterCardSkeleton";

const PAGE_SIZE = 12;

export function PosterFeed() {
  const {
    data,
    error,
    isError,
    isPending,
    refetch
  } = useQuery({
    queryKey: ["posters", PAGE_SIZE],
    queryFn: () =>
      posterRepository.listPosters({
        limit: PAGE_SIZE
      }),
    staleTime: 60 * 1000
  });

  const posters = data ?? [];

  if (isPending) {
    return (
      <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
        {Array.from({ length: 6 }).map((_, idx) => (
          <PosterCardSkeleton key={idx} />
        ))}
      </div>
    );
  }

  if (isError) {
    return (
      <div className="space-y-3 rounded-2xl border border-red-200 bg-red-50 p-4">
        <p className="text-sm text-red-700">
          Failed to load posters. {(error as Error)?.message ?? ""}
        </p>
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
    <section className="grid grid-cols-1 gap-4 md:grid-cols-2" aria-label="Poster feed">
      {posters.map((poster, idx) => (
        <PosterCard key={poster.id} poster={poster} priority={idx < 2} />
      ))}
    </section>
  );
}
