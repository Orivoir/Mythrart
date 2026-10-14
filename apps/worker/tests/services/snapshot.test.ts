import { randomUUID } from "node:crypto";

import {
  DeleteObjectCommand,
  GetObjectCommand,
  s3,
} from "@mythrart/s3";
import { prisma } from "@mythrart/database";
import { afterAll, beforeAll, describe, expect, it } from "vitest";

import { generate } from "../../src/services/snapshot/snapshot.js";

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
    throw new Error("S3_BUCKET must be configured for snapshot integration tests");
  }

  return bucket;
}

async function cleanupFixtures(): Promise<void> {
  const bucket = getBucketName();

  // Retrouver les fichiers associés aux snapshots, même si une assertion échoue.
  if (fixture.ebookId) {
    const snapshots = await prisma.snapshot.findMany({
      where: { ebookId: fixture.ebookId },
      include: { file: true },
    });

    for (const snapshot of snapshots) {
      if (snapshot.file) {
        uploadedKeys.add(snapshot.file.key);
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
    await prisma.snapshot.deleteMany({
      where: { ebookId: fixture.ebookId },
    });

    await prisma.ebook.update({
      where: { id: fixture.ebookId },
      data: { currentSnapshot: { disconnect: true } },
    });

    await prisma.ebook.deleteMany({
      where: { id: fixture.ebookId },
    });

    await prisma.asset.deleteMany({
      where: { ownerId: fixture.userId },
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

describe("generate snapshot integration", { timeout: 60_000 }, () => {
  beforeAll(async () => {
    const bucket = getBucketName();

    const user = await prisma.user.create({
      data: {
        email: `snapshot-${runId}@example.test`,
        firstName: "Snapshot",
        lastName: "Integration",
        username: `snapshot_${runId.replaceAll("-", "").slice(0, 20)}`,
      },
    });
    fixture.userId = user.id;

    const ebookType = await prisma.ebookType.create({
      data: {
        name: `Snapshot test ${runId}`,
        slug: `snapshot-test-${runId}`,
      },
    });
    fixture.ebookTypeId = ebookType.id;

    const ebookTheme = await prisma.ebookTheme.create({
      data: {
        name: `Snapshot theme ${runId}`,
        slug: `snapshot-theme-${runId}`,
        backgroundColor: "#FFFFFF",
        textColor: "#000000",
        textFont: "Georgia",
        titleFont: "Georgia",
      },
    });
    fixture.ebookThemeId = ebookTheme.id;

    const ebook = await prisma.ebook.create({
      data: {
        title: `Snapshot integration test ${runId}`,
        subtitle: "Integration subtitle",
        shortDescription: "Snapshot integration test description",
        owner: { connect: { id: user.id } },
        ebookType: { connect: { id: ebookType.id } },
        ebookTheme: { connect: { id: ebookTheme.id } },
      },
    });
    fixture.ebookId = ebook.id;

    expect(bucket).toBeTruthy();
  });

  afterAll(async () => {
    await cleanupFixtures();
  });

  it("generates, uploads and persists successive snapshots", async () => {
    const firstResult = await generate({ ebookId: fixture.ebookId });
    const first = firstResult.snapshot;

    expect(first.id).toBeTruthy();
    expect(first.ebookId).toBe(fixture.ebookId);
    expect(first.version).toBe(1);
    expect(first.status).toBe("READY");
    expect(first.file).toBeDefined();

    const firstFile = first.file!;

    expect(firstFile.key).toContain(fixture.userId);
    expect(firstFile.key).toContain("snapshot-v1.json");
    expect(firstFile.bucket).toBe(getBucketName());
    expect(firstFile.mimeType).toBe("application/json");
    expect(firstFile.sizeBytes).toBeGreaterThan(0);

    // Mémoriser immédiatement l'objet pour le nettoyage.
    uploadedKeys.add(firstFile.key);

    const persistedFirst = await prisma.snapshot.findUnique({
      where: { id: first.id },
      include: { file: true },
    });

    expect(persistedFirst).not.toBeNull();
    expect(persistedFirst?.ebookId).toBe(fixture.ebookId);
    expect(persistedFirst?.version).toBe(1);
    expect(persistedFirst?.status).toBe("READY");
    expect(persistedFirst?.file?.key).toBe(firstFile.key);

    const ebookAfterFirst = await prisma.ebook.findUnique({
      where: { id: fixture.ebookId },
      include: { currentSnapshot: true },
    });

    expect(ebookAfterFirst?.currentSnapshot?.id).toBe(first.id);

    const firstObject = await s3.send(
      new GetObjectCommand({
        Bucket: firstFile.bucket,
        Key: firstFile.key,
      }),
    );

    expect(firstObject.Body).toBeDefined();

    const firstJsonString = await firstObject.Body!.transformToString();
    const firstJson = JSON.parse(firstJsonString);

    expect(firstJson.formatVersion).toBe(1);
    expect(firstJson.metadata.version).toBe(1);
    expect(firstJson.ebook.id).toBe(fixture.ebookId);
    expect(firstJson.ebook.title).toBe(`Snapshot integration test ${runId}`);
    expect(firstJson.ebook.subtitle).toBe("Integration subtitle");
    expect(firstJson.ebook.shortDescription).toBe(
      "Snapshot integration test description",
    );
    expect(firstJson.ebook.coverImage).toBeNull();
    expect(firstJson.chapters).toEqual([]);

    // Un deuxième snapshot doit incrémenter la version sans remplacer l'ancien.
    const secondResult = await generate({ ebookId: fixture.ebookId });
    const second = secondResult.snapshot;

    expect(second.id).not.toBe(first.id);
    expect(second.ebookId).toBe(fixture.ebookId);
    expect(second.version).toBe(2);
    expect(second.status).toBe("READY");

    const secondFile = second.file!;

    expect(secondFile.key).toContain("snapshot-v2.json");
    expect(secondFile.bucket).toBe(getBucketName());
    expect(secondFile.mimeType).toBe("application/json");
    expect(secondFile.sizeBytes).toBeGreaterThan(0);

    uploadedKeys.add(secondFile.key);

    const persistedSecond = await prisma.snapshot.findUnique({
      where: { id: second.id },
      include: { file: true },
    });

    expect(persistedSecond?.version).toBe(2);
    expect(persistedSecond?.status).toBe("READY");
    expect(persistedSecond?.file?.key).toBe(secondFile.key);

    const ebookAfterSecond = await prisma.ebook.findUnique({
      where: { id: fixture.ebookId },
      include: { currentSnapshot: true },
    });

    expect(ebookAfterSecond?.currentSnapshot?.id).toBe(second.id);

    // Le premier snapshot doit toujours exister.
    const firstStillExists = await prisma.snapshot.findUnique({
      where: { id: first.id },
    });

    expect(firstStillExists).not.toBeNull();

    const secondObject = await s3.send(
      new GetObjectCommand({
        Bucket: secondFile.bucket,
        Key: secondFile.key,
      }),
    );

    expect(secondObject.Body).toBeDefined();

    const secondJson = JSON.parse(
      await secondObject.Body!.transformToString(),
    );

    expect(secondJson.formatVersion).toBe(1);
    expect(secondJson.metadata.version).toBe(2);
    expect(secondJson.ebook.id).toBe(fixture.ebookId);
  });
});
