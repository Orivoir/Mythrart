import {useScenesList} from "@/components/hooks/queries/use-scenes-list"
import {useScene} from "@/components/hooks/queries/use-scene"
import {useProjectContext} from "@/components/hooks/use-project-context"
import {Chip} from "@/components/ui/chip"
import { HelperText } from "@/components/ui/Typography"
import NavSceneButton from "./nav-scene-button"

export default function SceneHeader() {

  const {currentChapterEdition, selectScene} = useProjectContext()

  const { data: scenesList, isLoading: isLoadingSceneList } = useScenesList(
    currentChapterEdition?.chapterId ?? null
  )
  const { data: scene, isLoading: isSceneLoading } = useScene(
    currentChapterEdition?.sceneId ?? null
  )

  if(!currentChapterEdition?.sceneId) return null

  if(!scenesList || !scene) {
    return <>Loading..</>
  }

  const {totalItems} = scenesList
  const {order} = scene

  if(totalItems < 2) return null;

  if(typeof order !== "number") return null


  return (
    <Chip
      className="bg-soft-blue/30"
    >
      <div className="flex flex-row items-center justify-between gap-4">
        <HelperText className="text-accent">
          Scénes {order + 1} sur {totalItems}
        </HelperText>

        <div>
          <NavSceneButton
            direction="previous"
            currentPosition={order}
            scenes={scenesList}
            count={totalItems}
            selectScene={selectScene}
          />
          <NavSceneButton
            direction="next"
            currentPosition={order}
            scenes={scenesList}
            count={totalItems}
            selectScene={selectScene}
          />
        </div>

      </div>
    </Chip>
  )
}