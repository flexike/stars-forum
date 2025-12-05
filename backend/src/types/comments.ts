import type { User } from "./user.ts";
import type { Post } from "./post.ts";
import type { Thread } from "./threads.ts";
import { t } from "elysia";

export type Comment = {
  id: number;
  author: User;
  authorId: number;
  content: string;
  createdAt: Date;
  updatedAt: Date;

  post: Post;
  postId: number;

  thread: Thread;
  threadId: number;
};

export const CommentsNewInpit = t.Object({
  content: t.String(),
});
