import { Client } from "minio";

const minioClient = new Client({
    endPoint: process.env.MINIO_ENDPOINT || "localhost",
    port: Number(process.env.MINIO_PORT) || 9000,
    useSSL: process.env.MINIO_USE_SSL === "true",
    accessKey: process.env.MINIO_ACCESS_KEY || "minioadmin",
    secretKey: process.env.MINIO_SECRET_KEY || "minioadmin",
});

const bucketName = process.env.MINIO_BUCKET || "book-covers";

const ensureBucket = async (): Promise<void> => {
    const exists = await minioClient.bucketExists(bucketName);
    if (!exists) {
        await minioClient.makeBucket(bucketName);
    }
};

export const storageService = {
    initializeDefaults: async (): Promise<void> => {
        await ensureBucket();
    },

    uploadObject: async (objectName: string, file: File): Promise<void> => {
        await ensureBucket();

        const buffer = Buffer.from(await file.arrayBuffer());
        await minioClient.putObject(bucketName, objectName, buffer, buffer.length, {
            "Content-Type": file.type || "application/octet-stream"
        });
    },

    removeObject: async (objectName: string): Promise<void> => {
        await ensureBucket();
        await minioClient.removeObject(bucketName, objectName);
    },

    getSignedDownloadUrl: async (objectName: string): Promise<string> => {
        await ensureBucket();
        return await minioClient.presignedGetObject(bucketName, objectName, 60 * 10);
    }
};
