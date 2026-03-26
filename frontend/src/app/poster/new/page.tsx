import { Suspense } from "react";
import { NewPosterForm } from "@/components/NewPosterForm";

export default function NewPosterPage() {
  return (
    <main className="safe-area mx-auto w-full max-w-3xl">
      <Suspense fallback={<p className="rounded-xl bg-white/80 p-4 text-sm text-ink/70">Loading...</p>}>
        <NewPosterForm />
      </Suspense>
    </main>
  );
}
