import { PosterDetail } from "@/components/PosterDetail";

type PosterDetailPageProps = {
  params: { id: string };
};

export default function PosterDetailPage({ params }: PosterDetailPageProps) {
  return (
    <main className="safe-area mx-auto w-full max-w-3xl">
      <PosterDetail id={params.id} />
    </main>
  );
}