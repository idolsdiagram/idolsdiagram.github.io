import { GetObjectCommand, S3Client } from "@aws-sdk/client-s3";
import { groupJson } from "./GroupJson";

export const spotifyJson: {
    key: string;
    name: string;
    id: string;
    popularity: number;
    followers: number;
}[] = await (async () => {
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
            Bucket: import.meta.env.S3_BUCKET_SPOTIFY,
            Key: "daily/artists_daily.json",
        })
    );

    const bodyContents = await response.Body?.transformToString();
    if (!bodyContents) {
        throw new Error("Failed to fetch index.json from S3");
    }

    const artistDaily: {
        key: string;
        name: string;
        id: string;
        popularity: number;
        followers: number;
    }[] = JSON.parse(bodyContents);

    return artistDaily.filter(
        (item) => item.popularity > 0).filter((item) => groupJson.data[item.name] !== undefined);
})();