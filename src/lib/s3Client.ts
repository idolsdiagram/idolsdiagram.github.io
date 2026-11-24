import { S3Client } from "@aws-sdk/client-s3";

export const s3Client = new S3Client({
    region: import.meta.env.S3_REGION || "ap-northeast-1",
    credentials: {
        accessKeyId: import.meta.env.S3_ACCESS_KEY_ID,
        secretAccessKey: import.meta.env.S3_SECRET_ACCESS_KEY,
    },
    forcePathStyle: true,
});
