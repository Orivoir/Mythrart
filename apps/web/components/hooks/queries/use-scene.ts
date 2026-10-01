import { useQuery } from "@tanstack/react-query"

import type { SceneResponseAPI } from "@/app/types/api/scene"

async function fetchScene(
  sceneId: string,
): Promise<SceneResponseAPI> {
  const response = await fetch(
    `/api/scenes/${sceneId}`,
  )

  if (!response.ok) {
    throw new Error("Failed to fetch scene")
  }

  return response.json()
}

export function useScene(
  sceneId?: string | null,
) {
  return useQuery({
    queryKey: [
      "scene",
      sceneId,
    ],
    queryFn: () =>
      fetchScene(sceneId!),
    enabled: !!sceneId,
    staleTime: Infinity,
  })
}