import {
  prisma,
  NotificationIntent
} from "@mythrart/database";
import type { ExportedFile } from "./exporters/types.js";

export interface RecordsExportInDatabaseParams {
  key: string;
  bucket: string;
  exportedFile: ExportedFile;
  sizeBytes: number;
  userId: string;
  exportRecordId: string;
  ownerId: string;
}

export default async function recordsExportInDatabase({
  key,
  bucket,
  exportedFile,
  sizeBytes,
  userId,
  exportRecordId,
  ownerId
}: RecordsExportInDatabaseParams) {

  const result = await prisma.$transaction(async (tx) => {
    const asset = await tx.asset.create({
      data: {
        key,
        bucket,
        fileName: exportedFile.fileName,
        mimeType: exportedFile.mimeType,
        sizeBytes,
        ownerId: userId, // is not owner of ebook here its owner of export job (can be a collaborator user)
      },
    });

    const completedExport = await tx.exportEbook.update({
      where: { id: exportRecordId },
      data: {
        assetId: asset.id,
        status: "COMPLETED",
        completedAt: new Date(),
      },
    });

    const recipientIds = [
      ...new Set([userId, ownerId]),
    ];

    await tx.notification.createMany({
      data: recipientIds.map((receivedByUserId) => ({ 
        receivedByUserId,
        intent: NotificationIntent.JOB_FINISH,
        resourceId: completedExport.id,
      })),
    });

    return { asset, export: completedExport };
  });

  return result
} 