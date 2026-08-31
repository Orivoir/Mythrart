import { Text } from "@/components/ui/Typography/text"
import { Title } from "@/components/ui/Typography/title"
import {
  PencilSparklesIcon,
  UsersIcon,
  HistoryIcon,
  GlobeIcon,
  GlobeOffIcon,
  WandSparklesIcon
} from "lucide-react"
import { IconSurface } from "./icon-surface"

export type FeatureType =  "pencil" | "users" | "history" | "globe" | "globe-off" | "wand-sparkles"

export function Feature({
  title,
  description,
  type
}: {
  title: string
  description: string,
  type: FeatureType
}) {
  return (
    <div className="
      rounded-lg
      border border-border
      bg-card
      p-4
      flex
      items-start
      gap-4
      bg-surface
    ">

      <IconSurface>
        {type === "pencil" && <PencilSparklesIcon size={32} className="text-accent" />}
        {type === "users" && <UsersIcon size={32} className="text-accent" />}
        {type === "history" && <HistoryIcon size={32} className="text-accent" />}
        {type === "globe" && <GlobeIcon size={32} className="text-accent" />}
        {type === "globe-off" && <GlobeOffIcon size={32} className="text-accent" />}
        {type === "wand-sparkles" && <WandSparklesIcon size={32} className="text-accent" />}
      </IconSurface>

      <div className="min-w-0">
        <Title variant="default" className="line-clamp-1">
          {title}
        </Title>

      <Text
        className="
          mt-2
          line-clamp-3
          text-xs
        "
        variant="muted"
      >
        {description}
      </Text>
    </div>
  </div>
  )
}