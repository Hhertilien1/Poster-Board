# Poster Board v1 (Next.js + React Query + MSW)

Mobile-first frontend that renders event posters in an infinite feed using cursor pagination.

## Stack
- Next.js App Router + TypeScript
- Tailwind CSS
- TanStack React Query (`useInfiniteQuery`)
- IntersectionObserver (sentinel-based infinite loading)
- MSW for mocked API in development
- `next/image` for poster images

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

- `GET /api/posters?limit=<number>&cursor=<opaque|null>`
  - response: `{ items: Poster[], nextCursor: string | null }`
- `GET /api/posters/:id`
  - response: `Poster`

`Poster` shape:
```ts
{
  id: string;
  title: string;
  startTime: string; // ISO
  location: string;
  image: {
    thumbUrl: string;
    mediumUrl: string;
    width: number;
    height: number;
  };
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
- `GET /api/posters`
- `GET /api/posters/:id`

Frontend components do not call `fetch` directly; they use the repository layer in `src/lib/api/`.