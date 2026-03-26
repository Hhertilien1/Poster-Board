import { PosterFeed } from "@/components/PosterFeed";
import Link from "next/link";

export default function HomePage() {
  return (
    <main className="safe-area mx-auto w-full max-w-5xl">
      <header className="mb-5 flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <p className="text-xs uppercase tracking-[0.2em] text-ink/60">Event Feed</p>
          <h1 className="text-2xl font-extrabold tracking-tight text-ink md:text-3xl">
            Poster Board
          </h1>
        </div>
        <Link
          href="/poster/new"
          className="inline-flex items-center justify-center rounded-lg bg-accent px-4 py-2 text-sm font-semibold text-white focus-visible:ring-2 focus-visible:ring-accent"
        >
          Upload New Poster
        </Link>
      </header>
      <PosterFeed />
    </main>
  );
}
