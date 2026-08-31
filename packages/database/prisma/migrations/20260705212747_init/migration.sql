-- CreateEnum
CREATE TYPE "SubscriptionStatus" AS ENUM ('none', 'trialing', 'active', 'past_due', 'canceled', 'unpaid');

-- CreateEnum
CREATE TYPE "PlanType" AS ENUM ('free', 'premium');

-- CreateEnum
CREATE TYPE "AssetLinkType" AS ENUM ('content', 'cover', 'illustration');

-- CreateTable
CREATE TABLE "Asset" (
    "id" TEXT NOT NULL,
    "key" TEXT NOT NULL,
    "bucket" TEXT NOT NULL,
    "fileName" TEXT NOT NULL,
    "mimeType" TEXT,
    "sizeBytes" INTEGER,
    "etag" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "ownerId" TEXT,

    CONSTRAINT "Asset_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "AssetLink" (
    "id" TEXT NOT NULL,
    "assetId" TEXT NOT NULL,
    "snapshotId" TEXT,
    "type" "AssetLinkType" NOT NULL,

    CONSTRAINT "AssetLink_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Chapter" (
    "id" TEXT NOT NULL,
    "ebookId" TEXT NOT NULL,
    "content" JSONB NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Chapter_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Ebook" (
    "id" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "subtitle" TEXT,
    "shortDescription" TEXT,
    "ownerId" TEXT NOT NULL,
    "currentSnapshotId" TEXT,

    CONSTRAINT "Ebook_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Snapshot" (
    "id" TEXT NOT NULL,
    "ebookId" TEXT NOT NULL,
    "version" INTEGER NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Snapshot_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "User" (
    "id" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "name" TEXT,
    "stripeCustomerId" TEXT NOT NULL,
    "subscriptionStatus" "SubscriptionStatus" NOT NULL DEFAULT 'none',
    "plan" "PlanType" NOT NULL DEFAULT 'free',
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "User_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "Asset_key_key" ON "Asset"("key");

-- CreateIndex
CREATE INDEX "Asset_ownerId_idx" ON "Asset"("ownerId");

-- CreateIndex
CREATE INDEX "AssetLink_assetId_idx" ON "AssetLink"("assetId");

-- CreateIndex
CREATE INDEX "Chapter_ebookId_idx" ON "Chapter"("ebookId");

-- CreateIndex
CREATE UNIQUE INDEX "Ebook_currentSnapshotId_key" ON "Ebook"("currentSnapshotId");

-- CreateIndex
CREATE INDEX "Ebook_ownerId_idx" ON "Ebook"("ownerId");

-- CreateIndex
CREATE INDEX "Snapshot_ebookId_idx" ON "Snapshot"("ebookId");

-- CreateIndex
CREATE UNIQUE INDEX "Snapshot_ebookId_version_key" ON "Snapshot"("ebookId", "version");

-- CreateIndex
CREATE UNIQUE INDEX "User_email_key" ON "User"("email");

-- CreateIndex
CREATE UNIQUE INDEX "User_stripeCustomerId_key" ON "User"("stripeCustomerId");

-- AddForeignKey
ALTER TABLE "Asset" ADD CONSTRAINT "Asset_ownerId_fkey" FOREIGN KEY ("ownerId") REFERENCES "User"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "AssetLink" ADD CONSTRAINT "AssetLink_assetId_fkey" FOREIGN KEY ("assetId") REFERENCES "Asset"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "AssetLink" ADD CONSTRAINT "AssetLink_snapshotId_fkey" FOREIGN KEY ("snapshotId") REFERENCES "Snapshot"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Chapter" ADD CONSTRAINT "Chapter_ebookId_fkey" FOREIGN KEY ("ebookId") REFERENCES "Ebook"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Ebook" ADD CONSTRAINT "Ebook_ownerId_fkey" FOREIGN KEY ("ownerId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Ebook" ADD CONSTRAINT "Ebook_currentSnapshotId_fkey" FOREIGN KEY ("currentSnapshotId") REFERENCES "Snapshot"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Snapshot" ADD CONSTRAINT "Snapshot_ebookId_fkey" FOREIGN KEY ("ebookId") REFERENCES "Ebook"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
