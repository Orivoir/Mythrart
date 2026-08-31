-- CreateEnum
CREATE TYPE "CollaborationRole" AS ENUM ('OWNER', 'AUTHOR', 'TRANSLATOR', 'PROOFREADER', 'EDITOR');

-- CreateEnum
CREATE TYPE "CollaborationPermission" AS ENUM ('EBOOK_READ', 'EBOOK_UPDATE_METADATA', 'EBOOK_DELETE', 'CHAPTER_READ', 'CHAPTER_CREATE', 'CHAPTER_UPDATE', 'CHAPTER_DELETE', 'SNAPSHOT_READ', 'SNAPSHOT_CREATE', 'SNAPSHOT_RESTORE', 'ASSET_UPLOAD', 'ASSET_DELETE', 'COVER_UPDATE', 'COLLABORATOR_INVITE', 'COLLABORATOR_REMOVE', 'ROLE_ASSIGN');

-- CreateTable
CREATE TABLE "EbookCollaborator" (
    "id" TEXT NOT NULL,
    "ebookId" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "role" "CollaborationRole",
    "allChaptersAccess" BOOLEAN NOT NULL DEFAULT true,
    "customRoleId" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "EbookCollaborator_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "EbookCollaboratorChapterAccess" (
    "id" TEXT NOT NULL,
    "collaboratorId" TEXT NOT NULL,
    "chapterId" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "EbookCollaboratorChapterAccess_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "EbookCustomRole" (
    "id" TEXT NOT NULL,
    "ebookId" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "permissions" "CollaborationPermission"[],
    "createdByUserId" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "EbookCustomRole_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "EbookCollaborator_ebookId_idx" ON "EbookCollaborator"("ebookId");

-- CreateIndex
CREATE INDEX "EbookCollaborator_userId_idx" ON "EbookCollaborator"("userId");

-- CreateIndex
CREATE INDEX "EbookCollaborator_customRoleId_idx" ON "EbookCollaborator"("customRoleId");

-- CreateIndex
CREATE UNIQUE INDEX "EbookCollaborator_ebookId_userId_key" ON "EbookCollaborator"("ebookId", "userId");

-- CreateIndex
CREATE INDEX "EbookCollaboratorChapterAccess_collaboratorId_idx" ON "EbookCollaboratorChapterAccess"("collaboratorId");

-- CreateIndex
CREATE INDEX "EbookCollaboratorChapterAccess_chapterId_idx" ON "EbookCollaboratorChapterAccess"("chapterId");

-- CreateIndex
CREATE UNIQUE INDEX "EbookCollaboratorChapterAccess_collaboratorId_chapterId_key" ON "EbookCollaboratorChapterAccess"("collaboratorId", "chapterId");

-- CreateIndex
CREATE INDEX "EbookCustomRole_ebookId_idx" ON "EbookCustomRole"("ebookId");

-- CreateIndex
CREATE INDEX "EbookCustomRole_createdByUserId_idx" ON "EbookCustomRole"("createdByUserId");

-- CreateIndex
CREATE UNIQUE INDEX "EbookCustomRole_id_ebookId_key" ON "EbookCustomRole"("id", "ebookId");

-- CreateIndex
CREATE UNIQUE INDEX "EbookCustomRole_ebookId_name_key" ON "EbookCustomRole"("ebookId", "name");

-- AddForeignKey
ALTER TABLE "EbookCollaborator" ADD CONSTRAINT "EbookCollaborator_ebookId_fkey" FOREIGN KEY ("ebookId") REFERENCES "Ebook"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "EbookCollaborator" ADD CONSTRAINT "EbookCollaborator_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "EbookCollaborator" ADD CONSTRAINT "EbookCollaborator_customRoleId_ebookId_fkey" FOREIGN KEY ("customRoleId", "ebookId") REFERENCES "EbookCustomRole"("id", "ebookId") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "EbookCollaboratorChapterAccess" ADD CONSTRAINT "EbookCollaboratorChapterAccess_collaboratorId_fkey" FOREIGN KEY ("collaboratorId") REFERENCES "EbookCollaborator"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "EbookCollaboratorChapterAccess" ADD CONSTRAINT "EbookCollaboratorChapterAccess_chapterId_fkey" FOREIGN KEY ("chapterId") REFERENCES "Chapter"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "EbookCustomRole" ADD CONSTRAINT "EbookCustomRole_ebookId_fkey" FOREIGN KEY ("ebookId") REFERENCES "Ebook"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "EbookCustomRole" ADD CONSTRAINT "EbookCustomRole_createdByUserId_fkey" FOREIGN KEY ("createdByUserId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;
