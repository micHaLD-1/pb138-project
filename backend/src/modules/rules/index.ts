import { Elysia, t } from "elysia";

import { rulesService } from "./service";
import { RulesUpdateRequest } from "./model";
import { UserRole } from "../../enums";

export const rulesModule = new Elysia({ prefix: "/rules" });

rulesModule.get("/", async () => {
  return await rulesService.getAll();
});

// TODO: auth
rulesModule.put("/", async ({ body, set }) => {
  set.status = 200;
  const userRole = UserRole.ADMIN; // TODO: auht
  return await rulesService.update(body, userRole);
}, {
  body: RulesUpdateRequest
});
