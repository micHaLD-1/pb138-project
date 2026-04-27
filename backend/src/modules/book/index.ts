import { Elysia, t } from "elysia";
import { cookie } from "@elysiajs/cookie";

import { booksService} from "./service";
import { reviewsService } from "../reviews/service";
import { BookCreationRequest, BookUpdateRequest} from "./model";
import { hasRole } from "../auth/middleware";
import { sessionStoreManager } from "../auth/session";
import { UserRole } from "../../enums";

export const bookModule = new Elysia({ prefix: "/books" })
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

bookModule.get("/", async ({ query: { page, size } }) => {
  return await booksService.findAll(page, size);
}, {
  query: t.Object({page: t.Numeric({ minimum: 1 }), size: t.Numeric({ minimum: 1 })})
});

bookModule.get("/:id", async ({ params: { id } }) => {
  return await booksService.findById(Number(id));
});

bookModule.post("/", async (ctx: any) => {
  hasRole(ctx.user, [UserRole.ADMIN, UserRole.STAFF]);
  ctx.set.status = 201;
  return await booksService.create(ctx.body);
}, {
  body: BookCreationRequest,
});

bookModule.put("/:id", async (ctx: any) => {
  hasRole(ctx.user, [UserRole.ADMIN, UserRole.STAFF]);
  await booksService.update(Number(ctx.params.id), ctx.body);
  ctx.set.status = 204;
}, {
  body: BookUpdateRequest,
});

bookModule.delete("/:id", async (ctx: any) => {
  hasRole(ctx.user, [UserRole.ADMIN, UserRole.STAFF]);
  await booksService.remove(Number(ctx.params.id));
  ctx.set.status = 204;
});

bookModule.get("/:id/reviews", async ({ params: { id }, query: {page, size} }) => {
  return await reviewsService.findByBookId(Number(id), page, size);
}, {
  query: t.Object({page: t.Numeric({ minimum: 1 }), size: t.Numeric({ minimum: 1 })})
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
