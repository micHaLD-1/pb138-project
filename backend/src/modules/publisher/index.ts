import { Elysia, t } from "elysia";

import { publisherService } from "./service";
import { PublisherCreationRequest, PublisherUpdateRequest } from "./model";
import { authMiddleware, hasRole } from "../auth/middleware";
import { UserRole } from "../../enums";

export const publisherModule = new Elysia({ prefix: "/publishers" })
    .use(authMiddleware);

publisherModule.get("/", async ({ query: { page, size } }) => {
    return await publisherService.findAll(page, size);
}, {
    query: t.Object({ page: t.Numeric({ minimum: 1 }), size: t.Numeric({ minimum: 1 }) })
});

publisherModule.get("/:id", async ({ params: { id } }) => {
    return { publisher: await publisherService.findById(Number(id)) };
});

publisherModule.post("/", async (ctx: any) => {
    hasRole(ctx.user, [UserRole.ADMIN, UserRole.STAFF]);
    ctx.set.status = 201;
    return { publisher: await publisherService.create(ctx.body) };
}, {
    body: PublisherCreationRequest
});

publisherModule.put("/:id", async (ctx: any) => {
    hasRole(ctx.user, [UserRole.ADMIN, UserRole.STAFF]);
    await publisherService.update(Number(ctx.params.id), ctx.body);
    ctx.set.status = 204;
}, {
    body: PublisherUpdateRequest
});

publisherModule.delete("/:id", async (ctx: any) => {
    hasRole(ctx.user, [UserRole.ADMIN, UserRole.STAFF]);
    await publisherService.remove(Number(ctx.params.id));
    ctx.set.status = 204;
});
