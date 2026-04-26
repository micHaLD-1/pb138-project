import { Elysia } from "elysia";
import { cookie } from "@elysiajs/cookie";
import { sessionStoreManager } from "./session";

export const authMiddleware = new Elysia()
    .use(cookie())
    .derive(async ({ cookie }) => { // prida user do kontextu pre vsetky routy
        const sessionId = cookie.sessionId as unknown as string | undefined; // prečita sessionId z cookie
        if (!sessionId) return { user: null };

        const session = sessionStoreManager.get(sessionId);
        if (!session) return { user: null };

        return {
            user: {
                userId: session.userId,
                role: session.role,
            }
        };
    });

export const isAuthenticated = (user: any) => {
    if (!user) throw new Error("Unauthorized");
};

export const hasRole = (user: any, roles: string[]) => {
    isAuthenticated(user);
    if (!roles.includes(user.role)) throw new Error("Forbidden: Insufficient permissions");
};
