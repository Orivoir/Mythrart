import {prisma} from "@mythrart/database"

export interface CreateEbookParams {
  ownerId: string
  coverAssetId: string
  ebookTypeId: string
  ebookThemeId: string
}

export default async function createEbook({
  ownerId,
  coverAssetId,
  ebookTypeId,
  ebookThemeId,
}: CreateEbookParams) {

  return prisma.ebook.create({
    data: {
      ownerId: ownerId,
      title: "The Chronicles of the Astral Sea",
      subtitle: "Voyage Beyond the Boundary Stars",
      shortDescription: "A record of voyages through uncharted astral oceans and celestial anomalies.",
      coverAssetId: coverAssetId,
      ebookTypeId: ebookTypeId,
      ebookThemeId: ebookThemeId,
    },
  })
}