
import type { JSONContent } from "@tiptap/core"
import type { CreateEpubOptions, EpubContributor } from "@mythrart/epub"

import type { NormalizedEbook } from "./normalize.js"
import { loadEbookAssets } from "./load-ebook-asset.js"
import { loadEbookAdditionalData } from "./additionals-data.js"
import { mapEbookTheme } from "./map-ebook-theme.js"
import { mapRoleContributor } from "./map-roles-contributor.js"

export async function generateEpubBridge(
  ebook: NormalizedEbook,
): Promise<CreateEpubOptions> {
  
  const [{ assets, coverImage }, bridgeData] = await Promise.all([
    loadEbookAssets(ebook),
    loadEbookAdditionalData(ebook.id, {
      withTheme: true,
      withCollaborators: true,
      withGenres: false,
      withEbookType: false,
      withOwner: true,
    }),
  ])

  if (!bridgeData) {
    throw new Error(`Ebook ${ebook.id} not found`)
  }

  const contributors: EpubContributor[] = bridgeData.collaborators.flatMap(
    (collaborator) => {
      const name = getDisplayName(
        collaborator.user.firstName,
        collaborator.user.lastName,
        collaborator.user.username
      )

      if (!name) {
        return []
      }

      return [
        {
          name,
          role: mapRoleContributor(collaborator.role),
        },
      ]
    },
  )

  const creator =
    getDisplayName(
      bridgeData.owner.firstName,
      bridgeData.owner.lastName,
      bridgeData.owner.username,
    ) ?? "Unknown author"

  return {
    book: {
      id: ebook.id,
      title: ebook.title,
      subtitle: ebook.subtitle,
      description: ebook.shortDescription,
      language: ebook.locale,
      createdAt: ebook.createdAt,
      creator,
      coverImage,
      assets,
      contributors,
      chapters: ebook.chapters.map((chapter) => ({
        id: chapter.id,
        title: chapter.title,
        position: chapter.position,
        content: chapter.content as JSONContent,
      })),
    },
    theme: mapEbookTheme(bridgeData.ebookTheme),
  }
}

function getDisplayName(
  firstName: string | null,
  lastName: string | null,
  username: string | null,
): string | null {
  const fullName = [firstName, lastName]
    .filter((part): part is string => Boolean(part?.trim()))
    .join(" ")
    .trim()

  return fullName || username?.trim() || "Anon."
}
