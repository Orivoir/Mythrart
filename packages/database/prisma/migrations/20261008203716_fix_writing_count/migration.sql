/*
  Warnings:

  - You are about to drop the column `charactersCount` on the `Chapter` table. All the data in the column will be lost.
  - You are about to drop the column `wordsCount` on the `Chapter` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "Chapter" DROP COLUMN "charactersCount",
DROP COLUMN "wordsCount";

-- AlterTable
ALTER TABLE "ChapterLocale" ADD COLUMN     "charactersCount" INTEGER NOT NULL DEFAULT 0,
ADD COLUMN     "wordsCount" INTEGER NOT NULL DEFAULT 0;
