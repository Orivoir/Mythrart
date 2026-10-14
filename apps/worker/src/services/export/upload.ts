import { randomUUID } from "node:crypto";
import { extname } from "node:path";

import type { ExportedFile } from "./exporters/types";

import {
  s3,
  uploadExport,
  HeadObjectCommand,
} from "@mythrart/s3";

export interface UploadExportFileParams {
  exportedFile: ExportedFile;
  userId: string;
}

export default async function uploadExportFile({
  exportedFile,
  userId
}: UploadExportFileParams) {

  const extension = extname(exportedFile.fileName);
  const key =
    `users/${userId}/EXPORT/${randomUUID()}${extension}`;

  // upload file at s3 using the uploadExport function for handler of Buffer or Readable streams
  const uploaded = await uploadExport({
    key,
    fileName: exportedFile.fileName,
    mimeType: exportedFile.mimeType,
    data: exportedFile.data,
  });

  const uploadedKey = uploaded.key;
  const uploadedBucket = uploaded.bucket;

  const metadata = await s3.send(
    new HeadObjectCommand({
      Bucket: uploaded.bucket,
      Key: uploaded.key,
    }),
  );

  // ensure the uploaded file has a valid content length
  if (metadata.ContentLength === undefined) {
    throw new Error("Unable to determine uploaded export size");
  }

  return {
    key: uploadedKey,
    bucket: uploadedBucket,
    sizeBytes: metadata.ContentLength
  }
}