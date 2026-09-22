import { CreateEbookResponseAPI } from "@/app/types/api/ebook"

export type ChapterEdition = {
  chapterId: string | null
  sceneId: string | null
}

export type ProjectContextValue = {
  project: CreateEbookResponseAPI
  currentChapterEdition: ChapterEdition | null

  /**
   * @description Update the current edition chapter in the project
   */
  selectChapter: (chapterId: string) => void
  
  /**
   * @description Update the current edition scene in the project
   */
  selectScene: (sceneId: string | null) => void

  selectProject: (project: CreateEbookResponseAPI) => void
}

export type ProjectProviderProps = {
  children: React.ReactNode
  workingIn: CreateEbookResponseAPI
}
