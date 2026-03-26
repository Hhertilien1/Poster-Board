import { http, HttpResponse } from "msw";
import { MOCK_POSTERS } from "@/mocks/data/posters";
import { MOCK_USERS } from "@/mocks/data/users";

export const handlers = [
  http.get("/posts", () => {
    return HttpResponse.json(MOCK_POSTERS);
  }),

  http.post("/posts", async ({ request }) => {
    const body = (await request.json()) as {
      title?: string;
      content?: string;
      image_url?: string;
      user_id?: number;
    };

    if (!body.title || !body.content || !body.user_id || !body.image_url) {
      return HttpResponse.json({ message: "Missing required fields" }, { status: 400 });
    }

    const nextId = (MOCK_POSTERS.at(-1)?.id ?? 0) + 1;
    const newPost = {
      id: nextId,
      title: body.title,
      content: body.content,
      image_url: body.image_url,
      user_id: body.user_id,
      created_at: new Date().toISOString()
    };

    MOCK_POSTERS.unshift(newPost);

    return HttpResponse.json(newPost, { status: 201 });
  }),

  http.get("/posts/:id", ({ params }) => {
    const id = Number(params.id);
    const poster = MOCK_POSTERS.find((item) => item.id === id);

    if (!poster) {
      return HttpResponse.json({ message: "Poster not found" }, { status: 404 });
    }

    return HttpResponse.json(poster);
  }),

  http.get("/users/:id", ({ params }) => {
    const id = Number(params.id);
    const user = MOCK_USERS.find((item) => item.id === id);

    if (!user) {
      return HttpResponse.json({ message: "User not found" }, { status: 404 });
    }

    const posts = MOCK_POSTERS.filter((post) => post.user_id === id);

    return HttpResponse.json({
      id: user.id,
      username: user.username,
      posts
    });
  }),

  http.post("/users", async ({ request }) => {
    const body = (await request.json()) as {
      username?: string;
    };

    if (!body.username?.trim()) {
      return HttpResponse.json({ message: "Username is required" }, { status: 400 });
    }

    const nextId = (MOCK_USERS.at(-1)?.id ?? 0) + 1;
    const user = {
      id: nextId,
      username: body.username.trim()
    };

    MOCK_USERS.push(user);

    return HttpResponse.json(user, { status: 201 });
  })
];
