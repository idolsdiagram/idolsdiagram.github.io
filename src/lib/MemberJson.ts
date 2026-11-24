import { GetObjectCommand } from "@aws-sdk/client-s3";
import { s3Client } from "./s3Client";

export const memberJson: {
    [key: string]: {
        status?: boolean;
        name: string;
        period?: string[];
        port?: string;
        type: string;
    }
} = await (async () => {
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
