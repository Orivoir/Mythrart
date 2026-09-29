import { useMutation, useQueryClient } from "@tanstack/react-query"
import type {
  UpdateChapterRequestAPI,
  UpdateChapterResponseAPI,
} from "@/app/types/api/chapter"
import { QUERY_KEY_CHAPTER } from "./use-chapter"

async function updateChapter(
  chapterId: string,
  data: UpdateChapterRequestAPI,
): Promise<UpdateChapterResponseAPI> {
  const response = await fetch(`/api/chapters/${chapterId}`, {
    method: "PUT",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(data),
  })

  if (!response.ok) {
    throw new Error("Failed to update chapter")
  }

  return response.json()
}

export function useUpdateChapter() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: ({
      chapterId,
      data,
    }: {
      chapterId: string
      data: UpdateChapterRequestAPI
    }) => updateChapter(chapterId, data),

    onSuccess: (chapter) => {
      queryClient.setQueryData(
        [QUERY_KEY_CHAPTER, chapter.id, chapter.locale],
        chapter,
      )
    },
  })
}