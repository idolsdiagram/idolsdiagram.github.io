import { GetObjectCommand } from "@aws-sdk/client-s3";
import { groupJson } from "./GroupJson";
import { s3Client } from "./s3Client";

export const spotifyJson: {
    key: string;
    name: string;
    id: string;
    popularity: number;
    followers: number;
}[] = await (async () => {
    const response = await s3Client.send(
        new GetObjectCommand({
            Bucket: import.meta.env.S3_BUCKET_SPOTIFY,
            Key: "daily/artists_daily.json",
        })
    );

    const bodyContents = await response.Body?.transformToString();
    if (!bodyContents) {
        throw new Error("Failed to fetch artistDaily.json from S3");
    }

    const artistDaily: {
        key: string;
        name: string;
        id: string;
        popularity: number;
        followers: number;
    }[] = JSON.parse(bodyContents);

    return artistDaily.filter(
        (item) => item.popularity > 0).filter((item) => groupJson.data[item.key] !== undefined);
})();
