/*
  Warnings:

  - You are about to drop the column `updatedAt` on the `Snapshot` table. All the data in the column will be lost.

*/
-- CreateEnum
CREATE TYPE "SnapshotStatus" AS ENUM ('PENDING', 'READY', 'FAILED');

-- CreateEnum
CREATE TYPE "UploadHandshakeStatus" AS ENUM ('PENDING', 'COMPLETED', 'FAILED', 'EXPIRED');

-- AlterTable
ALTER TABLE "Snapshot" DROP COLUMN "updatedAt",
ADD COLUMN     "status" "SnapshotStatus" NOT NULL DEFAULT 'PENDING';

-- CreateTable
CREATE TABLE "SnapshotFile" (
    "id" TEXT NOT NULL,
    "snapshotId" TEXT NOT NULL,
    "key" TEXT NOT NULL,
    "bucket" TEXT NOT NULL,
    "sizeBytes" INTEGER NOT NULL,
    "mimeType" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "SnapshotFile_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "UploadHandshake" (
    "id" TEXT NOT NULL,
    "ownerId" TEXT NOT NULL,
    "context" "AssetReferenceType" NOT NULL,
    "key" TEXT NOT NULL,
    "expectedMimeType" TEXT NOT NULL,
    "expectedSizeBytes" INTEGER NOT NULL,
    "status" "UploadHandshakeStatus" NOT NULL DEFAULT 'PENDING',
    "expiresAt" TIMESTAMP(3) NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "UploadHandshake_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "SnapshotFile_snapshotId_key" ON "SnapshotFile"("snapshotId");

-- CreateIndex
CREATE UNIQUE INDEX "SnapshotFile_key_key" ON "SnapshotFile"("key");

-- CreateIndex
CREATE UNIQUE INDEX "UploadHandshake_key_key" ON "UploadHandshake"("key");

-- CreateIndex
CREATE INDEX "UploadHandshake_ownerId_idx" ON "UploadHandshake"("ownerId");

-- CreateIndex
CREATE INDEX "UploadHandshake_status_idx" ON "UploadHandshake"("status");

-- CreateIndex
CREATE INDEX "UploadHandshake_expiresAt_idx" ON "UploadHandshake"("expiresAt");

-- AddForeignKey
ALTER TABLE "SnapshotFile" ADD CONSTRAINT "SnapshotFile_snapshotId_fkey" FOREIGN KEY ("snapshotId") REFERENCES "Snapshot"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "UploadHandshake" ADD CONSTRAINT "UploadHandshake_ownerId_fkey" FOREIGN KEY ("ownerId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;
