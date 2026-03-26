import { Post } from "@/lib/api/types";

const API_BASE_URL = (process.env.NEXT_PUBLIC_API_BASE_URL ?? "").replace(/\/$/, "");

function buildUrl(path: string) {
  const url = new URL(
    `${API_BASE_URL}${path.startsWith("/") ? path : `/${path}`}`,
    typeof window === "undefined" ? "http://localhost" : window.location.origin
  );

  if (!API_BASE_URL) {
    return `${url.pathname}${url.search}`;
  }

  return url.toString();
}

export async function listPosters(args: {
  limit?: number;
} = {}): Promise<Post[]> {
  const response = await fetch(buildUrl("/posts"));
  if (!response.ok) {
    throw new Error(`listPosters failed with ${response.status}`);
  }

  const posts = (await response.json()) as Post[];
  if (!args.limit || args.limit <= 0) {
    return posts;
  }

  return posts.slice(0, args.limit);
}

export async function getPosterById(id: string): Promise<Post> {
  const response = await fetch(buildUrl(`/posts/${id}`));
  if (!response.ok) {
    throw new Error(`getPosterById failed with ${response.status}`);
  }

  return response.json() as Promise<Post>;
}
