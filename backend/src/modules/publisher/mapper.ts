import { publisher } from "../../db";
import type { PublisherDTO, PublishersDTO } from "./model";

type PublisherEntity = typeof publisher.$inferSelect;

export const mapToPublisherDTO = (entity: PublisherEntity): PublisherDTO => ({
    id: entity.id,
    name: entity.name
});

export const mapToPublishersDTOs = (entities: PublisherEntity[], total: number, page: number, pageSize: number): PublishersDTO => ({
    publishers: entities.map(mapToPublisherDTO),
    total: total,
    page: page,
    pageSize: pageSize
});
