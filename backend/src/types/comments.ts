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

  post?: Post | null;
  postId?: number | null;

  thread?: Thread | null;
  threadId?: number | null;
};

export const CommentsNewInput = t.Object({
  content: t.String(),
  postId: t.Optional(t.Number()),
  threadId: t.Optional(t.Number()),
  authorId: t.Number(),
});

export const CommentsPatchInput = t.Object({
  content: t.String(),
});
