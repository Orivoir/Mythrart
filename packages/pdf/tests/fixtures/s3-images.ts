
/**
 * Role: Upload image fixtures to S3-compatible storage and create presigned GET URLs.
 */

import { readFile } from "node:fs/promises";
import path from "node:path";
import { fileURLToPath } from "node:url";
import {
  GetObjectCommand,
  getSignedUrl,
  s3,
} from "@mythrart/s3";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const IMAGES_DIRECTORY = path.join(__dirname, "images");

const IMAGE_NAMES = [
  "fix-1.png",
  "fix-2.png",
  "fix-3.png",
  "fix-4.png",
  "fix-5.png",
  "fix-6.png",
  "fix-7.png",
  "fix-8.png",
] as const;

export interface UploadedImageFixture {
  key: string;
  url: string;
}

export async function uploadImageFixtures(): Promise<UploadedImageFixture[]> {
  const bucket = process.env.S3_BUCKET;

  if (!bucket) {
    throw new Error("S3_BUCKET must be configured for PDF integration tests.");
  }

  const prefix = `integration-tests/pdf/${crypto.randomUUID()}`;

  return Promise.all(
    IMAGE_NAMES.map(async (fileName) => {
      const filePath = path.join(IMAGES_DIRECTORY, fileName);
      const body = await readFile(filePath);
      const key = `${prefix}/${fileName}`;

      const { PutObjectCommand } = await import("@mythrart/s3");

      await s3.send(
        new PutObjectCommand({
          Bucket: bucket,
          Key: key,
          Body: body,
          ContentType: "image/png",
        }),
      );

      const url = await getSignedUrl(
        s3,
        new GetObjectCommand({
          Bucket: bucket,
          Key: key,
        }),
        { expiresIn: 3600 },
      );

      return { key, url };
    }),
  );
}
