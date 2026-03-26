# Poster Board v1 (Next.js + React Query + MSW)

Frontend for browsing posts from the Flask backend.

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

## Flask migration later

1. Set:
```bash
NEXT_PUBLIC_API_BASE_URL=http://localhost:5000
```
2. Disable MSW:
```bash
NEXT_PUBLIC_ENABLE_MSW=false
```
3. Keep same endpoints/contract:
- `GET /posts`
- `GET /posts/:id`

Frontend components do not call `fetch` directly; they use the repository layer in `src/lib/api/`.
