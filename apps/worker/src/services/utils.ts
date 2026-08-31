import { prisma } from "@mythrart/database"

export type Requirements = Awaited<ReturnType<typeof loadRequirements>>

export async function loadRequirements(ebookId: string) {
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
