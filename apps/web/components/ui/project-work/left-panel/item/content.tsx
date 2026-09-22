import { Text, HelperText } from "@/components/ui/Typography"
import { cn } from "@/lib/utils"

export interface ProjectLeftPanelItemContentProps {
  isActive: boolean;
  title: string;
  position: number;
  type: "scene" | "chapter";
  objective?: string
}

export default function ProjectLeftPanelItemContent({
  isActive,
  title,
  position,
  type,
  objective
}: ProjectLeftPanelItemContentProps) {

  const titleText = type === "chapter" ? `Chapitre ${position}` : (
    `${position}. ${title}`
  );

  return (
    <span className="min-w-0 flex-1">
      <Text
        className={cn(
          "block truncate font-medium",
          isActive && "text-accent",
        )}
      >
        {titleText}
      </Text>

      <HelperText className="block truncate">
        { objective ?? title}
      </HelperText>
    </span>
  )
}