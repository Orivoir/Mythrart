import { useEffect } from "react"
import { useQuery } from "@tanstack/react-query"

import type { PaginatedEbookEntitiesAPI } from "@/app/types/api/ebook-entity"

import { usePagination } from "./use-pagination"

export async function fetchEbookEntities(
    ebookId: string,
    page: number,
    sceneId?: string | null,
    search?: string,
    type?: string,
): Promise<PaginatedEbookEntitiesAPI> {
    const params = new URLSearchParams({
        page: String(page),
    })

    if (sceneId) {
        params.set("sceneId", sceneId)
    }

    if (search?.trim()) {
        params.set("search", search.trim())
    }

    if (type) {
        params.set("type", type)
    }

    const response = await fetch(
        `/api/ebooks/${ebookId}/entities?${params.toString()}`,
    )

    if (!response.ok) {
        throw new Error("Failed to fetch ebook entities")
    }

    return response.json()
}

interface UseEbookEntitiesOptions {
    ebookId: string | null
    sceneId?: string | null
    search?: string
    type?: string
}

export function useEbookEntities({
    ebookId,
    sceneId,
    search,
    type,
}: UseEbookEntitiesOptions) {
    const {
        currentPage,
        next,
        previous,
        goTo,
        reset,
    } = usePagination()

    useEffect(() => {
        reset()
    }, [sceneId, search, type, reset])

    const query = useQuery({
        queryKey: [
            "ebook",
            ebookId,
            "entities",
            sceneId,
            search,
            type,
            currentPage,
        ],
        queryFn: () =>
            fetchEbookEntities(
                ebookId!,
                currentPage,
                sceneId,
                search,
                type,
            ),
        enabled: !!ebookId,
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