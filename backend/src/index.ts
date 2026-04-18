import { Elysia } from "elysia";
import { ConflictError, NotFoundError, UnprocessableError } from "./errors";

import { authModule } from "./modules/auth";
import { booksModule } from "./modules/books";
import { authorsModule } from "./modules/authors";
import { genresModule } from "./modules/genres";
import { loansModule } from "./modules/loans";
import { reservationsModule } from "./modules/reservations";
import { usersModule } from "./modules/users";
import { staffModule } from "./modules/staff";

const app = new Elysia()
  .onError(({ code, error, set }) => {
    if (code === "VALIDATION") {
      set.status = 400;
      return { message: error.message };
    }
    if (error instanceof NotFoundError) {
      set.status = 404;
      return { message: error.message };
    }
    if (error instanceof ConflictError) {
      set.status = 409;
      return { message: error.message };
    }
    if (error instanceof UnprocessableError) {
      set.status = 422;
      return { message: error.message };
    }
  })
  .get("/", () => "Library API")
  .use(authModule)
  .use(authorsModule)
  .use(booksModule)
  .use(genresModule)
  .use(loansModule)
  .use(reservationsModule)
  .use(staffModule)
  .use(usersModule)
  .listen(3000);

console.log(
  `🦊 Elysia is running at ${app.server?.hostname}:${app.server?.port}`
);
