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

  const tables = [
    prisma.chapterAssetReference,
    prisma.uploadHandshake,
    prisma.snapshotFile,
    prisma.snapshot,
    prisma.chapter,
    prisma.asset,
    prisma.ebook,
    prisma.account,
    prisma.verificationToken,
    prisma.user,
    prisma.scene,
    prisma.ebookCollaborator,
    prisma.ebookTheme,
    prisma.ebookType,
    prisma.chapterLocale,
    prisma.ebookCustomRole,
    prisma.ebookEntityRelation,
    prisma.writingGoal,
  ]

  await Promise.all(tables.map(safeDelete))
}
