import { http, HttpResponse } from "msw";
import { MOCK_POSTERS } from "@/mocks/data/posters";

function decodeCursor(cursor: string | null): number {
  if (!cursor) return 0;
  const match = /^cursor_(\d+)$/.exec(cursor);
  return match ? Number(match[1]) : 0;
}

function encodeCursor(index: number): string {
  return `cursor_${index}`;
}

export const handlers = [
  http.get("/api/posters", ({ request }) => {
    const { searchParams } = new URL(request.url);
    const limitRaw = Number(searchParams.get("limit") ?? "12");
    const limit = Number.isFinite(limitRaw) ? Math.max(1, Math.min(limitRaw, 30)) : 12;
    const start = decodeCursor(searchParams.get("cursor"));
    const end = Math.min(start + limit, MOCK_POSTERS.length);

    return HttpResponse.json({
      items: MOCK_POSTERS.slice(start, end),
      nextCursor: end < MOCK_POSTERS.length ? encodeCursor(end) : null
    });
  }),

  http.get("/api/posters/:id", ({ params }) => {
    const id = String(params.id);
    const poster = MOCK_POSTERS.find((item) => item.id === id);

    if (!poster) {
      return HttpResponse.json({ message: "Poster not found" }, { status: 404 });
    }

    return HttpResponse.json(poster);
  })
];