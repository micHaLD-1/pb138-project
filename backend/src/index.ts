import { Elysia } from "elysia";

import {ConflictError, ForbiddenError, NotFoundError, UnauthorizedError, UnprocessableError} from "./errors";

import { authModule } from "./modules/auth";
import { userModule } from "./modules/user";
import { authorModule } from "./modules/author";
import { bookModule } from "./modules/book";
import { genreModule } from "./modules/genre";
import { loanModule } from "./modules/loan";
import { publisherModule } from "./modules/publisher";
import { reservationModule } from "./modules/reservation";
import { storageService } from "./modules/storage";
import { bookCoverSeedService } from "./modules/storage/book-cover-seed";
import { reviewsModule } from "./modules/reviews";
import { rulesModule } from "./modules/rules";
import { rulesService } from "./modules/rules/service";
import { authService } from "./modules/auth/service";

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
  .use(userModule)
  .use(authorModule)
  .use(bookModule)
  .use(genreModule)
  .use(publisherModule)
  .use(loanModule)
  .use(reservationModule)
  .use(reviewsModule)
  .use(rulesModule)
  .listen(3000);

console.log(
  `🦊 Elysia is running at ${app.server?.hostname}:${app.server?.port}`
);

// Initialize default library settings and admin user
rulesService.initializeDefaults().catch(console.error);
authService.initializeDefaults().catch(console.error);
storageService.initializeDefaults().catch(console.error);
bookCoverSeedService.seedFromFolder().catch(console.error);
