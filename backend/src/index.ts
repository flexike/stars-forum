import { Elysia } from "elysia";
import { apiRouter } from "./api";

const app = new Elysia()
  .get("/", () => "Stars forum is running!")

  .get("/welcome", () => ({
    status: "ok",
    message: "Welcome to STARS!",
  }))

  // /api/users routes
  .use(apiRouter)

  .listen(8080);
console.log(` STARS forum back-end is running on: `, app.server?.port);
