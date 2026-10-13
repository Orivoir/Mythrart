import {prisma} from "@mythrart/database"

export default async function createEbookType(id: string) {
  return prisma.ebookType.create({
    data: {
      name: `Fantasy Novel ${id}`,
      slug: `fantasy-novel-${id}`,
      description: "Integration test fantasy type",
    },
  })
}