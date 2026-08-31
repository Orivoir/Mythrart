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
  await safeDelete(prisma.chapterAssetReference)
  await safeDelete(prisma.uploadHandshake)
  await safeDelete(prisma.snapshotFile)
  await safeDelete(prisma.snapshot)
  await safeDelete(prisma.chapter)
  await safeDelete(prisma.asset)
  await safeDelete(prisma.ebook)
  await safeDelete(prisma.account)
  await safeDelete(prisma.verificationToken)
  await safeDelete(prisma.user)
}
