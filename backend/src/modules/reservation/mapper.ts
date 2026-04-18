import type {ReservationDTO, ReservationsDTO} from "./model";

import {reservation} from "../../db";
type ReservationEntity = typeof reservation.$inferSelect;

export const mapToReservationDTO = (entity: ReservationEntity): ReservationDTO => ({
    id: entity.id,
    userId: entity.userId,
    bookCopyId: entity.bookCopyId,
    fromDate: entity.fromDate,
    toDate: entity.toDate,
    price: entity.price
});

export const mapToReservationsDTO = (entities: ReservationEntity[], total: number, page: number, pageSize: number): ReservationsDTO => ({
    reservations: entities.map(mapToReservationDTO),
    total: total,
    page: page,
    pageSize: pageSize
});
