/**
 * Role: Verify Gotenberg HTML-to-PDF conversion against real MinIO image fixtures.
 *
 * Requirements:
 * - Gotenberg and MinIO running through the root Docker Compose.
 * - S3 credentials and bucket configured in the environment.
 * - GOTENBERG_URL points to the host-published Gotenberg port.
 * - S3_INTERNAL_ENDPOINT points to the S3 endpoint accessible from Gotenberg.
 *
 * HTML fixtures use presigned HTTP(S) URLs, never Base64 images.
 */

import { afterAll, beforeAll, describe, expect, it } from "vitest";
import { PDFParse } from "pdf-parse";
import {
  DeleteObjectCommand,
  GetObjectCommand,
  PutObjectCommand,
  S3Client,
  getSignedUrl,
  s3,
} from "@mythrart/s3";
import { readFile } from "node:fs/promises";
import path from "node:path";
import { fileURLToPath } from "node:url";
import type { Readable } from "node:stream";
import {
  MAX_MEAN_PIXEL_ERROR,
  meanPixelError,
  normalizeExtractedImage,
  normalizeSourceImage,
} from "../../helpers/sharp.js";

import { GotenbergClient } from "../../../src/gotenberg/client.js";
import { createHtmlSkeletons } from "../../fixtures/skeletons-html.js";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const IMAGES_DIRECTORY = path.resolve(__dirname, "../../fixtures/images");

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

const TEST_PREFIX = `integration-tests/pdf/${crypto.randomUUID()}`;
const uploadedKeys: string[] = [];

const bucket = process.env.S3_BUCKET;
const gotenbergUrl = process.env.GOTENBERG_URL;
const internalS3Endpoint = process.env.S3_INTERNAL_ENDPOINT;

function collectStream(stream: Readable): Promise<Buffer> {
  return (async () => {
    const chunks: Buffer[] = [];

    for await (const chunk of stream) {
      if (typeof chunk === "string") {
        chunks.push(Buffer.from(chunk));
      } else if (Buffer.isBuffer(chunk)) {
        chunks.push(chunk);
      } else {
        chunks.push(Buffer.from(chunk));
      }
    }

    return Buffer.concat(chunks);
  })();
}

describe("GotenbergClient integration", () => {
  const client = new GotenbergClient({
    baseUrl: gotenbergUrl ?? "http://127.0.0.1:3001",
    quality: "readable",
  });

  let imageUrls: string[] = [];
  let fixtures: ReturnType<typeof createHtmlSkeletons> = [];
  let presigningClient: S3Client | undefined;

  beforeAll(async () => {
    const required = {
      S3_BUCKET: bucket,
      S3_ENDPOINT: process.env.S3_ENDPOINT,
      S3_INTERNAL_ENDPOINT: internalS3Endpoint,
      S3_REGION: process.env.S3_REGION,
      S3_ACCESS_KEY: process.env.S3_ACCESS_KEY,
      S3_SECRET_KEY: process.env.S3_SECRET_KEY,
      GOTENBERG_URL: gotenbergUrl,
    };

    const missing = Object.entries(required)
      .filter(([, value]) => !value)
      .map(([name]) => name);

    if (missing.length > 0) {
      throw new Error(
        `Missing integration-test environment variables: ${missing.join(", ")}`,
      );
    }

    presigningClient = new S3Client({
      endpoint: internalS3Endpoint!,
      region: process.env.S3_REGION!,
      credentials: {
        accessKeyId: process.env.S3_ACCESS_KEY!,
        secretAccessKey: process.env.S3_SECRET_KEY!,
      },
      forcePathStyle: true,
    });

    imageUrls = await Promise.all(
      IMAGE_NAMES.map(async (fileName) => {
        const imagePath = path.join(IMAGES_DIRECTORY, fileName);
        const body = await readFile(imagePath);
        const key = `${TEST_PREFIX}/${fileName}`;

        expect(
          body.subarray(0, 8).equals(
            Buffer.from([137, 80, 78, 71, 13, 10, 26, 10]),
          ),
          `${fileName} should be a valid PNG fixture`,
        ).toBe(true);

        await s3.send(
          new PutObjectCommand({
            Bucket: bucket!,
            Key: key,
            Body: body,
            ContentType: "image/png",
          }),
        );

        uploadedKeys.push(key);

        return getSignedUrl(
          presigningClient!,
          new GetObjectCommand({
            Bucket: bucket!,
            Key: key,
          }),
          { expiresIn: 3600 },
        );
      }),
    );

    fixtures = createHtmlSkeletons(imageUrls);
  }, 60_000);

  afterAll(async () => {
    await Promise.all(
      uploadedKeys.map(async (key) => {
        try {
          await s3.send(
            new DeleteObjectCommand({
              Bucket: bucket!,
              Key: key,
            }),
          );
        } catch {
          // Best-effort cleanup of temporary S3 fixtures.
        }
      }),
    );

    presigningClient?.destroy();
  }, 30_000);

  it.each([
    "minimal",
    "editorial",
    "images",
    "multipage",
    "lists-and-table",
  ])(
    "converts the %s HTML fixture and verifies the generated PDF",
    async (name) => {
      const fixture = fixtures.find((item) => item.name === name);

      expect(fixture, `Fixture "${name}" should exist`).toBeDefined();

      const generated = await client.convertHtmlToPdf({
        html: fixture!.html,
      });

      expect(generated.mimeType).toBe("application/pdf");

      const pdfData = await collectStream(generated.data);

      expect(pdfData.byteLength).toBeGreaterThan(0);
      expect(pdfData.subarray(0, 5).toString("ascii")).toBe("%PDF-");

      const parser = new PDFParse({ data: pdfData });

      try {
        const textResult = await parser.getText();

        for (const expectedText of fixture!.expectedText) {
          expect(
            textResult.text,
            `PDF "${name}" should contain: "${expectedText}"`,
          ).toContain(expectedText);
        }

        if (name === "multipage") {
          expect(
            textResult.pages.length,
            "The multipage fixture should produce at least 3 PDF pages",
          ).toBeGreaterThanOrEqual(3);
        }

        if (name === "images") {
          const extractedResult = await parser.getImage();

          // Adapt this access if your installed pdf-parse version
          // returns images in a different structure.
          const extractedImages = extractedResult.pages.flatMap(
            (page) => page.images ?? [],
          );

          expect(
            extractedImages.length,
            "The PDF should contain all 8 extracted images",
          ).toBeGreaterThanOrEqual(IMAGE_NAMES.length);

          const sourceImages = await Promise.all(
            IMAGE_NAMES.map((fileName) =>
              normalizeSourceImage(path.join(IMAGES_DIRECTORY, fileName)),
            ),
          );

          const normalizedImages = await Promise.all(
            extractedImages.map((image) => normalizeExtractedImage(image)),
          );

          for (let i = 0; i < sourceImages.length; i++) {
            const source = sourceImages[i]!;

            // Compare each source against the closest extracted image.
            const errors = normalizedImages.map((extracted) =>
              meanPixelError(source, extracted),
            );

            const bestError = Math.min(...errors);

            expect(
              bestError,
              `Source image "${IMAGE_NAMES[i]}" should match an extracted PDF image`,
            ).toBeLessThanOrEqual(MAX_MEAN_PIXEL_ERROR);
          }
        }
      } finally {
        await parser.destroy();
      }
    },
    60_000,
  );
});