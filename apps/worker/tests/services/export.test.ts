import { randomUUID } from "node:crypto";

import {
  DeleteObjectCommand,
  s3,
  HeadObjectCommand,
} from "@mythrart/s3";
import { prisma } from "@mythrart/database";
import { afterAll, beforeAll, describe, expect, it } from "vitest";

import { exportEbook } from "../../src/services/export/export.js";

const runId = randomUUID();

const fixture = {
  userId: "",
  ebookTypeId: "",
  ebookThemeId: "",
  ebookId: "",
};

const uploadedKeys = new Set<string>();

function getBucketName(): string {
  const bucket = process.env.S3_BUCKET;

  if (!bucket) {
    throw new Error("S3_BUCKET must be configured for export integration tests");
  }

  return bucket;
}

async function cleanupFixtures(): Promise<void> {
  const bucket = getBucketName();

  // Récupérer les objets associés aux exports de ce test.
  if (fixture.ebookId) {
    const exports = await prisma.exportEbook.findMany({
      where: { ebookId: fixture.ebookId },
      include: { asset: true },
    });

    for (const exportRecord of exports) {
      if (exportRecord.asset) {
        uploadedKeys.add(exportRecord.asset.key);
      }
    }
  }

  // Supprimer les objets S3 créés par le test.
  for (const key of uploadedKeys) {
    await s3.send(
      new DeleteObjectCommand({
        Bucket: bucket,
        Key: key,
      }),
    );
  }

  uploadedKeys.clear();

  // Supprimer les données dans l'ordre des dépendances.
  if (fixture.ebookId) {
    await prisma.exportEbook.deleteMany({
      where: { ebookId: fixture.ebookId },
    });

    await prisma.asset.deleteMany({
      where: { ownerId: fixture.userId },
    });

    await prisma.ebook.deleteMany({
      where: { id: fixture.ebookId },
    });
  }

  if (fixture.ebookThemeId) {
    await prisma.ebookTheme.deleteMany({
      where: { id: fixture.ebookThemeId },
    });
  }

  if (fixture.ebookTypeId) {
    await prisma.ebookType.deleteMany({
      where: { id: fixture.ebookTypeId },
    });
  }

  if (fixture.userId) {
    await prisma.user.deleteMany({
      where: { id: fixture.userId },
    });
  }

  fixture.userId = "";
  fixture.ebookTypeId = "";
  fixture.ebookThemeId = "";
  fixture.ebookId = "";
}

describe("exportEbook integration", { timeout: 60_000 }, () => {
  beforeAll(async () => {
    const bucket = getBucketName();

    // Créer les données de fixture sans toucher aux autres données.
    const user = await prisma.user.create({
      data: {
        email: `export-${runId}@example.test`,
        firstName: "Export",
        lastName: "Integration",
        username: `export_${runId.replaceAll("-", "").slice(0, 20)}`,
      },
    });
    fixture.userId = user.id;

    const ebookType = await prisma.ebookType.create({
      data: {
        name: `Export test ${runId}`,
        slug: `export-test-${runId}`,
      },
    });
    fixture.ebookTypeId = ebookType.id;

    const ebookTheme = await prisma.ebookTheme.create({
      data: {
        name: `Export theme ${runId}`,
        slug: `export-theme-${runId}`,
        backgroundColor: "#FFFFFF",
        textColor: "#000000",
        textFont: "Georgia",
        titleFont: "Georgia",
      },
    });
    fixture.ebookThemeId = ebookTheme.id;

    const ebook = await prisma.ebook.create({
      data: {
        title: `Export integration test ${runId}`,
        owner: { connect: { id: user.id } },
        ebookType: { connect: { id: ebookType.id } },
        ebookTheme: { connect: { id: ebookTheme.id } },
      },
    });
    fixture.ebookId = ebook.id;

    // Le bucket doit déjà exister : le test ne le crée ni ne le supprime.
    expect(bucket).toBeTruthy();
  });

  afterAll(async () => {
    await cleanupFixtures();
  });

  it("generates, uploads and persists a real TXT export", async () => {
    const result = await exportEbook({
      ebookId: fixture.ebookId,
      userId: fixture.userId,
      format: "txt",
      locale: "fr-FR",
    });

    const exportResult = result.export;

    expect(exportResult.id).toBeTruthy();
    expect(exportResult.ebookId).toBe(fixture.ebookId);
    expect(exportResult.format).toBe("txt");
    expect(exportResult.status).toBe("COMPLETED");

    expect(exportResult.file).toBeDefined();

    const file = exportResult.file!;

    expect(file.id).toBeTruthy();
    expect(file.key).toContain(fixture.userId);
    expect(file.bucket).toBe(getBucketName());
    expect(file.sizeBytes).toBeGreaterThan(0);
    expect(file.mimeType).toBeTruthy();

    // Mémoriser immédiatement l'objet pour le nettoyage.
    uploadedKeys.add(file.key);

    // Vérifier les enregistrements réellement persistés.
    const persistedExport = await prisma.exportEbook.findUnique({
      where: { id: exportResult.id },
      include: { asset: true },
    });

    expect(persistedExport).not.toBeNull();
    expect(persistedExport?.ebookId).toBe(fixture.ebookId);
    expect(persistedExport?.userId).toBe(fixture.userId);
    expect(persistedExport?.format).toBe("TXT");
    expect(persistedExport?.status).toBe("COMPLETED");
    expect(persistedExport?.asset).not.toBeNull();

    expect(persistedExport?.asset?.id).toBe(file.id);
    expect(persistedExport?.asset?.key).toBe(file.key);
    expect(persistedExport?.asset?.bucket).toBe(file.bucket);
    expect(persistedExport?.asset?.sizeBytes).toBe(file.sizeBytes);

    const head = await s3.send(
      new HeadObjectCommand({
        Bucket: file.bucket,
        Key: file.key,
      }),
    );

    expect(head.ContentLength).toBe(file.sizeBytes);
  });
});
