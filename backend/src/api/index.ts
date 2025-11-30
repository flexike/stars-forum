import { Elysia, t } from "elysia";
import { usersGroup } from "./users.ts";
import { postsGroup } from "./posts.ts";

export const apiRouter = new Elysia({ prefix: "/api" })
  .group("/users", usersGroup)
  .group("/posts", postsGroup);
