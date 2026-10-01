import { UpdateChapterRequestAPI } from "@/app/types/api/chapter"
import { CreateEbookResponseAPI } from "@/app/types/api/ebook"
import { JSONContent } from "@tiptap/react"

export type ChapterEdition = {
  chapterId: string | null
  sceneId: string | null
}

export type ProjectContextValue = {
  project: CreateEbookResponseAPI
  currentChapterEdition: ChapterEdition | null
  currentLocale: string

  updateCurrentChapter: (
    mutation: UpdateChapterRequestAPI
  ) => void

  /**
   * @description Update the current edition chapter in the project
   */
  selectChapter: (chapterId: string, newContent?: JSONContent) => void
  
  /**
   * @description Update the current locale in the project
   */
  selectLocale: (locale: string) => void

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
