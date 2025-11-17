import { Elysia, t } from "elysia";
import { mockUsers } from "../db/users";
import { postCreateNewUserInput, UserRole } from "../types/user";

import type { PublicUser, User } from "../types/user";

// helpers
const toPublicUser = (user: User): PublicUser => {
  const { passwordHash, ...rest } = user;
  return rest;
};

const getNextUserId = (): number => {
  if (!mockUsers.length) return 1;
  return Math.max(...mockUsers.map((u) => u.id)) + 1;
};

// TODO: винести /API/ і туди юзерів, замість префіксу юзати групи
export const usersRouter = new Elysia({ prefix: "/api/users" })
  .get("/", () => mockUsers.map((u) => toPublicUser(u)))

  .get(
    "/:id",
    ({ params, set }) => {
      const user = mockUsers.find((u) => u.id === params.id);

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
    ({ body: { username, nickname, role = UserRole.user, password }, set }) => {
      if (!username || !nickname || !password) {
        set.status = 400;
        return {
          status: "error",
          message: `Username, password and nickname are required!`,
        };
      }

      const existingUsername = mockUsers.find((u) => u.username === username);
      if (existingUsername) {
        set.status = 409;
        return {
          status: "error",
          message: `User with ${nickname} already exists.`,
        };
      }

      const newUser: User = {
        id: getNextUserId(),
        passwordHash: `BETA:${password}`,
        posts: [],
        username,
        nickname,
        role,
      };

      mockUsers.push(newUser);
      set.status = 201;
      return toPublicUser(newUser);
    },
    {
      body: postCreateNewUserInput,
    },
  );
