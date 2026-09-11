import { faker } from "@faker-js/faker"
import {
  CreateBucketCommand,
  DeleteObjectCommand,
  GetObjectCommand,
  HeadBucketCommand,
} from "@mythrart/s3"
import { afterAll, beforeEach, describe, expect, it } from "vitest"
import { Prisma, prisma } from "@mythrart/database"
import { s3 } from "@mythrart/s3"
import { generate } from "./../../src/services/snapshot/index.js"

import {
  createEbookTypeFixture,
  createEbookThemeFixture
} from "./../helpers/persisted-export-fixture.js"

type SnapshotPayload = {
  formatVersion: number
  metadata: {
    generatedAt: number
    version: number
  }
  ebook: {
    id: string
    title: string
    subtitle: string | null
    shortDescription: string | null
    createdAt: string
    coverImage: {
      assetId: string
      key: string
      bucket: string
    } | null
  }
  chapters: Array<{
    id: string
    title: string
    content: Prisma.JsonValue
    position: number
    createdAt: string
  }>
}

type EbookFixture = {
  ownerId: string
  ebookId: string
  coverAsset: {
    id: string
    key: string
    bucket: string
  }
  chapters: Array<{
    id: string
    title: string
    content: Prisma.JsonValue
    position: number
    createdAt: Date
  }>
  ebookCreatedAt: Date
  title: string
  subtitle: string | null
  shortDescription: string | null
}

const createdObjectKeys = new Set<string>()
const TEST_EMAIL_PREFIX = "snapshot-itg-"

function getBucketName(): string {
  const bucket = process.env.S3_BUCKET

  if (!bucket) {
    throw new Error("S3_BUCKET must be configured for integration tests")
  }

  return bucket
}

async function ensureBucketExists(bucket: string): Promise<void> {
  try {
    await s3.send(new HeadBucketCommand({ Bucket: bucket }))
  } catch {
    await s3.send(new CreateBucketCommand({ Bucket: bucket }))
  }
}

async function createEbookFixture(): Promise<EbookFixture> {
  const owner = await prisma.user.create({
    data: {
      email: `${TEST_EMAIL_PREFIX}${faker.string.alphanumeric(10).toLowerCase()}@example.test`,
      name: faker.person.fullName(),
    },
  })

  const coverAsset = await prisma.asset.create({
    data: {
      ownerId: owner.id,
      key: `covers/${faker.string.alphanumeric(20)}.webp`,
      bucket: getBucketName(),
      fileName: `${faker.system.fileName()}.webp`,
      mimeType: "image/webp",
      sizeBytes: faker.number.int({ min: 1_000, max: 500_000 }),
    },
  })

  const title = faker.lorem.sentence({ min: 3, max: 6 })
  const subtitle = faker.lorem.sentence({ min: 4, max: 8 })
  const shortDescription = faker.lorem.sentence({ min: 8, max: 16 })

  const ebookType = await createEbookTypeFixture()
  const ebookTheme = await createEbookThemeFixture()

  const data: Prisma.EbookUncheckedCreateInput = {
    ownerId: owner.id,
    title,
    subtitle,
    shortDescription,
    coverAssetId: coverAsset.id,
    ebookTypeId: ebookType.id,
    ebookThemeId: ebookTheme.id,
  }

  const ebook = await prisma.ebook.create({ data })

  const chapterOneContent: Prisma.JsonValue = {
    type: "doc",
    blocks: [
      {
        type: "paragraph",
        text: faker.lorem.paragraph(),
      },
    ],
  }

  const chapterTwoContent: Prisma.JsonValue = {
    type: "doc",
    blocks: [
      {
        type: "paragraph",
        text: faker.lorem.paragraph(),
      },
    ],
  }

  const chapterOneTitle = faker.lorem.sentence({ min: 2, max: 5 })
  const chapterTwoTitle = faker.lorem.sentence({ min: 2, max: 5 })

  const chapterOne = await prisma.chapter.create({
    data: {
      ebookId: ebook.id,
      title: chapterOneTitle,
      position: 0,
      locales: {
        create: {
          locale: "en",
          title: chapterOneTitle,
          content: chapterOneContent,
        },
      },
    },
  })

  const chapterTwo = await prisma.chapter.create({
    data: {
      ebookId: ebook.id,
      title: chapterTwoTitle,
      position: 1,
      locales: {
        create: {
          locale: "en",
          title: chapterTwoTitle,
          content: chapterTwoContent,
        },
      },
    },
  })

  return {
    ownerId: owner.id,
    ebookId: ebook.id,
    coverAsset: {
      id: coverAsset.id,
      key: coverAsset.key,
      bucket: coverAsset.bucket,
    },
    chapters: [
      {
        id: chapterOne.id,
        title: chapterOne.title,
        content: chapterOneContent,
        position: chapterOne.position,
        createdAt: chapterOne.createdAt,
      },
      {
        id: chapterTwo.id,
        title: chapterTwo.title,
        content: chapterTwoContent,
        position: chapterTwo.position,
        createdAt: chapterTwo.createdAt,
      },
    ],
    ebookCreatedAt: ebook.createdAt,
    title,
    subtitle,
    shortDescription,
  }
}

async function deleteUploadedObjects(bucket: string): Promise<void> {
  for (const key of createdObjectKeys) {
    await s3.send(
      new DeleteObjectCommand({
        Bucket: bucket,
        Key: key,
      }),
    )
  }

  createdObjectKeys.clear()
}

async function deleteFixtureData(bucket: string): Promise<void> {
  const owners = await prisma.user.findMany({
    where: {
      email: {
        startsWith: TEST_EMAIL_PREFIX,
      },
    },
    select: {
      id: true,
    },
  })

  const ownerIds = owners.map((owner) => owner.id)

  if (ownerIds.length === 0) {
    return
  }

  const ebooks = await prisma.ebook.findMany({
    where: {
      ownerId: {
        in: ownerIds,
      },
    },
    select: {
      id: true,
    },
  })

  const ebookIds = ebooks.map((ebook) => ebook.id)

  if (ebookIds.length > 0) {
    const snapshots = await prisma.snapshot.findMany({
      where: {
        ebookId: {
          in: ebookIds,
        },
      },
      include: {
        file: {
          select: {
            key: true,
          },
        },
      },
    })

    for (const snapshot of snapshots) {
      if (snapshot.file?.key) {
        createdObjectKeys.add(snapshot.file.key)
      }
    }

    await deleteUploadedObjects(bucket)

    await prisma.snapshotFile.deleteMany({
      where: {
        snapshotId: {
          in: snapshots.map((snapshot) => snapshot.id),
        },
      },
    })

    await prisma.snapshot.deleteMany({
      where: {
        id: {
          in: snapshots.map((snapshot) => snapshot.id),
        },
      },
    })

    await prisma.chapter.deleteMany({
      where: {
        ebookId: {
          in: ebookIds,
        },
      },
    })

    await prisma.ebook.deleteMany({
      where: {
        id: {
          in: ebookIds,
        },
      },
    })
  }

  await prisma.asset.deleteMany({
    where: {
      ownerId: {
        in: ownerIds,
      },
    },
  })

  await prisma.user.deleteMany({
    where: {
      id: {
        in: ownerIds,
      },
    },
  })
}

async function loadSnapshotFromS3(bucket: string, key: string): Promise<SnapshotPayload> {
  const response = await s3.send(
    new GetObjectCommand({
      Bucket: bucket,
      Key: key,
    }),
  )

  const bodyText = await response.Body?.transformToString()

  if (!bodyText) {
    throw new Error("Snapshot body is empty")
  }

  return JSON.parse(bodyText) as SnapshotPayload
}

describe("snapshot generate service integration", () => {
  beforeEach(async () => {
    const bucket = getBucketName()

    await ensureBucketExists(bucket)
    await deleteFixtureData(bucket)
  })

  afterAll(async () => {
    const bucket = getBucketName()

    await deleteFixtureData(bucket)
    await prisma.$disconnect()
  })

  it("creates snapshot records, links ebook.currentSnapshot and uploads valid json", async () => {
    const fixture = await createEbookFixture()
    const bucket = getBucketName()

    await generate({ ebookId: fixture.ebookId })

    const createdSnapshot = await prisma.snapshot.findFirst({
      where: { ebookId: fixture.ebookId },
      include: {
        file: true,
      },
      orderBy: {
        createdAt: "desc",
      },
    })

    expect(createdSnapshot).not.toBeNull()
    expect(createdSnapshot?.file).not.toBeNull()

    const persistedEbook = await prisma.ebook.findUnique({
      where: { id: fixture.ebookId },
      select: {
        currentSnapshotId: true,
      },
    })

    expect(persistedEbook?.currentSnapshotId).toBe(createdSnapshot?.id)

    const snapshotFile = createdSnapshot?.file

    if (!snapshotFile || !createdSnapshot) {
      throw new Error("Expected snapshot and snapshot file to exist")
    }

    createdObjectKeys.add(snapshotFile.key)

    const s3Json = await loadSnapshotFromS3(bucket, snapshotFile.key)

    expect(s3Json.formatVersion).toBe(1)
    expect(s3Json.metadata.version).toBe(createdSnapshot.version)
    expect(s3Json.ebook).toEqual({
      id: fixture.ebookId,
      title: fixture.title,
      subtitle: fixture.subtitle,
      shortDescription: fixture.shortDescription,
      createdAt: fixture.ebookCreatedAt.toISOString(),
      coverImage: {
        assetId: fixture.coverAsset.id,
        key: fixture.coverAsset.key,
        bucket: fixture.coverAsset.bucket,
      },
    })
    expect(s3Json.chapters).toEqual(
      fixture.chapters.map((chapter) => ({
        id: chapter.id,
        title: chapter.title,
        content: chapter.content,
        position: chapter.position,
        createdAt: chapter.createdAt.toISOString(),
      })),
    )
  })
})