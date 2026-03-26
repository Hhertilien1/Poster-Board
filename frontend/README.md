# Poster Board v1 (Next.js + React Query + MSW)

Frontend for browsing and creating posts from the Flask backend.

## Stack
- Next.js App Router + TypeScript
- Tailwind CSS
- TanStack React Query (`useQuery`)
- MSW for mocked API in development
- native `<img>` rendering for backend-provided image URLs

## Run

```bash
npm install
npm run dev
```

Open `http://localhost:3000`.

## Build

```bash
npm run build
npm run start
```

## API Contract

- `GET /posts`
  - response: `Post[]`
- `GET /posts/:id`
  - response: `Post`
- `POST /posts`
  - body: `{ title, content, image_url, user_id }`
  - response: created `Post`
- `GET /users/:id`
  - response: `{ id, username, posts }`
- `POST /users`
  - body: `{ username }`
  - response: created user object

`Post` shape:
```ts
{
  id: number;
  title: string;
  content: string;
  image_url: string | null;
  user_id: number;
  created_at: string | null; // ISO
}
```

## UI Routes

- `/` feed of poster cards
- `/poster/[id]` poster details
- `/poster/new` create poster upload form
- `/user/new` create user form (used when upload user ID does not exist)

## Upload Flow

- Poster upload accepts required file types: PDF, PNG, JPG/JPEG.
- On submit, frontend validates that `user_id` exists via `GET /users/:id`.
- If user is missing, user is redirected to `/user/new`.
- After user creation, pending poster draft is automatically posted with the new user ID.

## Flask migration later

1. Set:
```bash
NEXT_PUBLIC_API_BASE_URL=http://localhost:5000
```
2. Disable MSW:
```bash
NEXT_PUBLIC_ENABLE_MSW=false
```
3. Backend endpoints used by frontend:
- `GET /posts`
- `GET /posts/:id`
- `POST /posts`
- `GET /users/:id`
- `POST /users`

Frontend components do not call `fetch` directly; they use the repository layer in `src/lib/api/`.
