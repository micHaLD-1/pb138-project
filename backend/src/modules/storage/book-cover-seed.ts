import { readdir, readFile } from "fs/promises";
import { resolve, extname } from "path";
import { eq } from "drizzle-orm";

import { db, book } from "../../db";
import { storageService } from "./index";

const seedFolder = process.env.BOOK_COVER_SEED_DIR || resolve(process.cwd(), "seeds/book-covers");

const contentTypeByExtension: Record<string, string> = {
    ".jpg": "image/jpeg",
    ".jpeg": "image/jpeg",
    ".png": "image/png",
    ".webp": "image/webp",
    ".gif": "image/gif",
};

export const bookCoverSeedService = {
    seedFromFolder: async (): Promise<void> => {
        let entries;

        try {
            entries = await readdir(seedFolder, { withFileTypes: true });
        } catch {
            console.log(`Book cover seed folder not found at ${seedFolder}, skipping`);
            return;
        }

        const files = entries.filter((entry) => entry.isFile());
        if (files.length === 0) {
            console.log(`Book cover seed folder ${seedFolder} is empty, skipping`);
            return;
        }

        for (const fileEntry of files) {
            const bookId = Number.parseInt(fileEntry.name, 10);
            if (Number.isNaN(bookId)) {
                console.log(`Skipping ${fileEntry.name}: filename must start with a book id like 1.jpg`);
                continue;
            }

            const filePath = resolve(seedFolder, fileEntry.name);
            const fileBuffer = await readFile(filePath);
            const fileExtension = extname(fileEntry.name).toLowerCase();
            const contentType = contentTypeByExtension[fileExtension] || "application/octet-stream";
            const objectKey = `book-covers/${bookId}/cover`;

            const [existingBook] = await db.select({ id: book.id }).from(book).where(eq(book.id, bookId));
            if (!existingBook) {
                console.log(`Skipping ${fileEntry.name}: book ${bookId} does not exist`);
                continue;
            }

            await storageService.uploadObject(
                objectKey,
                new File([fileBuffer], fileEntry.name, { type: contentType })
            );

            await db.update(book)
                .set({ coverImageKey: objectKey })
                .where(eq(book.id, bookId));

            console.log(`Uploaded seed book cover for book ${bookId}: ${fileEntry.name}`);
        }
    }
};