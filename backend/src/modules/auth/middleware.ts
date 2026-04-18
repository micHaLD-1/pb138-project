import { Elysia } from "elysia";
import { jwt } from "@elysiajs/jwt";

export const authMiddleware = new Elysia()
    .use(jwt({ name: 'jwt', secret: process.env.JWT_SECRET || 'super-secret-key' }))
    .derive(async ({ jwt, headers: { authorization } }) => {
        if (!authorization) return { user: null };
        const token = authorization.split(' ')[1];
        const payload = await jwt.verify(token);
        return { user: payload };
    });

export const isAuthenticated = (user: any) => {
    if (!user) throw new Error("Unauthorized");
};

export const hasRole = (user: any, roles: string[]) => {
    isAuthenticated(user);
    if (!roles.includes(user.role)) throw new Error("Forbidden: Insufficient permissions");
};
