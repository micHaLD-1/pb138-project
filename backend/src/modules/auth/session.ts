import { UserRole } from "../../enums";

interface Session {
    userId: number;
    role: UserRole;
    createdAt: Date;
}

const sessionStore = new Map<string, Session>();

// 24 Hours in milliseconds (ms)
const SESSION_MAX_AGE_MS = 24 * 60 * 60 * 1000;

export const sessionStoreManager = {
    create: (userId: number, role: UserRole): string => {
        const sessionId = crypto.randomUUID();
        sessionStore.set(sessionId, {
            userId,
            role,
            createdAt: new Date(),
        });
        return sessionId;
    },

    get: (sessionId: string): Session | null => {
        const session = sessionStore.get(sessionId);
        if (!session) return null;

        const expired = Date.now() - session.createdAt.getTime() > SESSION_MAX_AGE_MS;
        if (expired) {
            sessionStore.delete(sessionId);
            return null;
        }

        return session;
    },

    delete: (sessionId: string): void => {
        sessionStore.delete(sessionId);
    },
};
