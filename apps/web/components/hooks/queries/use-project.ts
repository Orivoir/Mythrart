import { useQuery } from "@tanstack/react-query"

import type { GetEbookResponseAPI } from "@/app/types/api/ebook"

export const QUERY_KEY_PROJECT = "ebook"

async function fetchProject(
    ebookId: string,
): Promise<GetEbookResponseAPI> {
    const response = await fetch(`/api/ebooks/${ebookId}`)

    if (!response.ok) {
        throw new Error("Failed to fetch project")
    }

    return response.json()
}

export function useProject(ebookId: string | null) {
    return useQuery({
        queryKey: [QUERY_KEY_PROJECT, ebookId],
        queryFn: () => fetchProject(ebookId!),
        enabled: !!ebookId,
        staleTime: Infinity,
    })
}