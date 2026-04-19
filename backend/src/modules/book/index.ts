import { Elysia, t } from "elysia";

import { booksService} from "./service";
import { reviewsService } from "../reviews/service";
import { BookCreationRequest, BookUpdateRequest} from "./model";

export const bookModule = new Elysia({ prefix: "/books" });

bookModule.get("/", async ({ query: { page, size } }) => {
  return await booksService.findAll(page, size);
}, {
    query: t.Object({page: t.Numeric({ minimum: 1 }), size: t.Numeric({ minimum: 1 })})
});

bookModule.get("/:id", async ({ params: { id } }) => {
  return await booksService.findById(Number(id));
});

bookModule.post("/", async ({ body, set }) => {
  set.status = 201;
  return await booksService.create(body);
}, {
  body: BookCreationRequest,
});

bookModule.put("/:id", async ({ params: { id }, body, set }) => {
  await booksService.update(Number(id), body);
  set.status = 204;
}, {
  body: BookUpdateRequest,
});

bookModule.delete("/:id", async ({ params: { id }, set }) => {
  await booksService.remove(Number(id));
  set.status = 204;
});

bookModule.get("/:id/reviews", async ({ params: { id }, query: { page, size } }) => {
  return await reviewsService.findByBookId(Number(id), page, size);
}, {
  query: t.Object({ page: t.Numeric({ minimum: 1 }), size: t.Numeric({ minimum: 1 }) })
});

// TODO - bud pridame do creation/update requestu  IDčka autorov a žanrov alebo implementujeme tieto endpointy dole nižšie

// booksModule.get("/:id/author", ({ params: { id } }) => {
//   return { data: [] };
// });

// booksModule.post("/:id/author", ({ params: { id }, body }) => {
//   return { message: `Author ${body.authorId} added to book ${id}` };
// }, {
//   body: BookAuthorRequest,
// });

// booksModule.get("/:id/genre", ({ params: { id } }) => {
//   return { data: [] };
// });

// booksModule.post("/:id/genre", ({ params: { id }, body }) => {
//   return { message: `Genre ${body.genreId} added to book ${id}` };
// }, {
//   body: BookGenreRequest,
// });
