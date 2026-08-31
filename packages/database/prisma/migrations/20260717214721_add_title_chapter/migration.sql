/*
  Warnings:

  - Added the required column `title` to the `Chapter` table without a default value. This is not possible if the table is not empty.
  - Added the required column `updatedAt` to the `Ebook` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "Chapter" ADD COLUMN     "title" TEXT NOT NULL;

-- AlterTable
ALTER TABLE "Ebook" ADD COLUMN     "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
ADD COLUMN     "updatedAt" TIMESTAMP(3) NOT NULL;
