import { GetObjectCommand, S3Client } from "@aws-sdk/client-s3";

export const groupJson: {
    data: {
        [key: string]: string | string[];
    };
    event: {
        [key: string]: {
            label: string;
            style: string;
            data: string[];
        }
    };
} = await (async () => {
    const s3Client = new S3Client({
        region: import.meta.env.S3_REGION || "ap-northeast-1",
        credentials: {
            accessKeyId: import.meta.env.S3_ACCESS_KEY_ID,
            secretAccessKey: import.meta.env.S3_SECRET_ACCESS_KEY,
        },
        forcePathStyle: true,
    });

    const response = await s3Client.send(
        new GetObjectCommand({
            Bucket: import.meta.env.S3_BUCKET_INDEX,
            Key: "index.json",
        })
    );

    const bodyContents = await response.Body?.transformToString();
    if (!bodyContents) {
        throw new Error("Failed to fetch index.json from S3");
    }

    return JSON.parse(bodyContents);
})();