import { Button } from "@/components/ui/button"
import { ButtonWithIcon } from "@/components/ui/button-with-icon"
import { MoreHorizontal } from "lucide-react"
import { cn } from "@/lib/utils"

import ProjectLeftPanelItemIcon from "./icon"
import ProjectLeftPanelItemContent from "./content"

export interface ProjectLeftPanelItemProps {
  isActive: boolean
  id: string
  title: string
  position: number
  type: "scene" | "chapter"
  onSelect: (itemId: string) => void
}

export default function ProjectLeftPanelItem({
  id,
  isActive,
  onSelect,
  title,
  position,
  type,
}: ProjectLeftPanelItemProps) {
  const onOpenItemMenu = () => {
    // TODO: open item menu
  }

  return (
    <div
      className={cn(
        "group flex w-full items-center rounded-lg",
        isActive
          ? "bg-background"
          : "hover:bg-background/70",
      )}
    >
      <Button
        type="button"
        variant="ghost"
        onClick={() => onSelect(id)}
        className="
          h-auto
          min-w-0
          flex-1
          justify-start
          gap-3
          px-3
          py-3
          text-left
        "
      >
        <ProjectLeftPanelItemIcon
          isActive={isActive}
        />

        <ProjectLeftPanelItemContent
          isActive={isActive}
          title={title}
          position={position}
          type={type}
        />
      </Button>

      <ButtonWithIcon
        type="button"
        variant="ghost"
        size="icon"
        aria-label="More options"
        icon={MoreHorizontal}
        iconClassName="size-4 text-muted-foreground"
        className="
          mr-1
          shrink-0
          opacity-0
          transition-opacity
          group-hover:opacity-100
        "
        onClick={onOpenItemMenu}
      />
    </div>
  )
}