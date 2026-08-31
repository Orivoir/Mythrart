/*
  Warnings:

  - Added the required column `fileName` to the `UploadHandshake` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "UploadHandshake" ADD COLUMN     "fileName" TEXT NOT NULL;
