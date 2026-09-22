"use client"

import { useEffect, useState } from "react"

import type { ChapterResponseAPI } from "@/app/types/api/chapter"

import { useProjectContext } from "@/components/hooks/use-project-context"

import ProjectLeftPanelEmpty from "@/components/ui/project-work/left-panel/empty"
import ProjectLeftPanelHeader from "./header"
import ProjectLeftPanelItem from "./item"

type SceneFixture = {
  id: string
  chapterId: string
  title: string
  position: number
}

const chaptersFixture: ChapterResponseAPI[] = [
  {
    id: "fix-prisma-id-1",
    ebookId: "fixture-ebook",
    locale: "fr",
    title: "Origine du monde",
    position: 1,
    createdAt: Date.now(),
    updatedAt: Date.now(),
  },
  {
    id: "fix-prisma-id-2",
    ebookId: "fixture-ebook-2",
    locale: "fr",
    title: "Lundi",
    position: 2,
    createdAt: Date.now(),
    updatedAt: Date.now(),
  },
]

const scenesFixture: SceneFixture[] = [
  {
    id: "fix-scene-id-1",
    chapterId: "fix-prisma-id-1",
    title: "Une arrivée silencieuse",
    position: 1,
  },
  {
    id: "fix-scene-id-2",
    chapterId: "fix-prisma-id-1",
    title: "Premiers indices",
    position: 2,
  },
  {
    id: "fix-scene-id-3",
    chapterId: "fix-prisma-id-1",
    title: "Une conversation clé",
    position: 3,
  },
  {
    id: "fix-scene-id-4",
    chapterId: "fix-prisma-id-1",
    title: "Une décision",
    position: 4,
  },
]

export default function ProjectLeftPanel() {
  const {
    project,
    currentChapterEdition,
    selectChapter,
    selectScene,
  } = useProjectContext()

  const [scenes, setScenes] = useState<SceneFixture[]>([])

  const chapters = chaptersFixture.map((chapter) => ({
    ...chapter,
    ebookId: project.id,
  }))

  useEffect(() => {
    const chapterId = currentChapterEdition?.chapterId

    if (!chapterId) {
      setScenes([])
      return
    }

    // TODO: remplacer par GET /api/chapters/{chapterId}/scenes
    const chapterScenes = scenesFixture
      .filter((scene) => scene.chapterId === chapterId)
      .sort((a, b) => a.position - b.position)

    setScenes(chapterScenes)
  }, [currentChapterEdition?.chapterId])

  const shouldShowEmpty =
    chapters.length < 2 &&
    scenes.length === 0

  return (
    <aside
      className="
        flex
        h-[calc(100vh-64px)]
        w-[282px]
        shrink-0
        flex-col
        border-r
        border-border
        bg-soft-blue/30
      "
    >
      <ProjectLeftPanelHeader type="chapters" />

      <div className="flex min-h-0 flex-1 flex-col px-3 py-3">
        {/* Chapters */}
        <div className="flex flex-col gap-2">
          {chapters.map((chapter) => (
            <ProjectLeftPanelItem
              key={chapter.id}
              id={chapter.id}
              title={chapter.title}
              position={chapter.position}
              type="chapter"
              isActive={
                currentChapterEdition?.chapterId === chapter.id
              }
              onSelect={selectChapter}
            />
          ))}
        </div>

        {/* Scenes */}
        {currentChapterEdition?.chapterId && (
          <>
            <ProjectLeftPanelHeader type="scenes" />

            <div className="flex flex-col gap-2">
              {scenes.map((scene) => (
                <ProjectLeftPanelItem
                  key={scene.id}
                  id={scene.id}
                  title={scene.title}
                  position={scene.position}
                  type="scene"
                  isActive={
                    currentChapterEdition.sceneId === scene.id
                  }
                  onSelect={selectScene}
                />
              ))}
            </div>
          </>
        )}

        {/* Empty */}
        {shouldShowEmpty && (
          <ProjectLeftPanelEmpty />
        )}
      </div>
    </aside>
  )
}