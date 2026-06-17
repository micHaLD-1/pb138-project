import { Elysia, t } from "elysia";
import { cookie } from "@elysiajs/cookie";

import { UserRole } from "../../enums";
import { booksService} from "./service";
import { hasRole } from "../auth/middleware";
import { UnprocessableError } from "../../errors";
import { reviewsService } from "../reviews/service";
import { sessionStoreManager } from "../auth/session";
import { BookCreationRequest, BookUpdateRequest} from "./model";

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

bookModule.get("/", async ({ query: { page, size, search, genreId, authorId } }) => {
  return await booksService.findAll(page, size, {
    search: search || undefined,
    genreId: genreId ?? undefined,
    authorId: authorId ?? undefined,
  });
}, {
  query: t.Object({
    page: t.Numeric({ minimum: 1 }),
    size: t.Numeric({ minimum: 1 }),
    search: t.Optional(t.String()),
    genreId: t.Optional(t.Numeric()),
    authorId: t.Optional(t.Numeric()),
  })
});

bookModule.get("/:id", async ({ params: { id } }) => {
  return await booksService.findById(Number(id));
});

bookModule.get("/:id/cover", async ({ params: { id } }) => {
  const redirectUrl = await booksService.getCoverImageRedirectUrl(Number(id));
  return new Response(null, {
    status: 302,
    headers: {
      Location: redirectUrl,
    },
  });
});

bookModule.post("/", async ({ body, set, user }) => {
  hasRole(user, [UserRole.ADMIN, UserRole.STAFF]);
  set.status = 201;
  return await booksService.create(body);
}, {
  body: BookCreationRequest,
});

bookModule.put("/:id", async ({ params: { id }, body, set, user }) => {
  hasRole(user, [UserRole.ADMIN, UserRole.STAFF]);
  await booksService.update(Number(id), body);
  set.status = 204;
}, {
  body: BookUpdateRequest,
});

bookModule.post("/:id/cover", async ({ params: { id }, request, set, user }) => {
  hasRole(user, [UserRole.ADMIN, UserRole.STAFF]);

  const formData = await request.formData();
  const file = formData.get("file");
  if (!(file instanceof File)) {
    throw new UnprocessableError("Missing cover image file");
  }

  await booksService.uploadCoverImage(Number(id), file);
  set.status = 204;
});

bookModule.delete("/:id", async ({ params: { id }, set, user }) => {
  hasRole(user, [UserRole.ADMIN, UserRole.STAFF]);
  await booksService.remove(Number(id));
  set.status = 204;
});

bookModule.get("/:id/reviews", async ({ params: { id }, query: {page, size} }) => {
  return await reviewsService.findByBookId(Number(id), page, size);
}, {
  query: t.Object({page: t.Numeric({ minimum: 1 }), size: t.Numeric({ minimum: 1 })})
});
