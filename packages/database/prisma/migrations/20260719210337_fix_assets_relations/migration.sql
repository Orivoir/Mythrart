/*
  Warnings:

  - You are about to drop the `AssetLink` table. If the table is not empty, all the data it contains will be lost.
  - A unique constraint covering the columns `[ebookId,position]` on the table `Chapter` will be added. If there are existing duplicate values, this will fail.
  - Made the column `ownerId` on table `Asset` required. This step will fail if there are existing NULL values in that column.

*/
-- CreateEnum
CREATE TYPE "AssetReferenceType" AS ENUM ('COVER', 'CONTENT_IMAGE', 'SNAPSHOT', 'EXPORT');

-- DropForeignKey
ALTER TABLE "Asset" DROP CONSTRAINT "Asset_ownerId_fkey";

-- DropForeignKey
ALTER TABLE "AssetLink" DROP CONSTRAINT "AssetLink_assetId_fkey";

-- DropForeignKey
ALTER TABLE "AssetLink" DROP CONSTRAINT "AssetLink_snapshotId_fkey";

-- AlterTable
ALTER TABLE "Asset" ALTER COLUMN "ownerId" SET NOT NULL;

-- AlterTable
ALTER TABLE "Ebook" ADD COLUMN     "coverAssetId" TEXT;

-- DropTable
DROP TABLE "AssetLink";

-- DropEnum
DROP TYPE "AssetLinkType";

-- CreateTable
CREATE TABLE "ChapterAssetReference" (
    "id" TEXT NOT NULL,
    "assetId" TEXT NOT NULL,
    "chapterId" TEXT NOT NULL,
    "type" "AssetReferenceType" NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "ChapterAssetReference_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "ChapterAssetReference_assetId_idx" ON "ChapterAssetReference"("assetId");

-- CreateIndex
CREATE INDEX "ChapterAssetReference_chapterId_idx" ON "ChapterAssetReference"("chapterId");

-- CreateIndex
CREATE INDEX "ChapterAssetReference_type_idx" ON "ChapterAssetReference"("type");

-- CreateIndex
CREATE INDEX "ChapterAssetReference_assetId_type_idx" ON "ChapterAssetReference"("assetId", "type");

-- CreateIndex
CREATE INDEX "ChapterAssetReference_chapterId_type_idx" ON "ChapterAssetReference"("chapterId", "type");

-- CreateIndex
CREATE UNIQUE INDEX "Chapter_ebookId_position_key" ON "Chapter"("ebookId", "position");

-- AddForeignKey
ALTER TABLE "Asset" ADD CONSTRAINT "Asset_ownerId_fkey" FOREIGN KEY ("ownerId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ChapterAssetReference" ADD CONSTRAINT "ChapterAssetReference_assetId_fkey" FOREIGN KEY ("assetId") REFERENCES "Asset"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ChapterAssetReference" ADD CONSTRAINT "ChapterAssetReference_chapterId_fkey" FOREIGN KEY ("chapterId") REFERENCES "Chapter"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Ebook" ADD CONSTRAINT "Ebook_coverAssetId_fkey" FOREIGN KEY ("coverAssetId") REFERENCES "Asset"("id") ON DELETE SET NULL ON UPDATE CASCADE;
