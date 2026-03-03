"use client";

import { useEffect, useMemo, useRef } from "react";
import { useInfiniteQuery } from "@tanstack/react-query";
import { posterRepository } from "@/lib/api/posterRepository";
import { PosterCard } from "@/components/PosterCard";
import { PosterCardSkeleton } from "@/components/PosterCardSkeleton";

const PAGE_SIZE = 12;

export function PosterFeed() {
  const sentinelRef = useRef<HTMLDivElement | null>(null);

  const {
    data,
    error,
    isError,
    isPending,
    hasNextPage,
    fetchNextPage,
    isFetchingNextPage,
    refetch
  } = useInfiniteQuery({
    queryKey: ["posters", PAGE_SIZE],
    initialPageParam: null as string | null,
    queryFn: ({ pageParam }) =>
      posterRepository.listPosters({
        cursor: pageParam,
        limit: PAGE_SIZE
      }),
    getNextPageParam: (lastPage) => lastPage.nextCursor,
    staleTime: 60 * 1000
  });

  useEffect(() => {
    const sentinel = sentinelRef.current;
    if (!sentinel) return;

    const observer = new IntersectionObserver(
      (entries) => {
        const [entry] = entries;
        if (entry?.isIntersecting && hasNextPage && !isFetchingNextPage) {
          fetchNextPage();
        }
      },
      { root: null, rootMargin: "600px" }
    );

    observer.observe(sentinel);
    return () => observer.disconnect();
  }, [fetchNextPage, hasNextPage, isFetchingNextPage]);

  const posters = useMemo(
    () => data?.pages.flatMap((page) => page.items) ?? [],
    [data?.pages]
  );

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
    <>
      <section className="grid grid-cols-1 gap-4 md:grid-cols-2" aria-label="Poster feed">
        {posters.map((poster, idx) => (
          <PosterCard key={poster.id} poster={poster} priority={idx < 2} />
        ))}

        {isFetchingNextPage &&
          Array.from({ length: 2 }).map((_, idx) => <PosterCardSkeleton key={`next-${idx}`} />)}
      </section>

      <div ref={sentinelRef} className="h-4" aria-hidden="true" />

      {!hasNextPage && (
        <p className="py-6 text-center text-sm font-medium text-ink/60">You reached the end.</p>
      )}
    </>
  );
}