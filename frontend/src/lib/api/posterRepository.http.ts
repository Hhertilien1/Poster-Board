import { Poster, PosterPage } from "@/lib/api/types";

const API_BASE_URL = (process.env.NEXT_PUBLIC_API_BASE_URL ?? "").replace(/\/$/, "");

function buildUrl(path: string, params?: Record<string, string>) {
  const url = new URL(
    `${API_BASE_URL}${path}`,
    typeof window === "undefined" ? "http://localhost" : window.location.origin
  );

  if (params) {
    for (const [key, value] of Object.entries(params)) {
      url.searchParams.set(key, value);
    }
  }

  if (!API_BASE_URL) {
    return `${url.pathname}${url.search}`;
  }

  return url.toString();
}

export async function listPosters(args: {
  cursor?: string | null;
  limit: number;
}): Promise<PosterPage> {
  const params: Record<string, string> = { limit: String(args.limit) };
  if (args.cursor) params.cursor = args.cursor;

  const response = await fetch(buildUrl("/api/posters", params));
  if (!response.ok) {
    throw new Error(`listPosters failed with ${response.status}`);
  }

  return response.json() as Promise<PosterPage>;
}

export async function getPosterById(id: string): Promise<Poster> {
  const response = await fetch(buildUrl(`/api/posters/${id}`));
  if (!response.ok) {
    throw new Error(`getPosterById failed with ${response.status}`);
  }

  return response.json() as Promise<Poster>;
}