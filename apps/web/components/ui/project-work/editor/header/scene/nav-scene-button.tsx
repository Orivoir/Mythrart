import {ChevronLeft, ChevronRight} from "lucide-react"
import {ButtonWithIcon} from "@/components/ui/button-with-icon"
import type { PaginatedScenesAPI } from "@/app/types/api/scene"


export interface NavSceneButtonProps {
  direction: "previous" | "next"
  currentPosition: number
  scenes: PaginatedScenesAPI
  count: number;
  selectScene: (sceneId: string | null) => void
}

export default function NavSceneButton({
  direction,
  currentPosition,
  scenes,
  count,
  selectScene
}: NavSceneButtonProps) {

  const getChangedByPosition = (direction: "previous" | "next") => {
    return scenes.items.find(scene => (
      scene.order === currentPosition + (
        direction === "next" ? 1: -1
      )
    ))
  }

  const onChange = (direction: "previous" | "next") => {
    const nextScene = getChangedByPosition(direction)

    if(!nextScene) return

    selectScene(nextScene.id)
  }

  const canPrevious = currentPosition > 0
  const canNext = currentPosition < count - 1

  const canClick = direction === "previous" ? canPrevious: canNext

  const Icon = direction === "previous" ? ChevronLeft: ChevronRight

  return (
    <ButtonWithIcon
      iconSize="lg"
      variant="ghost"
      className="p-0 rounded-full"
      size="sm"
      onClick={() => onChange(direction)}
      icon={Icon}
      disabled={!canClick} />
  )
}