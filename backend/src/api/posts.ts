import type { Elysia } from "elysia";
import { t } from "elysia";
import { PostNewCreatedInput, PostPatchInput } from "../types/post.ts";
import { prisma } from "../db/prisma.ts";

export const postsGroup = (app: Elysia<any>) =>
  app
    .get("/", async () => {
      return prisma.post.findMany();
    })
    .get(
      "/:id",
      async ({ params: { id }, set }) => {
        const wantedPost = await prisma.post.findUnique({ where: { id: id } });

        if (!wantedPost) {
          set.status = 404;
          return {
            status: "error",
            message: "Post not found",
          };
        }

        set.status = 200;
        return wantedPost;
      },
      { params: t.Object({ id: t.Number() }) },
    )
    .post(
      "/",
      async ({ set, body: { title, content, authorId } }) => {
        const userId = await prisma.user.findUnique({
          where: { id: authorId },
        });

        if (!userId) {
          set.status = 404;
          return {
            status: "error",
            message: "User not found",
          };
        }

        const newPost = await prisma.post.create({
          data: {
            title,
            content,
            authorId,
          },
        });

        set.status = 200;
        return {
          status: "success",
          message: "Post created",
          post: newPost,
        };
      },
      { body: PostNewCreatedInput },
    )
    .patch(
      "/:id",
      async ({ params: { id }, set, body: { title, content } }) => {
        const existingPost = await prisma.post.findUnique({
          where: { id: id },
        });

        if (!existingPost) {
          set.status = 404;
          return {
            status: "error",
            message: "Post not found",
          };
        }

        if (!title && !content) {
          set.status = 400;
          return {
            status: "error",
            message: "You need to change title or content ",
          };
        }

        const update = await prisma.post.update({
          where: { id: id },
          data: {
            title: title ?? undefined,
            content: content ?? undefined,
          },
        });

        set.status = 200;
        return {
          status: "success",
          message: "Post updated",
          post: update,
        };
      },
      {
        body: PostPatchInput,
        params: t.Object({ id: t.Number() }),
      },
    )
    .delete(
      "/:id",
      async ({ params: { id }, set }) => {
        const wantedPost = await prisma.post.findUnique({ where: { id: id } });

        if (!wantedPost) {
          set.status = 404;
          return {
            status: "error",
            message: "Post not found",
          };
        }

        await prisma.post.delete({ where: { id: id } });
        set.status = 200;
        return {
          status: "success",
          message: "Post deleted",
        };
      },
      { params: t.Object({ id: t.Number() }) },
    );
