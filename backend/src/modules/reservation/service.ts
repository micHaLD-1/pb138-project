import { eq, sql, and } from "drizzle-orm";

import { NotFoundError, ConflictError } from "../../errors";
import { db, reservation, bookCopy, book } from "../../db";
import { ReservationStatus, BookCopyStatus } from "../../enums";

import {mapToReservationDTO, mapToReservationsDTO} from "./mapper";
import type { ReservationCreationDTO, ReservationUpdateDTO, ReservationDTO, ReservationsDTO } from "./model";

export const reservationService = {

    findAll: async (page: number, pageSize: number): Promise<ReservationsDTO> => {
        const offset = (page - 1) * pageSize;
        const [totalRecords] = await db.select({ count: sql<number>`count(*)` }).from(reservation);
        
        const result = await db.query.reservation.findMany({
            limit: pageSize,
            offset,
            with: {
                user: true,
                bookCopy: {
                    with: { book: true }
                }
            },
            orderBy: (reservation, { desc }) => [desc(reservation.dateOfReservation)]
        });
        
        return mapToReservationsDTO(result, Number(totalRecords.count), page, pageSize);
    },

    findById: async (id: number): Promise<ReservationDTO> => {
        const result = await db.query.reservation.findFirst({
            where: eq(reservation.id, id),
            with: {
                user: true,
                bookCopy: {
                    with: { book: true }
                }
            }
        });
        
        if (!result) throw new NotFoundError(`Reservation ${id} not found`);
        return mapToReservationDTO(result);
    },

    create: async (data: ReservationCreationDTO) => {
        return await db.transaction(async (tx) => {
            const { bookId, userId, fromDate, toDate, price } = data;

            // Find an available copy of the book (queue-based assignment)
            const [availableCopy] = await tx
                .select()
                .from(bookCopy)
                .where(and(
                    eq(bookCopy.bookId, bookId),
                    eq(bookCopy.status, BookCopyStatus.AVAILABLE)
                ))
                .limit(1);

            if (!availableCopy) {
                throw new ConflictError("No copies available for this book");
            }

            // Check if user already has an active reservation for this book
            const existingReservation = await tx.query.reservation.findFirst({
                where: eq(reservation.userId, userId)
            });

            if (existingReservation && existingReservation.status === ReservationStatus.ACTIVE) {
                throw new ConflictError(`User already has an active reservation`);
            }

            // Calculate validity date (48 hours from now)
            const validityOfPickUpUntil = new Date();
            validityOfPickUpUntil.setHours(validityOfPickUpUntil.getHours() + 48);

            // Create reservation
            const [createdReservation] = await tx.insert(reservation).values({
                userId,
                bookCopyId: availableCopy.id,
                fromDate: new Date(fromDate).toISOString().split('T')[0],
                toDate: new Date(toDate).toISOString().split('T')[0],
                price,
                status: ReservationStatus.ACTIVE,
                dateOfReservation: new Date().toISOString().split('T')[0],
                validityOfPickUpUntil: validityOfPickUpUntil.toISOString().split('T')[0]
            }).returning();

            // Update book copy status to reserved
            await tx
                .update(bookCopy)
                .set({ status: BookCopyStatus.RESERVED })
                .where(eq(bookCopy.id, availableCopy.id));

            // Get the complete reservation with relations
            const result = await tx.query.reservation.findFirst({
                where: eq(reservation.id, createdReservation.id),
                with: {
                    user: true,
                    bookCopy: {
                        with: { book: true }
                    }
                }
            });

            if (!result) throw new NotFoundError("Reservation not found after creation");
            return mapToReservationDTO(result);
        });
    },

    update: async (id: number, data: ReservationUpdateDTO): Promise<ReservationDTO> => {
        return await db.transaction(async (tx) => {
            const [existing] = await tx.select().from(reservation).where(eq(reservation.id, id));
            if (!existing) throw new NotFoundError(`Reservation ${id} not found`);
            
            if (existing.status !== ReservationStatus.ACTIVE) {
                throw new ConflictError(`Cannot update reservation ${id} with status ${existing.status}`);
            }
            
            const [updated] = await tx
                .update(reservation)
                .set(data)
                .where(eq(reservation.id, id))
                .returning();
                
            const result = await tx.query.reservation.findFirst({
                where: eq(reservation.id, updated.id),
                with: {
                    user: true,
                    bookCopy: {
                        with: { book: true }
                    }
                }
            });
            
            if (!result) throw new NotFoundError("Reservation not found after update");
            return mapToReservationDTO(result);
        });
    },

    cancel: async (id: number): Promise<void> => {
        return await db.transaction(async (tx) => {
            const [existing] = await tx.select().from(reservation).where(eq(reservation.id, id));
            if (!existing) throw new NotFoundError(`Reservation ${id} not found`);
            
            if (existing.status !== ReservationStatus.ACTIVE) {
                throw new ConflictError(`Cannot cancel reservation ${id} with status ${existing.status}`);
            }
            
            // Update reservation status
            await tx
                .update(reservation)
                .set({ status: ReservationStatus.CANCELED })
                .where(eq(reservation.id, id));
                
            // Make book copy available again
            await tx
                .update(bookCopy)
                .set({ status: BookCopyStatus.AVAILABLE })
                .where(eq(bookCopy.id, existing.bookCopyId));
        });
    },

    // Method to check and expire reservations
    expireReservations: async (): Promise<void> => {
        const now = new Date();
        
        const expiredReservations = await db
            .select()
            .from(reservation)
            .where(and(
                eq(reservation.status, ReservationStatus.ACTIVE),
                sql`${reservation.validityOfPickUpUntil} < ${now.toISOString()}`
            ));
            
        for (const expiredReservation of expiredReservations) {
            await db.transaction(async (tx) => {
                await tx
                    .update(reservation)
                    .set({ status: ReservationStatus.CANCELED })
                    .where(eq(reservation.id, expiredReservation.id));
                    
                await tx
                    .update(bookCopy)
                    .set({ status: BookCopyStatus.AVAILABLE })
                    .where(eq(bookCopy.id, expiredReservation.bookCopyId));
            });
        }
    }
};
