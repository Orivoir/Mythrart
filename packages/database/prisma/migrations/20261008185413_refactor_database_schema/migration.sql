/*
  Warnings:

  - You are about to drop the column `type` on the `EbookEntityRelation` table. All the data in the column will be lost.
  - You are about to drop the column `name` on the `User` table. All the data in the column will be lost.
  - A unique constraint covering the columns `[ebookId,fromEntityId,toEntityId]` on the table `EbookEntityRelation` will be added. If there are existing duplicate values, this will fail.
  - A unique constraint covering the columns `[phoneNumber]` on the table `User` will be added. If there are existing duplicate values, this will fail.
  - A unique constraint covering the columns `[username]` on the table `User` will be added. If there are existing duplicate values, this will fail.

*/
-- CreateEnum
CREATE TYPE "UserDeletionReason" AS ENUM ('USER_REQUEST', 'FAIR_PLAY', 'TERMS_VIOLATION', 'ADMIN', 'OTHER');

-- CreateEnum
CREATE TYPE "SceneStatus" AS ENUM ('PLANNED', 'COMPLETED');

-- CreateEnum
CREATE TYPE "AssetStatus" AS ENUM ('ACTIVE', 'TRASHED');

-- CreateEnum
CREATE TYPE "EbookInvitationStatus" AS ENUM ('PENDING', 'ACCEPTED', 'DECLINED', 'EXPIRED', 'CANCELED');

-- CreateEnum
CREATE TYPE "NotificationIntent" AS ENUM ('WELCOME', 'INVITATION_PROJECT', 'INVITATION_ACCEPTED', 'INVITATION_DECLINED', 'PROJECT_FIRED', 'PROJECT_UPDATED', 'BILLING', 'NEWS');

-- CreateEnum
CREATE TYPE "WritingReportAnalysis" AS ENUM ('RHYTHM', 'COHERENCE', 'COMPRESSION', 'TRANSLATION', 'INTENSITY');

-- CreateEnum
CREATE TYPE "WritingReportStatus" AS ENUM ('PENDING', 'PROCESSING', 'COMPLETED', 'FAILED');

-- CreateEnum
CREATE TYPE "ExportFormat" AS ENUM ('PDF', 'EPUB', 'DOCX', 'HTML', 'TXT', 'MD');

-- CreateEnum
CREATE TYPE "ExportJobStatus" AS ENUM ('PENDING', 'PROCESSING', 'COMPLETED', 'FAILED');

-- CreateEnum
CREATE TYPE "ExplorerPublicationReason" AS ENUM ('SHOWCASE', 'READING_FEEDBACK', 'TRANSLATION', 'PROOFREADING', 'BETA_READING');

-- CreateEnum
CREATE TYPE "ExplorerPublicationStatus" AS ENUM ('DRAFT', 'PUBLISHED', 'CLOSED', 'ARCHIVED');

-- DropForeignKey
ALTER TABLE "EbookCollaborator" DROP CONSTRAINT "EbookCollaborator_customRoleId_ebookId_fkey";

-- DropForeignKey
ALTER TABLE "Snapshot" DROP CONSTRAINT "Snapshot_ebookId_fkey";

-- DropForeignKey
ALTER TABLE "SnapshotFile" DROP CONSTRAINT "SnapshotFile_snapshotId_fkey";

-- DropForeignKey
ALTER TABLE "WritingGoal" DROP CONSTRAINT "WritingGoal_ebookId_fkey";

-- DropForeignKey
ALTER TABLE "WritingGoal" DROP CONSTRAINT "WritingGoal_userId_fkey";

-- DropIndex
DROP INDEX "EbookEntityRelation_ebookId_fromEntityId_toEntityId_type_key";

-- AlterTable
ALTER TABLE "Asset" ADD COLUMN     "deletedByUserId" TEXT,
ADD COLUMN     "status" "AssetStatus" NOT NULL DEFAULT 'ACTIVE';

-- AlterTable
ALTER TABLE "Chapter" ADD COLUMN     "charactersCount" INTEGER NOT NULL DEFAULT 0,
ADD COLUMN     "wordsCount" INTEGER NOT NULL DEFAULT 0;

-- AlterTable
ALTER TABLE "ChapterLocale" ALTER COLUMN "title" DROP NOT NULL;

-- AlterTable
ALTER TABLE "EbookEntityRelation" DROP COLUMN "type";

-- AlterTable
ALTER TABLE "Scene" ADD COLUMN     "status" "SceneStatus" NOT NULL DEFAULT 'PLANNED';

-- AlterTable
ALTER TABLE "User" DROP COLUMN "name",
ADD COLUMN     "firstName" TEXT,
ADD COLUMN     "lastName" TEXT,
ADD COLUMN     "phoneNumber" TEXT,
ADD COLUMN     "phoneVerified" TIMESTAMP(3),
ADD COLUMN     "reasonDeleted" "UserDeletionReason",
ADD COLUMN     "termsAcceptedAt" TIMESTAMP(3),
ADD COLUMN     "username" TEXT,
ALTER COLUMN "email" DROP NOT NULL;

-- CreateTable
CREATE TABLE "EbookEntityRelationState" (
    "id" TEXT NOT NULL,
    "relationId" TEXT NOT NULL,
    "type" "EbookEntityRelationType" NOT NULL,
    "chapterId" TEXT,
    "sceneId" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "EbookEntityRelationState_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "EbookGenre" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "slug" TEXT NOT NULL,
    "description" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "EbookGenre_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "EbookGenreAssignment" (
    "ebookId" TEXT NOT NULL,
    "genreId" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "EbookGenreAssignment_pkey" PRIMARY KEY ("ebookId","genreId")
);

-- CreateTable
CREATE TABLE "EbookInvitation" (
    "id" TEXT NOT NULL,
    "ebookId" TEXT NOT NULL,
    "invitedByUserId" TEXT NOT NULL,
    "invitedUserId" TEXT NOT NULL,
    "role" "CollaborationRole",
    "customRoleId" TEXT,
    "status" "EbookInvitationStatus" NOT NULL DEFAULT 'PENDING',
    "expiresAt" TIMESTAMP(3) NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "EbookInvitation_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "ExplorerPublicationChapter" (
    "id" TEXT NOT NULL,
    "publicationId" TEXT NOT NULL,
    "chapterId" TEXT NOT NULL,
    "locales" TEXT[],
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "ExplorerPublicationChapter_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "ExplorerPublicationComment" (
    "id" TEXT NOT NULL,
    "publicationId" TEXT NOT NULL,
    "authorId" TEXT NOT NULL,
    "content" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "ExplorerPublicationComment_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "ExplorerPublicationRating" (
    "id" TEXT NOT NULL,
    "publicationId" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "rating" INTEGER NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "ExplorerPublicationRating_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "ExplorerPublication" (
    "id" TEXT NOT NULL,
    "ebookId" TEXT NOT NULL,
    "snapshotId" TEXT NOT NULL,
    "reason" "ExplorerPublicationReason" NOT NULL,
    "title" TEXT,
    "description" TEXT,
    "objective" TEXT,
    "synopsis" TEXT,
    "targetLocale" TEXT,
    "allowRatings" BOOLEAN NOT NULL DEFAULT true,
    "allowComments" BOOLEAN NOT NULL DEFAULT true,
    "status" "ExplorerPublicationStatus" NOT NULL DEFAULT 'DRAFT',
    "viewsCount" INTEGER NOT NULL DEFAULT 0,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "ExplorerPublication_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "ExportEbook" (
    "id" TEXT NOT NULL,
    "ebookId" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "format" "ExportFormat" NOT NULL,
    "status" "ExportJobStatus" NOT NULL DEFAULT 'PENDING',
    "assetId" TEXT,
    "error" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "startedAt" TIMESTAMP(3),
    "completedAt" TIMESTAMP(3),
    "expiresAt" TIMESTAMP(3),

    CONSTRAINT "ExportEbook_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Notification" (
    "id" TEXT NOT NULL,
    "receivedByUserId" TEXT NOT NULL,
    "sentByUserId" TEXT,
    "intent" "NotificationIntent" NOT NULL,
    "resourceId" TEXT,
    "readAt" TIMESTAMP(3),
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "Notification_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "UserNotificationPreference" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "marketingEmailConsentAt" TIMESTAMP(3),
    "marketingPushConsentAt" TIMESTAMP(3),
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "UserNotificationPreference_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "WritingReport" (
    "id" TEXT NOT NULL,
    "ebookId" TEXT NOT NULL,
    "snapshotId" TEXT NOT NULL,
    "createdByUserId" TEXT NOT NULL,
    "startChapterId" TEXT NOT NULL,
    "startSceneId" TEXT,
    "endChapterId" TEXT NOT NULL,
    "endSceneId" TEXT,
    "locales" TEXT[],
    "analyses" "WritingReportAnalysis"[],
    "status" "WritingReportStatus" NOT NULL DEFAULT 'PENDING',
    "result" JSONB,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "WritingReport_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "EbookEntityRelationState_relationId_idx" ON "EbookEntityRelationState"("relationId");

-- CreateIndex
CREATE INDEX "EbookEntityRelationState_chapterId_idx" ON "EbookEntityRelationState"("chapterId");

-- CreateIndex
CREATE INDEX "EbookEntityRelationState_sceneId_idx" ON "EbookEntityRelationState"("sceneId");

-- CreateIndex
CREATE UNIQUE INDEX "EbookGenre_slug_key" ON "EbookGenre"("slug");

-- CreateIndex
CREATE INDEX "EbookGenreAssignment_genreId_idx" ON "EbookGenreAssignment"("genreId");

-- CreateIndex
CREATE INDEX "EbookInvitation_ebookId_idx" ON "EbookInvitation"("ebookId");

-- CreateIndex
CREATE INDEX "EbookInvitation_invitedByUserId_idx" ON "EbookInvitation"("invitedByUserId");

-- CreateIndex
CREATE INDEX "EbookInvitation_customRoleId_idx" ON "EbookInvitation"("customRoleId");

-- CreateIndex
CREATE INDEX "EbookInvitation_status_idx" ON "EbookInvitation"("status");

-- CreateIndex
CREATE INDEX "ExplorerPublicationChapter_chapterId_idx" ON "ExplorerPublicationChapter"("chapterId");

-- CreateIndex
CREATE UNIQUE INDEX "ExplorerPublicationChapter_publicationId_chapterId_key" ON "ExplorerPublicationChapter"("publicationId", "chapterId");

-- CreateIndex
CREATE INDEX "ExplorerPublicationComment_publicationId_idx" ON "ExplorerPublicationComment"("publicationId");

-- CreateIndex
CREATE INDEX "ExplorerPublicationComment_authorId_idx" ON "ExplorerPublicationComment"("authorId");

-- CreateIndex
CREATE INDEX "ExplorerPublicationRating_publicationId_idx" ON "ExplorerPublicationRating"("publicationId");

-- CreateIndex
CREATE INDEX "ExplorerPublicationRating_userId_idx" ON "ExplorerPublicationRating"("userId");

-- CreateIndex
CREATE UNIQUE INDEX "ExplorerPublicationRating_publicationId_userId_key" ON "ExplorerPublicationRating"("publicationId", "userId");

-- CreateIndex
CREATE INDEX "ExplorerPublication_ebookId_idx" ON "ExplorerPublication"("ebookId");

-- CreateIndex
CREATE INDEX "ExplorerPublication_snapshotId_idx" ON "ExplorerPublication"("snapshotId");

-- CreateIndex
CREATE INDEX "ExplorerPublication_reason_idx" ON "ExplorerPublication"("reason");

-- CreateIndex
CREATE INDEX "ExplorerPublication_status_idx" ON "ExplorerPublication"("status");

-- CreateIndex
CREATE INDEX "ExportEbook_ebookId_idx" ON "ExportEbook"("ebookId");

-- CreateIndex
CREATE INDEX "ExportEbook_userId_idx" ON "ExportEbook"("userId");

-- CreateIndex
CREATE INDEX "ExportEbook_status_idx" ON "ExportEbook"("status");

-- CreateIndex
CREATE INDEX "ExportEbook_expiresAt_idx" ON "ExportEbook"("expiresAt");

-- CreateIndex
CREATE INDEX "ExportEbook_assetId_idx" ON "ExportEbook"("assetId");

-- CreateIndex
CREATE INDEX "Notification_receivedByUserId_createdAt_idx" ON "Notification"("receivedByUserId", "createdAt");

-- CreateIndex
CREATE INDEX "Notification_receivedByUserId_readAt_idx" ON "Notification"("receivedByUserId", "readAt");

-- CreateIndex
CREATE INDEX "Notification_sentByUserId_idx" ON "Notification"("sentByUserId");

-- CreateIndex
CREATE INDEX "Notification_intent_idx" ON "Notification"("intent");

-- CreateIndex
CREATE INDEX "Notification_resourceId_idx" ON "Notification"("resourceId");

-- CreateIndex
CREATE UNIQUE INDEX "UserNotificationPreference_userId_key" ON "UserNotificationPreference"("userId");

-- CreateIndex
CREATE INDEX "WritingReport_ebookId_idx" ON "WritingReport"("ebookId");

-- CreateIndex
CREATE INDEX "WritingReport_snapshotId_idx" ON "WritingReport"("snapshotId");

-- CreateIndex
CREATE INDEX "WritingReport_createdByUserId_idx" ON "WritingReport"("createdByUserId");

-- CreateIndex
CREATE INDEX "WritingReport_status_idx" ON "WritingReport"("status");

-- CreateIndex
CREATE UNIQUE INDEX "EbookEntityRelation_ebookId_fromEntityId_toEntityId_key" ON "EbookEntityRelation"("ebookId", "fromEntityId", "toEntityId");

-- CreateIndex
CREATE UNIQUE INDEX "User_phoneNumber_key" ON "User"("phoneNumber");

-- CreateIndex
CREATE UNIQUE INDEX "User_username_key" ON "User"("username");

-- AddForeignKey
ALTER TABLE "Asset" ADD CONSTRAINT "Asset_deletedByUserId_fkey" FOREIGN KEY ("deletedByUserId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "EbookCollaborator" ADD CONSTRAINT "EbookCollaborator_customRoleId_fkey" FOREIGN KEY ("customRoleId") REFERENCES "EbookCustomRole"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "EbookEntityRelationState" ADD CONSTRAINT "EbookEntityRelationState_relationId_fkey" FOREIGN KEY ("relationId") REFERENCES "EbookEntityRelation"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "EbookEntityRelationState" ADD CONSTRAINT "EbookEntityRelationState_chapterId_fkey" FOREIGN KEY ("chapterId") REFERENCES "Chapter"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "EbookEntityRelationState" ADD CONSTRAINT "EbookEntityRelationState_sceneId_fkey" FOREIGN KEY ("sceneId") REFERENCES "Scene"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "EbookGenreAssignment" ADD CONSTRAINT "EbookGenreAssignment_ebookId_fkey" FOREIGN KEY ("ebookId") REFERENCES "Ebook"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "EbookGenreAssignment" ADD CONSTRAINT "EbookGenreAssignment_genreId_fkey" FOREIGN KEY ("genreId") REFERENCES "EbookGenre"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "EbookInvitation" ADD CONSTRAINT "EbookInvitation_ebookId_fkey" FOREIGN KEY ("ebookId") REFERENCES "Ebook"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "EbookInvitation" ADD CONSTRAINT "EbookInvitation_invitedByUserId_fkey" FOREIGN KEY ("invitedByUserId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "EbookInvitation" ADD CONSTRAINT "EbookInvitation_invitedUserId_fkey" FOREIGN KEY ("invitedUserId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "EbookInvitation" ADD CONSTRAINT "EbookInvitation_customRoleId_fkey" FOREIGN KEY ("customRoleId") REFERENCES "EbookCustomRole"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ExplorerPublicationChapter" ADD CONSTRAINT "ExplorerPublicationChapter_publicationId_fkey" FOREIGN KEY ("publicationId") REFERENCES "ExplorerPublication"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ExplorerPublicationChapter" ADD CONSTRAINT "ExplorerPublicationChapter_chapterId_fkey" FOREIGN KEY ("chapterId") REFERENCES "Chapter"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ExplorerPublicationComment" ADD CONSTRAINT "ExplorerPublicationComment_publicationId_fkey" FOREIGN KEY ("publicationId") REFERENCES "ExplorerPublication"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ExplorerPublicationComment" ADD CONSTRAINT "ExplorerPublicationComment_authorId_fkey" FOREIGN KEY ("authorId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ExplorerPublicationRating" ADD CONSTRAINT "ExplorerPublicationRating_publicationId_fkey" FOREIGN KEY ("publicationId") REFERENCES "ExplorerPublication"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ExplorerPublicationRating" ADD CONSTRAINT "ExplorerPublicationRating_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ExplorerPublication" ADD CONSTRAINT "ExplorerPublication_ebookId_fkey" FOREIGN KEY ("ebookId") REFERENCES "Ebook"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ExplorerPublication" ADD CONSTRAINT "ExplorerPublication_snapshotId_fkey" FOREIGN KEY ("snapshotId") REFERENCES "Snapshot"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ExportEbook" ADD CONSTRAINT "ExportEbook_ebookId_fkey" FOREIGN KEY ("ebookId") REFERENCES "Ebook"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ExportEbook" ADD CONSTRAINT "ExportEbook_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ExportEbook" ADD CONSTRAINT "ExportEbook_assetId_fkey" FOREIGN KEY ("assetId") REFERENCES "Asset"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Notification" ADD CONSTRAINT "Notification_receivedByUserId_fkey" FOREIGN KEY ("receivedByUserId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Notification" ADD CONSTRAINT "Notification_sentByUserId_fkey" FOREIGN KEY ("sentByUserId") REFERENCES "User"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Snapshot" ADD CONSTRAINT "Snapshot_ebookId_fkey" FOREIGN KEY ("ebookId") REFERENCES "Ebook"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "SnapshotFile" ADD CONSTRAINT "SnapshotFile_snapshotId_fkey" FOREIGN KEY ("snapshotId") REFERENCES "Snapshot"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "UserNotificationPreference" ADD CONSTRAINT "UserNotificationPreference_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "WritingGoal" ADD CONSTRAINT "WritingGoal_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "WritingGoal" ADD CONSTRAINT "WritingGoal_ebookId_fkey" FOREIGN KEY ("ebookId") REFERENCES "Ebook"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "WritingReport" ADD CONSTRAINT "WritingReport_ebookId_fkey" FOREIGN KEY ("ebookId") REFERENCES "Ebook"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "WritingReport" ADD CONSTRAINT "WritingReport_snapshotId_fkey" FOREIGN KEY ("snapshotId") REFERENCES "Snapshot"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "WritingReport" ADD CONSTRAINT "WritingReport_createdByUserId_fkey" FOREIGN KEY ("createdByUserId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;
