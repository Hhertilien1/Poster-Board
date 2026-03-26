import { Post } from "@/lib/api/types";

const TITLES = [
  "Indie Film Night",
  "Live Jazz Session",
  "Tech Meetup",
  "Art & Illustration Fair",
  "Street Food Festival",
  "Startup Pitch Hour",
  "Acoustic Open Mic",
  "Design Systems Workshop"
];

const CONTENTS = [
  "A campus event featuring student artists and local creators.",
  "Live performances, talks, and networking with community groups.",
  "Explore project demos, presentations, and hands-on workshops.",
  "An open evening session with food, music, and poster exhibits."
];

const CREATED_AT_BASE = new Date("2026-03-01T18:00:00.000Z").getTime();

function posterFor(index: number): Post {
  const id = index + 1;
  const title = `${TITLES[index % TITLES.length]} #${index + 1}`;
  const content = CONTENTS[index % CONTENTS.length];
  const created_at = new Date(CREATED_AT_BASE + index * 1000 * 60 * 60 * 6).toISOString();
  const imgId = ((index * 13) % 90) + 10;

  return {
    id,
    title,
    content,
    image_url: `https://picsum.photos/id/${imgId}/800/1120`,
    user_id: (index % 5) + 1,
    created_at
  };
}

export const MOCK_POSTERS: Post[] = Array.from({ length: 120 }, (_, idx) => posterFor(idx));
