import { GetObjectCommand } from "@aws-sdk/client-s3";
import { s3Client } from "./s3Client";

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
