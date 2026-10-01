import { useQuery } from "@tanstack/react-query"
import type { ChapterResponseAPI } from "@/app/types/api/chapter"

export const QUERY_KEY_LAST_CHAPTER = "last-chapter"

async function fetchLastChapter(
  ebookId: string,
  locale?: string,
): Promise<ChapterResponseAPI> {
  const params = new URLSearchParams()

  if (locale) {
    params.set("locale", locale)
  }

  const query = params.toString()

  const response = await fetch(
    `/api/ebooks/${ebookId}/chapters/last${query ? `?${query}` : ""}`,
  )

  if (!response.ok) {
    throw new Error("Failed to fetch last chapter")
  }

  return response.json()
}

export function useLastChapter(
  ebookId?: string | null,
  locale?: string,
) {
  return useQuery({
    queryKey: [QUERY_KEY_LAST_CHAPTER, ebookId, locale],
    queryFn: () => fetchLastChapter(ebookId!, locale),
    enabled: !!ebookId,
    staleTime: Infinity,
  })
}