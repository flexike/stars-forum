import type { User } from "./user.ts";
import type { Comment } from "./comments.ts";
import { t } from "elysia";

export type Thread = {
  id: number;
  author: User;
  authorId: number;
  title: string;
  content: string;
  createdAt: Date;
  updatedAt: Date;

  comments: Comment;
};

export const ThreadNewCreatedInput = t.Object({
  title: t.String({ minLength: 3, maxLength: 50 }),
  content: t.String(),
  authorId: t.Number(),
});

export const ThreadPatchInput = t.Object({
  title: t.Optional(t.String({ minLength: 3, maxLength: 50 })),
  content: t.Optional(t.String()),
});
