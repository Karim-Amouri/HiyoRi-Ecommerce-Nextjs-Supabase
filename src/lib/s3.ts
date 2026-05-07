import "server-only";
import { env } from "@/env.mjs";
import {
  GetObjectCommand,
  PutObjectCommand,
  PutObjectCommandInput,
  S3Client,
} from "@aws-sdk/client-s3";

export const s3Client = new S3Client({
  region: env.NEXT_PUBLIC_S3_REGION,
  endpoint: env.NEXT_PUBLIC_S3_ENDPOINT,
  forcePathStyle: !!env.NEXT_PUBLIC_S3_ENDPOINT,
  credentials: {
    accessKeyId: env.S3_ACCESS_KEY_ID,
    secretAccessKey: env.S3_SECRET_ACCESS_KEY,
  },
});

export const bufferToFile = async (buffer: Buffer) =>
  `data:image/webp;base64,${buffer.toString("base64")}`;

export const uploadImage = async (params: PutObjectCommandInput) => {
  const putObject = new PutObjectCommand(params);
  const s3Response = await s3Client.send(putObject);
  return s3Response;
};

export const getImageObject = async (key: string) => {
  const getObject = new GetObjectCommand({
    Bucket: env.NEXT_PUBLIC_S3_BUCKET,
    Key: key,
  });

  return s3Client.send(getObject);
};
