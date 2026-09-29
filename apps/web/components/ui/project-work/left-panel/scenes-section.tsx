"use client"
import { useProjectContext } from "@/components/hooks/use-project-context"
import ProjectLeftPanelItem from "./item"
import { useScenesList } from "@/components/hooks/queries/use-scenes-list"
import fireEvent from "@/lib/constants/custom-events"

export default function ProjectLeftPanelScenesSection() {

  const {
      currentChapterEdition,
      selectScene
    } = useProjectContext()

    const { items: scenes, isLoading, error } = useScenesList(currentChapterEdition?.chapterId ?? null)

    if(!currentChapterEdition?.chapterId || !scenes.length) {
      return null
    }

    const onSelectScene  = (sceneId: string) => {
      fireEvent.selectScene({sceneId})
      selectScene(sceneId)
    } 

    return (
      <div className="flex flex-col gap-2">
        {scenes.map((scene) => (
          <ProjectLeftPanelItem
            key={scene.id}
            id={scene.id}
            title={scene.title}
            position={scene.order || 0}
            type="scene"
            isActive={
              currentChapterEdition.sceneId === scene.id
            }
            onSelect={() => onSelectScene(scene.id)}
          />
        ))}
      </div>
    )
}