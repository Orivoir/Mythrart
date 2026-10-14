import { prisma } from "@mythrart/database";
import { s3, DeleteObjectCommand } from "@mythrart/s3";

export interface FailExportParams {
  uploadedKey?: string
  uploadedBucket?: string
  exportRecordId: string;
  error: unknown;

}

export default async function failExport({
  uploadedKey,
  uploadedBucket,
  exportRecordId,
  error
}: FailExportParams) {
  // Delete failed export file from S3
  if (uploadedKey && uploadedBucket) {
    try {
      await s3.send(
        new DeleteObjectCommand({
          Bucket: uploadedBucket,
          Key: uploadedKey,
        }),
      );
    } catch {
      // Keep the original export error.
    }
  }

  // Update export record with failure status and error message
  await prisma.exportEbook.update({
    where: { id: exportRecordId },
    data: {
      status: "FAILED",
      error:
        error instanceof Error
          ? error.message
          : "Unknown export error",
      completedAt: new Date(),
    },
  });
}