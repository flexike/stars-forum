import { Elysia } from 'elysia'
import {usersRouter} from "./routes/users";

const app = new Elysia()
    .get('/', () => 'Stars forum is running!')

    .get('/welcome', () => ({
        status: 'ok',
        message: "Welcome to STARS!"
    }))

    // /api/users routes
    .use(usersRouter)



.listen(8080)
console.log(` STARS forum back-end is running on: `, app.server?.port)