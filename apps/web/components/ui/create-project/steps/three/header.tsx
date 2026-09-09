import { Info } from "lucide-react"

import { Switch } from "@/components/ui/switch"
import { Tooltip } from "@/components/ui/tooltip"
import { Text, Title } from "@/components/ui/Typography"

interface StepThreeHeaderProps {
  title: string
  subtitle: string
  withEnable: boolean
  enabled?: boolean
  infos?: {
    title: string
    describe: string
  }
  onEnabledChange?: (enabled: boolean) => void
}

export function StepThreeHeader({
  title,
  subtitle,
  withEnable,
  enabled = false,
  infos,
  onEnabledChange,
}: StepThreeHeaderProps) {
  return (
    <div className="flex items-start gap-3">
      <div className="min-w-0 flex-1">
        <div className="flex items-center gap-2">
          <Title className="text-base">
            {title}
          </Title>

          {infos && (
            <Tooltip
              content={
                <div className="max-w-xs space-y-1">
                  <p className="font-medium">
                    {infos.title}
                  </p>

                  <p>
                    {infos.describe}
                  </p>
                </div>
              }
            >
              <Info
                className="size-4 text-muted-foreground"
                aria-label="More information"
              />
            </Tooltip>
          )}
        </div>

        <Text variant="muted">
          {subtitle}
        </Text>
      </div>

      {withEnable && (
        <Switch
          checked={enabled}
          onCheckedChange={onEnabledChange}
          aria-label={`Active ${title}`}
        />
      )}
    </div>
  )
}