import type { Elysia } from "elysia";
import { t } from "elysia";
import { prisma } from "../db/prisma.ts";
import { ThreadNewCreatedInput, ThreadPatchInput } from "../types/threads.ts";

export const threadsGroup = (app: Elysia) =>
  app
    .get("/", async ({ set }) => {
      set.status = 200;
      return prisma.thread.findMany({
        orderBy: { createdAt: "desc" },
        include: {
          author: {
            select: {
              id: true,
              nickname: true,
              role: true,
            },
          },
          comments: {},
        },
      });
    })
    .get(
      "/:id",
      async ({ params: { id }, set }) => {
        const thread = await prisma.thread.findUnique({
          where: { id },
          include: {
            author: {
              select: { id: true, nickname: true, role: true },
            },
            comments: {},
          },
        });

        if (!thread) {
          set.status = 404;
          return {
            status: "error",
            message: "Thread not found",
          };
        }

        set.status = 200;
        return thread;
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

        const newThread = await prisma.thread.create({
          data: {
            title,
            content,
            authorId,
          },
        });

        set.status = 201;
        return {
          status: "success",
          message: "Thread created",
          thread: newThread,
        };
      },
      { body: ThreadNewCreatedInput },
    )
    .patch(
      "/:id",
      async ({ params: { id }, body: { title, content }, set }) => {
        const existingThread = await prisma.thread.findUnique({
          where: { id: id },
        });

        if (!existingThread) {
          set.status = 404;
          return {
            status: "error",
            message: "Thread not found",
          };
        }

        if (!title && !content) {
          set.status = 400;
          return {
            status: "error",
            message: "Title or Content should not be empty",
          };
        }

        const patchedThread = await prisma.thread.update({
          where: { id: id },
          data: {
            title: title ?? undefined,
            content: content ?? undefined,
          },
        });

        set.status = 201;
        return {
          status: "success",
          message: "Thread updated",
          thread: patchedThread,
        };
      },
      { params: t.Object({ id: t.Number() }), body: ThreadPatchInput },
    )
    .delete(
      "/:id",
      async ({ params: { id }, set }) => {
        const thread = await prisma.thread.findUnique({ where: { id: id } });

        if (!thread) {
          set.status = 404;
          return {
            status: "error",
            message: "Thread not found",
          };
        }

        const deleteThread = await prisma.thread.delete({ where: { id: id } });

        set.status = 204;
        return {
          status: "success",
          message: "Thread deleted successfully",
          thread: deleteThread,
        };
      },
      { params: t.Object({ id: t.Number() }) },
    );
