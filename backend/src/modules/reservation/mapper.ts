import {reservation, user, bookCopy, book} from "../../db";
import type {ReservationDTO, ReservationsDTO} from "./model";

type BookEntity = typeof book.$inferSelect;
type UserEntity = typeof user.$inferSelect;
type BookCopyEntity = typeof bookCopy.$inferSelect;
type ReservationEntity = typeof reservation.$inferSelect;

interface ReservationWithRelations extends ReservationEntity {
    user: UserEntity;
    bookCopy: BookCopyEntity & {
        book: BookEntity;
    };
}

export const mapToReservationDTO = (entity: ReservationWithRelations): ReservationDTO => ({
    id: entity.id,
    userId: entity.userId,
    bookId: entity.bookCopy.bookId,
    bookCopyId: entity.bookCopyId,
    fromDate: entity.fromDate,
    toDate: entity.toDate,
    price: entity.price,
    status: entity.status,
});

export const mapToReservationsDTO = (entities: ReservationWithRelations[], total: number, page: number, pageSize: number): ReservationsDTO => ({
    reservations: entities.map(mapToReservationDTO),
    total: total,
    page: page,
    pageSize: pageSize
});
