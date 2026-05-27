import {BookCopyStatus} from "../../enums";
import type {BookDTO, BooksDTO} from "./model";
import {author, book, genre, bookCopy, publisher} from "../../db";

type BookEntity = typeof book.$inferSelect;
type GenreEntity = typeof genre.$inferSelect;
type AuthorEntity = typeof author.$inferSelect;
type BookCopyEntity = typeof bookCopy.$inferSelect;
type PublisherEntity = typeof publisher.$inferSelect;

// type TagEntity = typeof tag.$inferSelect; // TODO: Implement tags feature

interface BookWithRelations extends BookEntity {
    bookGenres: {
        genre: GenreEntity;
    }[];
    bookAuthors: {
        author: AuthorEntity;
    }[];
    // bookTags: { // TODO: Implement tags feature
    //     tag: TagEntity;
    // }[];
    bookCopies: BookCopyEntity[];
    publisher: PublisherEntity;
}

export const mapToBookDTO = (entity: BookWithRelations): BookDTO => {
    const totalCopies = entity.bookCopies.length;
    const availableCopies = entity.bookCopies.filter(copy => copy.status === BookCopyStatus.AVAILABLE).length;
    
    return {
        id: entity.id,
        title: entity.title,
        language: entity.language,
        publisherId: entity.publisherId,
        publisherName: entity.publisher.name,
        yearPublished: entity.yearPublished,
        description: entity.description,
        coverImageUrl: entity.coverImageKey ? `/books/${entity.id}/cover` : null,
        genres: entity.bookGenres.map((bg) => (bg.genre.name)),
        authors: entity.bookAuthors.map((ba) => (`${ba.author.firstName} ${ba.author.lastName}`)),
        availableCopies,
        totalCopies
    };
};

export const mapToBooksDTOs = (entities: BookWithRelations[], total: number, page: number, pageSize: number): BooksDTO => ({
    books: entities.map(mapToBookDTO),
    total: total,
    page: page,
    pageSize: pageSize
});
