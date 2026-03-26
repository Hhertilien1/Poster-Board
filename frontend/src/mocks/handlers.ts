import { http, HttpResponse } from "msw";
import { MOCK_POSTERS } from "@/mocks/data/posters";

export const handlers = [
  http.get("/posts", () => {
    return HttpResponse.json(MOCK_POSTERS);
  }),

  http.get("/posts/:id", ({ params }) => {
    const id = Number(params.id);
    const poster = MOCK_POSTERS.find((item) => item.id === id);

    if (!poster) {
      return HttpResponse.json({ message: "Poster not found" }, { status: 404 });
    }

    return HttpResponse.json(poster);
  })
];
