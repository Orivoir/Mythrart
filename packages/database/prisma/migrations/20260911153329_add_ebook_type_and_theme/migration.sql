/*
  Warnings:

  - Added the required column `ebookThemeId` to the `Ebook` table without a default value. This is not possible if the table is not empty.
  - Added the required column `ebookTypeId` to the `Ebook` table without a default value. This is not possible if the table is not empty.

*/
-- CreateEnum
CREATE TYPE "EbookEntityType" AS ENUM ('CHARACTER', 'LOCATION', 'ORGANIZATION', 'OBJECT', 'EVENT', 'OTHER');

-- CreateEnum
CREATE TYPE "EbookEntityRelationType" AS ENUM ('FAMILY', 'FRIENDSHIP', 'ROMANTIC', 'PROFESSIONAL', 'OWNERSHIP', 'LOCATION', 'FAMILY_HOME', 'MEMBER_OF', 'ALLY', 'ENEMY', 'CREATOR', 'EMPLOYER', 'EMPLOYEE', 'OTHER');

-- AlterTable
ALTER TABLE "Ebook" ADD COLUMN     "ebookThemeId" TEXT NOT NULL,
ADD COLUMN     "ebookTypeId" TEXT NOT NULL;

-- CreateTable
CREATE TABLE "EbookEntityRelation" (
    "id" TEXT NOT NULL,
    "ebookId" TEXT NOT NULL,
    "fromEntityId" TEXT NOT NULL,
    "toEntityId" TEXT NOT NULL,
    "type" "EbookEntityRelationType" NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "EbookEntityRelation_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "EbookEntity" (
    "id" TEXT NOT NULL,
    "ebookId" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "slug" TEXT NOT NULL,
    "type" "EbookEntityType" NOT NULL,
    "description" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "EbookEntity_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "EbookTheme" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "slug" TEXT NOT NULL,
    "description" TEXT,
    "backgroundColor" TEXT NOT NULL,
    "textColor" TEXT NOT NULL,
    "textFont" TEXT NOT NULL,
    "titleFont" TEXT NOT NULL,
    "subtitleFont" TEXT,
    "headingColor" TEXT,
    "fontSize" TEXT,
    "lineHeight" TEXT,
    "paragraphSpacing" TEXT,
    "headingSpacing" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "EbookTheme_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "EbookType" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "slug" TEXT NOT NULL,
    "description" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "EbookType_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "WritingGoal" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "ebookId" TEXT,
    "title" TEXT,
    "targetWords" INTEGER,
    "targetDate" TIMESTAMP(3),
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "WritingGoal_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "EbookEntityRelation_ebookId_idx" ON "EbookEntityRelation"("ebookId");

-- CreateIndex
CREATE INDEX "EbookEntityRelation_fromEntityId_idx" ON "EbookEntityRelation"("fromEntityId");

-- CreateIndex
CREATE INDEX "EbookEntityRelation_toEntityId_idx" ON "EbookEntityRelation"("toEntityId");

-- CreateIndex
CREATE UNIQUE INDEX "EbookEntityRelation_ebookId_fromEntityId_toEntityId_type_key" ON "EbookEntityRelation"("ebookId", "fromEntityId", "toEntityId", "type");

-- CreateIndex
CREATE INDEX "EbookEntity_ebookId_idx" ON "EbookEntity"("ebookId");

-- CreateIndex
CREATE UNIQUE INDEX "EbookEntity_ebookId_slug_key" ON "EbookEntity"("ebookId", "slug");

-- CreateIndex
CREATE UNIQUE INDEX "EbookTheme_slug_key" ON "EbookTheme"("slug");

-- CreateIndex
CREATE UNIQUE INDEX "EbookType_slug_key" ON "EbookType"("slug");

-- CreateIndex
CREATE UNIQUE INDEX "WritingGoal_ebookId_key" ON "WritingGoal"("ebookId");

-- CreateIndex
CREATE INDEX "WritingGoal_userId_idx" ON "WritingGoal"("userId");

-- AddForeignKey
ALTER TABLE "EbookEntityRelation" ADD CONSTRAINT "EbookEntityRelation_ebookId_fkey" FOREIGN KEY ("ebookId") REFERENCES "Ebook"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "EbookEntityRelation" ADD CONSTRAINT "EbookEntityRelation_fromEntityId_fkey" FOREIGN KEY ("fromEntityId") REFERENCES "EbookEntity"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "EbookEntityRelation" ADD CONSTRAINT "EbookEntityRelation_toEntityId_fkey" FOREIGN KEY ("toEntityId") REFERENCES "EbookEntity"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "EbookEntity" ADD CONSTRAINT "EbookEntity_ebookId_fkey" FOREIGN KEY ("ebookId") REFERENCES "Ebook"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Ebook" ADD CONSTRAINT "Ebook_ebookTypeId_fkey" FOREIGN KEY ("ebookTypeId") REFERENCES "EbookType"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Ebook" ADD CONSTRAINT "Ebook_ebookThemeId_fkey" FOREIGN KEY ("ebookThemeId") REFERENCES "EbookTheme"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "WritingGoal" ADD CONSTRAINT "WritingGoal_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "WritingGoal" ADD CONSTRAINT "WritingGoal_ebookId_fkey" FOREIGN KEY ("ebookId") REFERENCES "Ebook"("id") ON DELETE SET NULL ON UPDATE CASCADE;
