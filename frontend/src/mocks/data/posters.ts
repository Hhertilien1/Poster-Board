import { Poster } from "@/lib/api/types";

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

const LOCATIONS = [
  "Downtown Civic Center",
  "Riverside Hall",
  "Northside Theater",
  "Harbor View Gallery",
  "City Market Plaza",
  "Elm Street Studio",
  "Central Library Annex",
  "Old Mill Warehouse"
];

const START_TIME_BASE = new Date("2026-03-01T18:00:00.000Z").getTime();

function posterFor(index: number): Poster {
  const id = `poster_${index + 1}`;
  const title = `${TITLES[index % TITLES.length]} #${index + 1}`;
  const location = LOCATIONS[index % LOCATIONS.length];
  const startTime = new Date(START_TIME_BASE + index * 1000 * 60 * 60 * 6).toISOString();
  const imgId = ((index * 13) % 90) + 10;

  return {
    id,
    title,
    startTime,
    location,
    image: {
      thumbUrl: `https://picsum.photos/id/${imgId}/400/560`,
      mediumUrl: `https://picsum.photos/id/${imgId}/800/1120`,
      width: 800,
      height: 1120
    }
  };
}

export const MOCK_POSTERS: Poster[] = Array.from({ length: 120 }, (_, idx) => posterFor(idx));