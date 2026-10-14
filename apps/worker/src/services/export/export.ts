import {
  prisma,
  type ExportFormat,
} from "@mythrart/database";
import type {
  ExportJobData,
  ExportJobResult,
} from "../../validations/export.job.js";

import { toPrismaExportFormat } from "./utils/to-prisma-export-format.js";

import failExport from "./fail.js";
import createExportedFile from "./exporters/index.js";
import uploadExportFile from "./upload.js";
import recordsExportInDatabase from "./records.js";

export async function exportEbook({
  ebookId,
  format,
  locale,
  snapshotId,
  userId,
}: ExportJobData): Promise<ExportJobResult> {
  const prismaFormat: ExportFormat = toPrismaExportFormat(format);

  const ebook = await prisma.ebook.findUnique({
    where: { id: ebookId },
    select: {
      id: true,
      ownerId: true,
    },
  });

  if (!ebook) {
    throw new Error(`Ebook not found: ${ebookId}`);
  }

  const exportRecord = await prisma.exportEbook.create({
    data: {
      ebookId,
      userId,
      format: prismaFormat,
      status: "PROCESSING",
      startedAt: new Date(),
    },
  });

  let uploadedKey: string | undefined;
  let uploadedBucket: string | undefined;

  try {
    const exportedFile = await createExportedFile({
      ebookId,
      format,
      locale,
      snapshotId,
      userId
    });

    const {bucket, key, sizeBytes} = await uploadExportFile({
      exportedFile,
      userId,
    });

    // used for delete at fail if the export process fails
    uploadedKey = key;
    uploadedBucket = bucket;
  
    const result = await recordsExportInDatabase({
      key,
      bucket,
      exportedFile,
      sizeBytes,
      userId,
      exportRecordId: exportRecord.id,
      ownerId: ebook.ownerId,
    });

    // Send export job result
    return {
      export: {
        id: result.export.id,
        ebookId: result.export.ebookId,
        format,
        status: result.export.status,
        createdAt: result.export.createdAt.getTime(),
        file: {
          id: result.asset.id,
          key: result.asset.key,
          bucket: result.asset.bucket,
          sizeBytes: result.asset.sizeBytes,
          mimeType: result.asset.mimeType,
          createdAt: result.asset.createdAt.getTime(),
        },
      },
    };
  } catch (error) {
    await failExport({
      uploadedKey,
      uploadedBucket,
      exportRecordId: exportRecord.id,
      error,
    });
    throw error
  }
}
