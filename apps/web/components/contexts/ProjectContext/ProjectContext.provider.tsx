"use client"

import { CreateEbookResponseAPI } from "@/app/types/api/ebook"

import { useMemo, useState } from "react"

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

  const selectChapter = (chapterId: string) => {
    setCurrentChapterEdition({
      chapterId,
      sceneId: null,
    })
  }

  const selectScene = (sceneId: string | null) => {
    setCurrentChapterEdition((current) => {
      if (!current) {
        return current
      }

      return {
        ...current,
        sceneId,
      }
    })
  }

  const selectProject = (project: CreateEbookResponseAPI) => {
    setProject(project)
  }

  const value = useMemo(
    () => ({
      project,
      currentChapterEdition,
      selectChapter,
      selectScene,
      selectProject,
    }),
    [project, currentChapterEdition],
  )

  return (
    <ProjectContext.Provider value={value}>
      {children}
    </ProjectContext.Provider>
  )
}