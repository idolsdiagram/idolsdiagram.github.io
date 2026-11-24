import { GetObjectCommand } from "@aws-sdk/client-s3";
import { s3Client } from "./s3Client";

export const artistDailyJson: {
    key: string;
    name: string;
    id: string,
    popularity: number;
    followers: number;
}[] = await (async () => {
    const response = await s3Client.send(
        new GetObjectCommand({
            Bucket: import.meta.env.S3_BUCKET_SPOTIFY,
            Key: "daily/artists_daily.json",
        }),
    );
    const body = await response.Body?.transformToString();
    if (!body) {
        throw new Error("Failed to fetch artistDaily.json");
    }
    const data = JSON.parse(body);
    return data;
})();
