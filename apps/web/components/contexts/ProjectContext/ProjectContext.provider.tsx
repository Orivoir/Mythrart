"use client"

import { CreateEbookResponseAPI } from "@/app/types/api/ebook"
import { UpdateChapterRequestAPI } from "@/app/types/api/chapter"

import { useCallback, useMemo, useState } from "react"
import type { JSONContent } from "@tiptap/react"
import { useUpdateChapter } from "@/components/hooks/queries/use-update-chapter"

import { ProjectContext } from "./ProjectContext"
import type {
  ProjectProviderProps,
  ChapterEdition,
} from "./ProjectContext.types"

export function ProjectProvider({
  children,
  workingIn,
}: ProjectProviderProps) {
  const [project, setProject] = useState(workingIn)

  const [currentChapterEdition, setCurrentChapterEdition] =
    useState<ChapterEdition>({
      chapterId: null,
      sceneId: null,
    })

  const [currentLocale, setCurrentLocale] = useState<string>("en")

  const { mutate: updateChapterMutation } = useUpdateChapter()

  const updateCurrentChapter = useCallback(
    (mutation: UpdateChapterRequestAPI) => {
      if (!currentChapterEdition.chapterId) {
        return
      }

      updateChapterMutation({
        chapterId: currentChapterEdition.chapterId,
        data: {
          ...mutation,
          locale: mutation.locale ?? currentLocale,
        },
      })
    },
    [
      currentChapterEdition.chapterId,
      currentLocale,
      updateChapterMutation,
    ],
  )

  const selectChapter = useCallback(
    (chapterId: string, newContent?: JSONContent) => {
      if (chapterId === currentChapterEdition.chapterId) {
        return
      }

      if (newContent && currentChapterEdition.chapterId) {
        updateCurrentChapter({
          content: newContent,
        })
      }

      setCurrentChapterEdition({
        chapterId,
        sceneId: null,
      })
    },
    [
      currentChapterEdition.chapterId,
      updateCurrentChapter,
    ],
  )

  const selectScene = useCallback((sceneId: string | null) => {
    setCurrentChapterEdition((current) => ({
      ...current,
      sceneId,
    }))
  }, [])

  const selectProject = useCallback(
    (project: CreateEbookResponseAPI) => {
      setProject(project)
    },
    [],
  )

  const selectLocale = useCallback((locale: string) => {
    setCurrentLocale(locale)
  }, [])

  const value = useMemo(
    () => ({
      project,
      currentChapterEdition,
      currentLocale,
      updateCurrentChapter,
      selectChapter,
      selectLocale,
      selectScene,
      selectProject,
    }),
    [
      project,
      currentChapterEdition,
      currentLocale,
      updateCurrentChapter,
      selectChapter,
      selectLocale,
      selectScene,
      selectProject,
    ],
  )

  return (
    <ProjectContext.Provider value={value}>
      {children}
    </ProjectContext.Provider>
  )
}