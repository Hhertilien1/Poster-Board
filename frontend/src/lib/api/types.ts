export type Post = {
  id: number;
  title: string;
  content: string;
  image_url: string | null;
  user_id: number;
  view_count: number;
  created_at: string | null;
  uploaded_at?: string | null;
};

export type CreatePostInput = {
  title: string;
  content: string;
  image_url: string;
  user_id: number;
};

export type UserWithPosts = {
  id: number;
  username: string;
  created_at?: string | null;
  posts: Post[];
};

export type CreateUserInput = {
  username: string;
};

export type User = {
  id: number;
  username: string;
  created_at?: string | null;
};
