import { Elysia, t } from "elysia";

import { reviewsService } from "./service";
import { ReviewCreationRequest, ReviewUpdateRequest } from "./model";

export const reviewsModule = new Elysia({ prefix: "/reviews" });

// idk ci dava viac zmysel toto alebo /books/:id/reviews cize su obe
reviewsModule.get("/book/:bookId", async ({ params: { bookId }, query: { page, size } }) => {
  return await reviewsService.findByBookId(Number(bookId), page, size);
}, {
  query: t.Object({ page: t.Numeric({ minimum: 1 }), size: t.Numeric({ minimum: 1 }) })
});

// TODO - userId auth

reviewsModule.post("/", async ({ body, set }) => {
  set.status = 201;
  const userId = 1; // TODO
  return await reviewsService.create(userId, body);
}, {
  body: ReviewCreationRequest
});

reviewsModule.put("/:id", async ({ params: { id }, body }) => {
  const userId = 1; // TODO
  return await reviewsService.update(Number(id), userId, body);
}, {
  body: ReviewUpdateRequest
});

reviewsModule.delete("/:id", async ({ params: { id }, set }) => {
  const userId = 1; // TODO
  await reviewsService.remove(Number(id), userId);
  set.status = 204;
});
