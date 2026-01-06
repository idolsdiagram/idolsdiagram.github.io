import { GetObjectCommand, S3Client } from "@aws-sdk/client-s3";

export const artistDailyJson: {
    key: string;
    name: string;
    id: string,
    popularity: number;
    followers: number;
}[] = await (async () => {
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