import { useMutation, useQueryClient } from "@tanstack/react-query"
import type {
  UpdateChapterRequestAPI,
  UpdateChapterResponseAPI,
} from "@/app/types/api/chapter"
import fireEvent from "@/lib/constants/custom-events"
import { QUERY_KEY_CHAPTER } from "./use-chapter"

async function updateChapter(
  chapterId: string,
  data: UpdateChapterRequestAPI
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

export interface UseUpdateChapterOptions {
  onSuccess?: (chapter: UpdateChapterResponseAPI) => void;
  onError?: (error: Error) => void;
}

export function useUpdateChapter({
  onSuccess,
  onError = () =>  {},
}: UseUpdateChapterOptions = {}) {
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

      if(onSuccess) {
        onSuccess(chapter)
      }
    },
    onError,
    onMutate: () => {
      fireEvent.cloudSaveStart()
    },
    onSettled: () => {
      fireEvent.cloudSaveFinish()
    }
  })
}