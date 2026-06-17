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

reviewsModule.get("/me", async ({ query: { bookId }, user }) => {
  isAuthenticated(user);
  const review = await reviewsService.findByUserAndBook(user!.userId, Number(bookId));
  return { review };
}, {
  query: t.Object({ bookId: t.Numeric({ minimum: 1 }) })
});

reviewsModule.get("/book/:bookId", async ({ params: { bookId }, query: {page, size} }) => {
  return await reviewsService.findByBookId(Number(bookId), page, size);
}, {
  query: t.Object({page: t.Numeric({ minimum: 1 }), size: t.Numeric({ minimum: 1, maximum: 100 })})
});

reviewsModule.post("/", async ({ body, set, user }) => {
  isAuthenticated(user);
  set.status = 201;
  return { review: await reviewsService.create(user!.userId, body) };
}, {
  body: ReviewCreationRequest
});

reviewsModule.put("/:id", async ({ params: { id }, body, set, user }) => {
  isAuthenticated(user);
  set.status = 204;
  await reviewsService.update(Number(id), user!.userId, body);
}, {
  body: ReviewUpdateRequest
});

reviewsModule.delete("/:id", async ({ params: { id }, set, user }) => {
  isAuthenticated(user);
  await reviewsService.remove(Number(id), user!.userId);
  set.status = 204;
});
