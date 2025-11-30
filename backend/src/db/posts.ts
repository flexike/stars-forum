import type { Post } from "../types/post";

export const mockPosts: Post[] = [
  {
    id: 1,
    authorId: 1,
    title: "Welcome to STARS forum",
    content: "Check my post.",
    createdAt: Date.now(),
    updatedAt: Date.now(),
  },
  {
    id: 2,
    authorId: 2,
    title: "Whose here?",
    content: "Orbs light my path.",
    createdAt: Date.now(),
    updatedAt: Date.now(),
  },
];
