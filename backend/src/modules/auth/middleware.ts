import { Elysia } from "elysia";
import { cookie } from "@elysiajs/cookie";

import { sessionStoreManager } from "./session";
import { UnauthorizedError, ForbiddenError } from "../../errors";

export const authMiddleware = new Elysia()
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

export interface UserContext {
    userId: number;
    role: string;
}

export const isAuthenticated = (user: UserContext | null) => {
    if (!user) throw new UnauthorizedError("Unauthorized");
};

export const hasRole = (user: UserContext | null, roles: string[]) => {
    isAuthenticated(user);
    if (!user || !roles.includes(user.role)) throw new ForbiddenError("Forbidden: Insufficient permissions");
};
