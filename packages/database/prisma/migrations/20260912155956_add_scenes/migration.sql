-- AlterEnum
ALTER TYPE "AssetReferenceType" ADD VALUE 'SYNOPSIS';

-- CreateTable
CREATE TABLE "SceneEntity" (
    "sceneId" TEXT NOT NULL,
    "entityId" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "SceneEntity_pkey" PRIMARY KEY ("sceneId","entityId")
);

-- CreateTable
CREATE TABLE "Scene" (
    "id" TEXT NOT NULL,
    "chapterId" TEXT,
    "title" TEXT NOT NULL,
    "objective" TEXT,
    "order" INTEGER,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Scene_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "SceneEntity_entityId_idx" ON "SceneEntity"("entityId");

-- CreateIndex
CREATE INDEX "Scene_chapterId_order_idx" ON "Scene"("chapterId", "order");

-- AddForeignKey
ALTER TABLE "SceneEntity" ADD CONSTRAINT "SceneEntity_sceneId_fkey" FOREIGN KEY ("sceneId") REFERENCES "Scene"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "SceneEntity" ADD CONSTRAINT "SceneEntity_entityId_fkey" FOREIGN KEY ("entityId") REFERENCES "EbookEntity"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Scene" ADD CONSTRAINT "Scene_chapterId_fkey" FOREIGN KEY ("chapterId") REFERENCES "Chapter"("id") ON DELETE SET NULL ON UPDATE CASCADE;
