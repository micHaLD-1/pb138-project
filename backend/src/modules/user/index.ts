import { Elysia, t } from "elysia";
import { cookie } from "@elysiajs/cookie";
import { eq, sql } from "drizzle-orm";

import { db, user as userTable } from "../../db";
import { UserRole } from "../../enums";
import { hasRole } from "../auth/middleware";
import { sessionStoreManager } from "../auth/session";
import { NotFoundError } from "../../errors";
import { UpdateRoleRequest } from "./model";

export const userModule = new Elysia({ prefix: "/users" })
    .use(cookie())
    .derive(async ({ cookie }) => {
        const sessionCookie = cookie.sessionId;
        const sessionId = typeof sessionCookie === 'string' ? sessionCookie : sessionCookie?.value;
        if (!sessionId || typeof sessionId !== 'string') return { user: null };
        const session = sessionStoreManager.get(sessionId);
        if (!session) return { user: null };
        return { user: { userId: session.userId, role: session.role } };
    });

// GET /users?page=1&size=20 — list all users (admin only)
userModule.get("/", async ({ query: { page, size }, user }) => {
    hasRole(user, [UserRole.ADMIN]);

    const offset = (page - 1) * size;

    const [totalRecords] = await db.select({ count: sql<number>`count(*)` }).from(userTable);
    const users = await db
        .select({
            id: userTable.id,
            firstName: userTable.firstName,
            lastName: userTable.lastName,
            email: userTable.email,
            role: userTable.role,
        })
        .from(userTable)
        .limit(size)
        .offset(offset);

    return {
        users,
        total: Number(totalRecords.count),
        page,
        pageSize: size,
    };
}, {
    query: t.Object({
        page: t.Numeric({ minimum: 1 }),
        size: t.Numeric({ minimum: 1 }),
    }),
});

// PUT /users/:id/role — change a user's role (admin only)
userModule.put("/:id/role", async ({ params: { id }, body, set, user }) => {
    hasRole(user, [UserRole.ADMIN]);

    const targetId = Number(id);

    if (user!.userId === targetId) {
        set.status = 400;
        return { message: "Cannot change your own role" };
    }

    const [updated] = await db
        .update(userTable)
        .set({ role: body.role })
        .where(eq(userTable.id, targetId))
        .returning();

    if (!updated) throw new NotFoundError(`User ${targetId} not found`);

    return {
        id: updated.id,
        firstName: updated.firstName,
        lastName: updated.lastName,
        email: updated.email,
        role: updated.role,
    };
}, {
    body: UpdateRoleRequest,
});
