import { Elysia, t } from "elysia";
import { booksService} from "./service";
import { BookCreationRequest, BookUpdateRequest} from "./model";

export const booksModule = new Elysia({ prefix: "/books" });

booksModule.get("/", async ({ query: { page, size } }) => {
  return await booksService.findAll(page, size);
}, {
    query: t.Object({page: t.Numeric({ minimum: 1 }), size: t.Numeric({ minimum: 1 })})
});

booksModule.get("/:id", async ({ params: { id } }) => {
  return await booksService.findById(Number(id));
});

booksModule.post("/", async ({ body, set }) => {
  set.status = 201;
  return { author: await booksService.create(body) };
}, {
  body: BookCreationRequest,
});

booksModule.put("/:id", async ({ params: { id }, body, set }) => {
  await booksService.update(Number(id), body);
  set.status = 204;
}, {
  body: BookUpdateRequest,
});

booksModule.delete("/:id", async ({ params: { id }, set }) => {
  await booksService.remove(Number(id));
  set.status = 204;
});

// TODO
booksModule.get("/:id/reviews", ({ params: { id } }) => {
  return { data: [] };
});

// TODO - bud pridame do creation/update requestu  IDčka autorov a žanrov alebo implementujeme tieto endpointy dole nižšie

// Authors - we'll see
// booksModule.get("/:id/authors", ({ params: { id } }) => {
//   return { data: [] };
// });
//
// booksModule.post("/:id/authors", ({ params: { id }, body }) => {
//   return { message: `Author ${body.authorId} added to book ${id}` };
// }, {
//   body: BookAuthorRequest,
// });

// Genres - we'll see
// booksModule.get("/:id/genres", ({ params: { id } }) => {
//   return { data: [] };
// });
//
// booksModule.post("/:id/genres", ({ params: { id }, body }) => {
//   return { message: `Genre ${body.genreId} added to book ${id}` };
// }, {
//   body: BookGenreRequest,
// });
