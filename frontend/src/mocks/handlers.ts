import { http, HttpResponse } from "msw";
import { MOCK_POSTERS } from "@/mocks/data/posters";
import { MOCK_USERS } from "@/mocks/data/users";

function getNextId(items: Array<{ id: number }>) {
  const maxId = items.reduce((currentMax, item) => Math.max(currentMax, item.id), 0);
  return maxId + 1;
}

export const handlers = [
  http.get("/users", ({ request }) => {
    const url = new URL(request.url);
    const username = url.searchParams.get("username")?.trim().toLowerCase();
    const query = url.searchParams.get("query")?.trim().toLowerCase();

    if (username) {
      const user = MOCK_USERS.find((item) => item.username.toLowerCase() === username);
      if (!user) {
        return HttpResponse.json({ message: "User not found" }, { status: 404 });
      }

      return HttpResponse.json(user);
    }

    if (query) {
      const matches = MOCK_USERS.filter((item) => item.username.toLowerCase().includes(query));
      return HttpResponse.json(
        matches.map((user) => ({
          id: user.id,
          username: user.username,
          created_at: user.created_at,
          posts: MOCK_POSTERS.filter((post) => post.user_id === user.id)
        }))
      );
    }

    return HttpResponse.json(MOCK_USERS);
  }),

  http.get("/posts", () => {
    MOCK_POSTERS.forEach((post) => {
      post.view_count += 1;
    });
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

    const nextId = getNextId(MOCK_POSTERS);
    const newPost = {
      id: nextId,
      title: body.title,
      content: body.content,
      image_url: body.image_url,
      user_id: body.user_id,
      view_count: 0,
      created_at: new Date().toISOString(),
      uploaded_at: new Date().toISOString()
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
      created_at: user.created_at,
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

    const nextId = getNextId(MOCK_USERS);
    const user = {
      id: nextId,
      username: body.username.trim(),
      created_at: new Date().toISOString()
    };

    MOCK_USERS.push(user);

    return HttpResponse.json(user, { status: 201 });
  })
];
