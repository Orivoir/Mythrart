import { SyntheticEvent } from "react"
import { useScene } from "@/components/hooks/queries/use-scene"
import FormTitle from "./form-title"
import FormPosition from "./form-position"
import { useProjectContext } from "@/components/hooks/use-project-context"
import EmptyScene from "./empty"
import LoadingScene from "./loading"
import FormDescribe from "./form-describe"

export default function SceneTabContent() {

  const { currentChapterEdition, currentLocale } = useProjectContext()
  const sceneId = currentChapterEdition?.sceneId ?? null
  const {data: scene, isPending} = useScene(sceneId)

  if(!currentChapterEdition?.sceneId) {
    return <EmptyScene />
  }

  if(isPending) {
    return <LoadingScene />
  }

  const onUpdateScene = (event: SyntheticEvent<HTMLFormElement>) => {}

  return (
    <div>
      <form
        action="#"
        method="post"
        className="mb-4"
        onSubmit={onUpdateScene}
      >
        <FormTitle title={scene?.title ?? ""} />
        <FormPosition position={scene?.order ?? 1} />
        <FormDescribe objective={scene?.objective ?? ""} />
      </form>
    </div>
  )
}