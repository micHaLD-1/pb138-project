import {genre} from "../../db";
import type {GenreDTO, GenresDTO} from "./model";

type GenreEntity = typeof genre.$inferSelect;

export const mapToGenreDTO = (entity: GenreEntity): GenreDTO => ({
    id: entity.id,
    name: entity.name,
});

export const mapToGenresDTO = (entities: GenreEntity[], total: number, page: number, pageSize: number): GenresDTO => ({
    genres: entities.map(mapToGenreDTO),
    total: total,
    page: page,
    pageSize: pageSize
});
