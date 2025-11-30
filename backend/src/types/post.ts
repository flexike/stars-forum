import { t } from "elysia";

export type Post = {
  id: number;
  authorId: number;
  title: string;
  content: string;
  createdAt: number;
  updatedAt?: number;
};

export const PostNewCreatedInput = t.Object({
  title: t.String({ minLength: 3, maxLength: 50 }),
  content: t.String(),
  authorId: t.Number(),
});

export const PostPatchInput = t.Object({
  title: t.Optional(t.String({ minLength: 3, maxLength: 50 })),
  content: t.Optional(t.String()),
});
