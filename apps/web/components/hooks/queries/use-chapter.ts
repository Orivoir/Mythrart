import { useQuery } from "@tanstack/react-query"
import type { ChapterContentResponseAPI } from "@/app/types/api/chapter"

export const QUERY_KEY_CHAPTER = "chapter"

async function fetchChapter(
    chapterId?: string | null,
    locale?: string,
): Promise<ChapterContentResponseAPI> {
    const params = new URLSearchParams()

    if (locale) {
        params.set("locale", locale)
    }

    const query = params.toString()

    const response = await fetch(
        `/api/chapters/${chapterId}${query ? `?${query}` : ""}`,
    )

    if (!response.ok) {
        throw new Error("Failed to fetch chapter")
    }

    return response.json()
}

export function useChapter(
    chapterId?: string | null,
    locale?: string,
) {
    return useQuery({
        queryKey: [QUERY_KEY_CHAPTER, chapterId, locale],
        queryFn: () => fetchChapter(chapterId, locale),
        enabled: !!chapterId,
        staleTime: Infinity,
    })
}