export type Poster = {
  id: string;
  title: string;
  startTime: string;
  location: string;
  image: {
    thumbUrl: string;
    mediumUrl: string;
    width: number;
    height: number;
  };
};

export type PosterPage = {
  items: Poster[];
  nextCursor: string | null;
};