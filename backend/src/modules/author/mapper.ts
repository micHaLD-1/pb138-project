import type {AuthorDTO, AuthorsDTO} from "./model";

import { author } from "../../db";
type AuthorEntity = typeof author.$inferSelect;

export const mapToAuthorDTO = (entity: AuthorEntity): AuthorDTO => ({
    id: entity.id,
    name: `${entity.firstName} ${entity.lastName}`
});

export const mapToAuthorsDTOs = (entities: AuthorEntity[], total: number, page: number, pageSize: number): AuthorsDTO => ({
    authors: entities.map(mapToAuthorDTO),
    total: total,
    page: page,
    pageSize: pageSize
});
