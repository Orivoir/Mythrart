import prisma from "./prisma"

async function safeDelete(model: {
  deleteMany: () => Promise<unknown>
}): Promise<void> {
  try {
    await model.deleteMany()
  } catch (error) {
    const candidate = error as { code?: string }

    if (candidate.code === "P2021" || candidate.code === "P2022") {
      return
    }

    throw error
  }
}

export default async function resetDb(): Promise<void> {
  // Break the Ebook -> Snapshot reference before deleting snapshots.
  try {
    await prisma.ebook.updateMany({
      data: {
        currentSnapshotId: null,
      },
    })
  } catch (error) {
    const candidate = error as { code?: string }

    if (candidate.code !== "P2021" && candidate.code !== "P2022") {
      throw error
    }
  }

  const tables = [
    prisma.chapterAssetReference,
    prisma.sceneEntity,
    prisma.snapshotFile,
    prisma.snapshot,
    prisma.uploadHandshake,
    prisma.ebookCollaborator,
    prisma.ebookCustomRole,
    prisma.ebookEntityRelation,
    prisma.writingGoal,
    prisma.chapterLocale,
    prisma.scene,
    prisma.chapter,
    prisma.ebookEntity,
    prisma.ebook,
    prisma.asset,
    prisma.account,
    prisma.verificationToken,
    prisma.user,
    prisma.ebookTheme,
    prisma.ebookType,
  ]

  // Delete sequentially so each referenced row is removed before its parent.
  for (const table of tables) {
    await safeDelete(table)
  }
}
