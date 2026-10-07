import { useQuery } from "@tanstack/react-query"

import type { EbookCoverResponseAPI } from "@/app/types/api/ebook"

export const QUERY_KEY_PROJECT_COVER = "ebook-cover"

async function fetchProjectCover(
  ebookId: string,
): Promise<EbookCoverResponseAPI> {
  const response = await fetch(`/api/ebooks/${ebookId}/cover`)

  if (!response.ok) {
    throw new Error("Failed to fetch project cover")
  }

  return response.json()
}

export function useProjectCover(ebookId: string | null) {
  return useQuery({
    queryKey: [QUERY_KEY_PROJECT_COVER, ebookId],
    queryFn: () => fetchProjectCover(ebookId!),
    enabled: !!ebookId,
    staleTime: Infinity,
  })
}