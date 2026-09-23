import { useQuery } from "@tanstack/react-query"

import type { PaginatedScenesAPI } from "@/app/types/api/scene"

import { usePagination } from "./use-pagination"

async function fetchScenes(
    chapterId: string,
    page: number,
): Promise<PaginatedScenesAPI> {
    const params = new URLSearchParams({
        page: String(page),
    })

    const response = await fetch(
        `/api/chapters/${chapterId}/scenes?${params.toString()}`,
    )

    if (!response.ok) {
        throw new Error("Failed to fetch scenes")
    }

    return response.json()
}

export function useScenesList(
    chapterId: string | null,
) {
    const {
        currentPage,
        next,
        previous,
        goTo,
    } = usePagination()

    const query = useQuery({
        queryKey: [
            "chapter",
            chapterId,
            "scenes",
            currentPage,
        ],
        queryFn: () =>
            fetchScenes(
                chapterId!,
                currentPage,
            ),
        enabled: !!chapterId,
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