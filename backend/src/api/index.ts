import { Elysia, t } from "elysia";
import { usersGroup } from "./users.ts";
import { postsGroup } from "./posts.ts";
import { threadsGroup } from "./threads.ts";
import { commentsGroup } from "./comments.ts";

export const apiRouter = new Elysia({ prefix: "/api" })
  .group("/users", usersGroup)
  .group("/posts", postsGroup)
  .group("/threads", threadsGroup)
  .group("/comments", commentsGroup);
