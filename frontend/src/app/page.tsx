import { PosterFeed } from "@/components/PosterFeed";

export default function HomePage() {
  return (
    <main className="safe-area mx-auto w-full max-w-5xl">
      <header className="mb-5">
        <p className="text-xs uppercase tracking-[0.2em] text-ink/60">Event Feed</p>
        <h1 className="text-2xl font-extrabold tracking-tight text-ink md:text-3xl">
          Poster Board
        </h1>
      </header>
      <PosterFeed />
    </main>
  );
}