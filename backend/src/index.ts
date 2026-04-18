import { Elysia } from "elysia";

import {ConflictError, ForbiddenError, NotFoundError, UnauthorizedError, UnprocessableError} from "./errors";

import { authModule } from "./modules/auth";
import { authorModule } from "./modules/author";
import { bookModule } from "./modules/book";
import { genreModule } from "./modules/genre";
import { loanModule } from "./modules/loan";
import { reservationModule } from "./modules/reservation";

// TODO - ten exception handling by som dal niekam inam nech je to clean
// TODO - asi by bolo spraviť aj OpenApi kvôli FE, ale idk asi to nie je nutne, treba sa ich spytat

const app = new Elysia()
  .onError(({ code, error, set }) => {
    if (code === "VALIDATION") {
      set.status = 400;
      return { message: error.message };
    }
    if (error instanceof UnauthorizedError) {
      set.status = 401;
      return { message: error.message };
    }
    if (error instanceof ForbiddenError) {
          set.status = 403;
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
  .use(authorModule)
  .use(bookModule)
  .use(genreModule)
  .use(loanModule)
  .use(reservationModule)
  .listen(3000);

console.log(
  `🦊 Elysia is running at ${app.server?.hostname}:${app.server?.port}`
);
