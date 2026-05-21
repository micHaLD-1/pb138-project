import { z } from "zod";
import { UserRole } from "../../enums";

const roleEnum = z.enum(Object.values(UserRole) as [string, ...string[]]);

export const UserResponse = z.object({
    id: z.number().int(),
    firstName: z.string(),
    lastName: z.string(),
    email: z.string(),
    role: roleEnum,
});

export const UsersResponse = z.object({
    users: z.array(UserResponse),
    total: z.number().int(),
    page: z.number().int(),
    pageSize: z.number().int(),
});

export const UpdateRoleRequest = z.object({
    role: roleEnum,
});

export type UserDTO = z.infer<typeof UserResponse>;
export type UsersDTO = z.infer<typeof UsersResponse>;
export type UpdateRoleDTO = z.infer<typeof UpdateRoleRequest>;
