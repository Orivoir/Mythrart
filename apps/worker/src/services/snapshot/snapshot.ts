import type {SnapshotJobData, SnapshotJobResult} from "./../../validations/snapshot.job.js"
import { prisma } from "@mythrart/database"
import { s3, PutObjectCommand } from "@mythrart/s3"

export type RequirementGenerateSnapshot = typeof loadSnapshotData extends (...args: any) => Promise<infer R> ? R : never

export async function loadSnapshotData(ebookId: string) {
  const requirements = await prisma.ebook.findUnique({
    where: {id: ebookId},
    include: {
      chapters: {
        orderBy: {position: "asc"},
        include: {
          locales: {
            where: {
              locale: "en",
            },
            take: 1,
          },
        },
      },
      currentSnapshot: true,
      coverAsset: true
    }
  })

  if(!requirements) {
    throw new Error(`Ebook with id ${ebookId} not found`)
  }

  return requirements
}

export async function generate({ebookId}: SnapshotJobData): Promise<SnapshotJobResult
> {
  /**
   * Should create un snapshot-v{version}.json at s3 Bucket
   * and upgrade database models:
   * 
   * 1 - Database (read): Get the ebook with all required metadata
   * 2 - Database (read): Get all chapters of the ebook from the database
   * 3 - Database (read): Get the latest snapshot version of this ebook from the database
   * 4 - local: Build json snapshot with the content and metadata
   * 5 - S3 (write): add the snapshot to s3 bucket with the name snapshot-v{version}.json
   * 6 - Database (write): Add SnapshotFile record to the database with the s3 path
   * 7 - Database (write): Add Snapshot record to the database with the version, ebook, SnapshotFileId and version
   * 8 - Database (write): Update the ebook record (currentSnapshot property)
   * 
   * During transaction database failures should delete
   * file snapshot-v{version}.json from s3 bucket. 
   */

  const ebook = await loadSnapshotData(ebookId)

  const nextVersion = (ebook.currentSnapshot?.version ?? 0) + 1

  // Chapter content now lives in ChapterLocale rows.

  const snapshotJson = {
    // the format version should be NEVER upgraded
    // this data is used for backward compatibility between format snapshot used
    formatVersion: 1,
    
    metadata: getSnapshotMetadata(nextVersion),

    ebook: getSnapshotEbookData(ebook),

    chapters: ebook.chapters.map(getChapterData)
  }

  const snapshotJsonString = JSON.stringify(snapshotJson)

  const snapshotFileName = `snapshot-v${nextVersion}.json`

  const key = `users/${ebook.ownerId}/snapshots/${snapshotFileName}`
  
  const command = new PutObjectCommand({
    Bucket: process.env.S3_BUCKET,
    Key: key,
    ContentType: "application/json",
    Body: snapshotJsonString
  })

  const {$metadata} = await s3.send(command)

  if($metadata.httpStatusCode !== 200 && $metadata.httpStatusCode !== 201) {
    throw new Error(`Failed to upload snapshot to S3. HTTP status code: ${$metadata.httpStatusCode}`)
  }

  const snapshot = await prisma.$transaction(async (tx) => {

    const snapshot = await tx.snapshot.create({
      data: {
        version: nextVersion,
        ebookId: ebook.id,
        status: "READY",
        file: {
          create: {
            key,
            bucket: process.env.S3_BUCKET!,
            sizeBytes: Buffer.byteLength(snapshotJsonString, "utf-8"),
            mimeType: "application/json" 
          }
        }
      },
      include: {
        file: true,
      },
    })

    await tx.ebook.update({
      where: {id: ebook.id},
      data: {
        currentSnapshot: {
          connect: {
            id: snapshot.id
          }
        }
      }
    })

    return snapshot
  })

  if (!snapshot.file) {
    throw new Error("Snapshot file was not created")
  }

  return {
    snapshot: {
      id: snapshot.id,
      ebookId: snapshot.ebookId,
      version: snapshot.version,
      status: snapshot.status,
      createdAt: snapshot.createdAt.getTime(),
      file: {
        id: snapshot.file.id,
        key: snapshot.file.key,
        bucket: snapshot.file.bucket,
        sizeBytes: snapshot.file.sizeBytes,
        mimeType: snapshot.file.mimeType,
        createdAt: snapshot.file.createdAt.getTime(),
      },
    },
  }
  // later should be handler case of:
  // 1 . uploading to S3 success
  // 2 . database transaction failed
  // Should delete the uploaded file from S3 from try/catch
  // block and throw error to retry the job
}

function getChapterData(chapter: RequirementGenerateSnapshot["chapters"][number]) {
  const localized = chapter.locales[0]

  return {
    id: chapter.id,
    title: localized?.title || chapter.title,
    content: localized?.content || {},
    position: chapter.position,
    createdAt: chapter.createdAt
  }
}

function getSnapshotEbookData(ebook: RequirementGenerateSnapshot) {

  const {id, title, subtitle, shortDescription, createdAt} = ebook

  return {
    id,
    title,
    subtitle,
    shortDescription,
    createdAt,
    coverImage: ebook.coverAsset ? {
      assetId: ebook.coverAsset.id,
      key: ebook.coverAsset.key,
      bucket: ebook.coverAsset.bucket,
    }  : null
  }
}

function getSnapshotMetadata(version: number) {
  return {
    generatedAt: new Date().getTime(),
    version
  }
}