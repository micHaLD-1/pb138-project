import { Elysia, t } from "elysia";
import { cookie } from "@elysiajs/cookie";

import { UserRole } from "../../enums";
import { hasRole } from "../auth/middleware";
import { sessionStoreManager } from "../auth/session";

import { newsletterService } from "./service";
import { NewsletterCreationRequest, FeedbackCreationRequest } from "./model";

export const newsletterModule = new Elysia({ prefix: "/newsletter" })
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

// Admin-only: Create a newsletter
newsletterModule.post("/", async ({ body, set, user }) => {
  hasRole(user, [UserRole.ADMIN]);
  set.status = 201;
  return { newsletter: await newsletterService.create(user!.userId, body) };
}, {
  body: NewsletterCreationRequest
});

// Admin-only: List all newsletters (paginated)
newsletterModule.get("/", async ({ query: { page, size }, user }) => {
  hasRole(user, [UserRole.ADMIN]);
  return await newsletterService.findAll(Number(page), Number(size));
}, {
  query: t.Object({ page: t.Numeric({ minimum: 1 }), size: t.Numeric({ minimum: 1 }) })
});

// Admin-only: Get newsletter details
newsletterModule.get("/:id", async ({ params: { id }, user }) => {
  hasRole(user, [UserRole.ADMIN]);
  return { newsletter: await newsletterService.findById(Number(id)) };
});

// Admin-only: Sync all users to Brevo contact list
newsletterModule.post("/sync-contacts", async ({ set, user }) => {
  hasRole(user, [UserRole.ADMIN]);
  set.status = 200;
  return await newsletterService.syncContactsToBrevo();
});

// Admin-only: Send a newsletter campaign via Brevo
newsletterModule.post("/:id/send", async ({ params: { id }, set, user }) => {
  hasRole(user, [UserRole.ADMIN]);
  set.status = 200;
  return await newsletterService.sendCampaign(Number(id));
});

// Feedback routes (under /feedback to not pollute newsletter endpoints)
export const feedbackModule = new Elysia({ prefix: "/feedback" })
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

// Public: Submit feedback (no auth required)
feedbackModule.post("/", async ({ body, set }) => {
  set.status = 201;
  return { feedback: await newsletterService.submitFeedback(body) };
}, {
  body: FeedbackCreationRequest
});

// Admin-only: List all feedbacks (paginated)
feedbackModule.get("/", async ({ query: { page, size }, user }) => {
  hasRole(user, [UserRole.ADMIN]);
  return await newsletterService.findAllFeedbacks(Number(page), Number(size));
}, {
  query: t.Object({ page: t.Numeric({ minimum: 1 }), size: t.Numeric({ minimum: 1 }) })
});