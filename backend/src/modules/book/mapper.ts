import type {BookDTO, BooksDTO} from "./model";

import {author, book, genre} from "../../db";
type BookEntity = typeof book.$inferSelect;
type GenreEntity = typeof genre.$inferSelect;
type AuthorEntity = typeof author.$inferSelect;

interface BookWithRelations extends BookEntity {
    bookGenres: {
        genre: GenreEntity;
    }[];
    bookAuthors: {
        author: AuthorEntity;
    }[];
}

export const mapToBookDTO = (entity: BookWithRelations): BookDTO => ({
    id: entity.id,
    title: entity.title,
    language: entity.language,
    publisherId: entity.publisherId,
    yearPublished: entity.yearPublished,
    description: entity.description,
    genres: entity.bookGenres.map((bg) => (bg.genre.name)),
    authors: entity.bookAuthors.map((ba) => (`${ba.author.firstName} ${ba.author.lastName}`))
});

export const mapToBooksDTOs = (entities: BookWithRelations[], total: number, page: number, pageSize: number): BooksDTO => ({
    books: entities.map(mapToBookDTO),
    total: total,
    page: page,
    pageSize: pageSize
});
