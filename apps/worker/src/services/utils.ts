import { prisma } from "@mythrart/database"

export type Requirements = Awaited<ReturnType<typeof loadRequirements>>
export type RequirementsStrategy = "low-cost" | "with-content-assets"

export async function loadRequirements(
  ebookId: string,
  strategy: RequirementsStrategy = "low-cost",
) {
  const requirements = await prisma.ebook.findUnique({
    where: {id: ebookId},
    include: {
      chapters: {
        orderBy: {position: "asc"},
        include: {
          ...(strategy === "with-content-assets" ? {
            assetReferences: {
              where: {
                type: "CONTENT_IMAGE",
              },
              include: {
                asset: true,
              },
            },
          } : {}),
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
