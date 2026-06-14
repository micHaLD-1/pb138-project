import { Elysia, t } from "elysia";
import { cookie } from "@elysiajs/cookie";

import { reviewsService } from "./service";
import { isAuthenticated } from "../auth/middleware";
import { sessionStoreManager } from "../auth/session";
import { ReviewCreationRequest, ReviewUpdateRequest } from "./model";

export const reviewsModule = new Elysia({ prefix: "/reviews" })
  .use(cookie())
  .derive(async ({ cookie }) => {
    const sessionCookie = cookie.sessionId;
    const sessionId = typeof sessionCookie === 'string' ? sessionCookie : sessionCookie?.value;
    
    if (!sessionId || typeof sessionId !== 'string') {
      return { user: null };
    }

    const session = sessionStoreManager.get(sessionId);
    if (!session) {
      return { user: null };
    }

    return {
      user: {
        userId: session.userId,
        role: session.role,
      }
    };
  });

reviewsModule.get("/me", async (ctx: any) => {
  isAuthenticated(ctx.user);
  const bookId = Number(ctx.query.bookId);
  const review = await reviewsService.findByUserAndBook(ctx.user.userId, bookId);
  return { review };
}, {
  query: t.Object({ bookId: t.Numeric({ minimum: 1 }) })
});

// idk ci dava viac zmysel toto alebo /books/:id/reviews cize su obe
reviewsModule.get("/book/:bookId", async ({ params: { bookId }, query: {page, size} }) => {
  return await reviewsService.findByBookId(Number(bookId), page, size);
}, {
  query: t.Object({page: t.Numeric({ minimum: 1 }), size: t.Numeric({ minimum: 1 })})
});

reviewsModule.post("/", async (ctx: any) => {
  isAuthenticated(ctx.user);
  ctx.set.status = 201;
  return { review: await reviewsService.create(ctx.user.userId, ctx.body) };
}, {
  body: ReviewCreationRequest
});

reviewsModule.put("/:id", async (ctx: any) => {
  isAuthenticated(ctx.user);
  ctx.set.status = 204;
  await reviewsService.update(Number(ctx.params.id), ctx.user.userId, ctx.body);
}, {
  body: ReviewUpdateRequest
});

reviewsModule.delete("/:id", async (ctx: any) => {
  isAuthenticated(ctx.user);
  await reviewsService.remove(Number(ctx.params.id), ctx.user.userId);
  ctx.set.status = 204;
});
