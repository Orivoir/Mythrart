import { useQuery } from "@tanstack/react-query"

import type { EbookMetadataResponseAPI } from "@/app/api/ebooks/[id]/metadata/types"

export const QUERY_KEY_PROJECT_METADATA = "ebook-metadata"

async function fetchProjectMetadata(
  ebookId: string,
): Promise<EbookMetadataResponseAPI> {
  const response = await fetch(`/api/ebooks/${ebookId}/metadata`)

  if (!response.ok) {
    throw new Error("Failed to fetch project metadata")
  }

  return response.json()
}

export function useProjectMetadata(ebookId: string | null) {
  return useQuery({
    queryKey: [QUERY_KEY_PROJECT_METADATA, ebookId],
    queryFn: () => fetchProjectMetadata(ebookId!),
    enabled: !!ebookId,
    staleTime: Infinity,
  })
}