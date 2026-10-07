import { useQuery } from "@tanstack/react-query"

import type { PaginatedEbooksAPI } from "@/app/types/api/ebook"

export const QUERY_KEY_PROJECT_LIST = "ebook-list"

async function fetchProjectList(
  page: number = 1
): Promise<PaginatedEbooksAPI> {
  const params = new URLSearchParams({
    page: page.toString()
  })

  const response = await fetch(`/api/ebooks?${params.toString()}`)

  if (!response.ok) {
    throw new Error("Failed to fetch project list")
  }

  return response.json()
}

export function useProjectList(
  page: number = 1,
  pageSize: number = 10,
) {
  return useQuery({
    queryKey: [
      QUERY_KEY_PROJECT_LIST,
      page,
      pageSize,
    ],
    queryFn: () => fetchProjectList(page),
    staleTime: Infinity,
  })
}