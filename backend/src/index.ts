import { Elysia } from "elysia";
import { authModule } from "./modules/auth";
import { booksModule } from "./modules/books";
import { authorsModule } from "./modules/authors";
import { genresModule } from "./modules/genres";
import { branchesModule } from "./modules/branches";
import { loansModule } from "./modules/loans";
import { reservationsModule } from "./modules/reservations";
import { usersModule } from "./modules/users";
import { staffModule } from "./modules/staff";

const app = new Elysia()
  .get("/", () => "Library API")
  .use(authModule)
  .use(booksModule)
  .use(authorsModule)
  .use(genresModule)
  .use(branchesModule)
  .use(loansModule)
  .use(reservationsModule)
  .use(usersModule)
  .use(staffModule)
  .listen(3000);

console.log(
  `🦊 Elysia is running at ${app.server?.hostname}:${app.server?.port}`
);
