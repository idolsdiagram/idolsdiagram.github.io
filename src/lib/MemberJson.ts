import { GetObjectCommand, S3Client } from "@aws-sdk/client-s3";

export const memberJson: {
    [key: string]: {
        status?: boolean;
        name: string;
        period?: string[];
        port?: string;
        type: string;
    }
} = await (async () => {
    const s3Client = new S3Client({
        region: import.meta.env.S3_REGION,
        credentials: {
            accessKeyId: import.meta.env.S3_ACCESS_KEY_ID,
            secretAccessKey: import.meta.env.S3_SECRET_ACCESS_KEY,
        },
        forcePathStyle: true,
    });
    const response = await s3Client.send(
        new GetObjectCommand({
            Bucket: import.meta.env.S3_BUCKET_INDEX,
            Key: "member.json",
        }),
    );
    const body = await response.Body?.transformToString();
    if (!body) {
        throw new Error("Failed to fetch members.json");
    }
    const data = JSON.parse(body);
    return data;
})();