/*
  Warnings:

  - You are about to drop the column `etag` on the `Asset` table. All the data in the column will be lost.
  - Made the column `mimeType` on table `Asset` required. This step will fail if there are existing NULL values in that column.
  - Made the column `sizeBytes` on table `Asset` required. This step will fail if there are existing NULL values in that column.

*/
-- AlterEnum
ALTER TYPE "PlanType" ADD VALUE 'pro';

-- AlterTable
ALTER TABLE "Asset" DROP COLUMN "etag",
ALTER COLUMN "mimeType" SET NOT NULL,
ALTER COLUMN "sizeBytes" SET NOT NULL;
