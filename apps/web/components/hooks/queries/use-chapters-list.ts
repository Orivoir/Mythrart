import { useQuery } from "@tanstack/react-query"

import type { PaginatedChaptersAPI } from "@/app/types/api/chapter"

import { usePagination } from "./use-pagination"

async function fetchChapters(
    ebookId: string,
    locale: string,
    page: number,
): Promise<PaginatedChaptersAPI> {
    const params = new URLSearchParams({
        page: String(page),
        locale,
    })

    const response = await fetch(
        `/api/ebooks/${ebookId}/chapters?${params.toString()}`,
    )

    if (!response.ok) {
        throw new Error("Failed to fetch chapters")
    }

    return response.json()
}

export function useChaptersList(
    ebookId: string | null,
    locale: string,
) {
    const {
        currentPage,
        next,
        previous,
        goTo,
    } = usePagination()

    const query = useQuery({
        queryKey: [
            "ebook",
            ebookId,
            "chapters",
            locale,
            currentPage,
        ],
        queryFn: () =>
            fetchChapters(
                ebookId!,
                locale,
                currentPage,
            ),
        enabled: !!ebookId && !!locale,
        staleTime: Infinity,
    })

    return {
        ...query,
        items: query.data?.items ?? [],
        next,
        previous,
        goTo,
        currentPage,
    }
}