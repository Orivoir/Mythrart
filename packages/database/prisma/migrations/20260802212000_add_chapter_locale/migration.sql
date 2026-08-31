-- Migrate chapter translation payloads from Chapter.content to ChapterLocale
CREATE TABLE "ChapterLocale" (
    "id" TEXT NOT NULL,
    "locale" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "content" JSONB NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "chapterId" TEXT NOT NULL,

    CONSTRAINT "ChapterLocale_pkey" PRIMARY KEY ("id")
);

-- Backfill the default locale row for existing chapters.
INSERT INTO "ChapterLocale" ("id", "locale", "title", "content", "createdAt", "updatedAt", "chapterId")
SELECT
    'legacy_' || "id" AS "id",
    'en' AS "locale",
    "title",
    "content",
    "createdAt",
    "updatedAt",
    "id" AS "chapterId"
FROM "Chapter";

ALTER TABLE "ChapterLocale"
    ADD CONSTRAINT "ChapterLocale_chapterId_fkey"
    FOREIGN KEY ("chapterId")
    REFERENCES "Chapter"("id")
    ON DELETE CASCADE
    ON UPDATE CASCADE;

CREATE UNIQUE INDEX "ChapterLocale_chapterId_locale_key" ON "ChapterLocale"("chapterId", "locale");
CREATE INDEX "ChapterLocale_locale_idx" ON "ChapterLocale"("locale");
CREATE INDEX "ChapterLocale_chapterId_idx" ON "ChapterLocale"("chapterId");

ALTER TABLE "Chapter" DROP COLUMN "content";
