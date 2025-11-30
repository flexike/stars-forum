import { t } from "elysia";
import {
  deleteUserInput,
  postCreateNewUserInput,
  updateUserInput,
  UserRole,
} from "../types/user.ts";

import type { Elysia } from "elysia";
import type { PublicUser, User } from "../types/user.ts";
import { prisma } from "../db/prisma.ts";

// helpers
const toPublicUser = (user: User): PublicUser => {
  const { passwordHash, ...rest } = user;
  return rest;
};

export const usersGroup = (app: Elysia<any>) =>
  app
    .get("/", async () => {
      const users = await prisma.user.findMany({});
      return users.map(toPublicUser);
    })

    .get(
      "/:id",
      async ({ params, set }) => {
        const user = await prisma.user.findUnique({ where: { id: params.id } });

        if (!user) {
          set.status = 404;
          return {
            status: "error",
            message: `User with ${params.id} id - not found`,
          };
        }

        return toPublicUser(user);
      },
      {
        params: t.Object({
          id: t.Number(),
        }),
      },
    )

    .post(
      "/",
      async ({
        body: { username, nickname, role = UserRole.user, password },
        set,
      }) => {
        const existingUsername = await prisma.user.findUnique({
          where: { username: username },
        });

        if (existingUsername) {
          set.status = 409;
          return {
            status: "error",
            message: `User with ${username} already exists.`,
          };
        }

        const newUser = await prisma.user.create({
          data: {
            username,
            nickname,
            passwordHash: password,
            role,
          },
        });

        set.status = 201;
        return toPublicUser(newUser);
      },
      {
        body: postCreateNewUserInput,
      },
    )

    .delete(
      "/:id",
      async ({ params: { id }, set }) => {
        const existingUser = await prisma.user.findUnique({
          where: { id: id },
        });

        if (!existingUser) {
          set.status = 404;
          return {
            status: "error",
            message: `User with id ${id} not found`,
          };
        }

        await prisma.user.delete({ where: { id: id } });
        set.status = 200;
        return {
          status: "done",
          message: `User deleted successfully.`,
        };
      },
      { params: t.Object({ id: t.Number() }) },
    )

    .patch(
      "/:id",
      async ({ params: { id }, set, body: { nickname, password, role } }) => {
        const existingUser = await prisma.user.findUnique({
          where: { id: id },
        });

        if (!existingUser) {
          set.status = 404;
          return {
            status: "error",
            message: `User with id ${id} not found!`,
          };
        }

        if (!nickname && !password) {
          set.status = 400;
          return {
            status: "error",
            message: "At least one of nickname or password must be provided",
          };
        }

        const update = await prisma.user.update({
          where: { id: id },
          data: {
            nickname: nickname ?? undefined,
            passwordHash: password ?? undefined,
            role: role ?? undefined,
          },
        });

        set.status = 200;
        return {
          status: "ok",
          message: "User updated successfully.",
          user: toPublicUser(update),
        };
      },
      { body: updateUserInput, params: t.Object({ id: t.Number() }) },
    );
