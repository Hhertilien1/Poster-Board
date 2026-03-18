export function PosterCardSkeleton() {
  return (
    <div className="overflow-hidden rounded-2xl border border-black/5 bg-white/70">
      <div className="aspect-[5/7] w-full animate-pulse bg-slate-200" />
      <div className="space-y-2 p-4">
        <div className="h-4 w-4/5 animate-pulse rounded bg-slate-200" />
        <div className="h-3 w-2/3 animate-pulse rounded bg-slate-200" />
        <div className="h-3 w-1/2 animate-pulse rounded bg-slate-200" />
      </div>
    </div>
  );
}