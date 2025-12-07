import { type Elysia, t } from "elysia";
import { prisma } from "../db/prisma.ts";
import { CommentsNewInput, CommentsPatchInput } from "../types/comments.ts";

export const commentsGroup = (app: Elysia) =>
  app
    .get(
      "/:id",
      async ({ params: { id }, set }) => {
        const comment = await prisma.comment.findUnique({
          where: { id: id },
          include: { author: { select: { nickname: true, role: true } } },
        });

        if (!comment) {
          set.status = 404;
          return {
            status: 404,
            message: "Comment not found",
          };
        }

        set.status = 200;
        return comment;
      },
      { params: t.Object({ id: t.Number() }) },
    )

    .post(
      "/",
      async ({ set, body: { content, postId, threadId, authorId } }) => {
        const author = await prisma.user.findUnique({
          where: { id: authorId },
        });

        if (!author) {
          set.status = 404;
          return {
            status: 404,
            message: "Author not found",
          };
        }

        if (!postId && !threadId) {
          set.status = 400;
          return {
            status: 400,
            message:
              "One of relation Ids should be filled (postId or threadId)",
          };
        }

        if (postId && threadId) {
          set.status = 400;
          return {
            status: 400,
            message:
              "Only one of relation Ids should be filled (postId or threadId)",
          };
        }

        if (postId) {
          const post = await prisma.post.findUnique({ where: { id: postId } });
          if (!post) {
            set.status = 404;
            return {
              status: 404,
              message: "Post not found",
            };
          }
        }

        if (threadId) {
          const thread = await prisma.thread.findUnique({
            where: { id: threadId },
          });
          if (!thread) {
            set.status = 404;
            return {
              status: 404,
              message: "Thread not found",
            };
          }
        }

        const newComment = await prisma.comment.create({
          data: {
            content,
            postId: postId ?? null,
            threadId: threadId ?? null,
            authorId,
          },
        });
        set.status = 201;
        return {
          status: 201,
          message: "Comment created successfully",
          comment: newComment,
        };
      },
      {
        body: CommentsNewInput,
      },
    )
    .patch(
      "/:id",
      async ({ params: { id }, set, body: { content } }) => {
        const comment = await prisma.comment.findUnique({ where: { id: id } });

        if (!comment) {
          set.status = 404;
          return {
            status: 404,
            message: "Comment not found",
          };
        }

        const patchedComment = await prisma.comment.update({
          where: { id: id },
          data: {
            content,
          },
        });

        set.status = 200;
        return patchedComment;
      },
      { params: t.Object({ id: t.Number() }), body: CommentsPatchInput },
    )
    .delete(
      "/:id",
      async ({ params: { id }, set }) => {
        const comment = await prisma.comment.findUnique({ where: { id: id } });

        if (!comment) {
          set.status = 404;
          return {
            status: 404,
            message: "Comment not found",
          };
        }

        const deletePostComment = await prisma.comment.delete({
          where: { id: id },
        });

        set.status = 200;
        return deletePostComment;
      },
      { params: t.Object({ id: t.Number() }) },
    );

//TODO: nested comments
