import { LockKeyhole } from "lucide-react"
import type { LucideIcon } from "lucide-react"

import { AppLink } from "@/components/ui/app-link"
import { Button } from "@/components/ui/button"
import { Chip } from "@/components/ui/chip"
import { Switch } from "@/components/ui/switch"
import { URI_BILLING } from "@/lib/constants/client-routes"

import {useTranslations} from "next-intl"

interface FeatureItemProps {
  title: string
  describe: string
  icon: LucideIcon
  isLocked: boolean
  enabled: boolean
  onChange: (enabled: boolean) => void
}

export function FeatureItem({
  title,
  describe,
  icon: Icon,
  isLocked,
  enabled,
  onChange,
}: FeatureItemProps) {

  const t = useTranslations("CreateProject.StepThree.Features")

  return (
    <div
      className={`
        flex items-center gap-3
        rounded-lg border border-border
        p-3
        ${isLocked ? "bg-soft-blue" : "bg-background"}
      `}
    >
      <div
        className="
          flex size-9 shrink-0 items-center justify-center
          rounded-sm bg-soft-blue text-primary
        "
      >
        <Icon
          className="size-5"
          aria-hidden="true"
        />
      </div>

      <div className="min-w-0 flex-1">
        <div className="flex items-center gap-2">
          <p className="text-sm font-medium text-foreground">
            {title}
          </p>

          {isLocked && (
            <Chip>
              <LockKeyhole
                className="mr-1 size-3"
                aria-hidden="true"
              />
              Premium
            </Chip>
          )}
        </div>

        <p className="text-xs leading-5 text-muted-foreground">
          {describe}
        </p>
      </div>

      {isLocked ? (
        <div className="shrink-0 text-right">
          <Button
            asChild
            variant="accent"
            size="sm"
          >
            <AppLink mutedOnHover={false} href={URI_BILLING}>
              {t("LinkFreeTrialPeriod")}
            </AppLink>
          </Button>

          <p className="mt-1 text-[11px] text-muted-foreground">
            {t("FreeTrialCTA")}
          </p>
        </div>
      ) : (
        <Switch
          checked={enabled}
          onCheckedChange={onChange}
          aria-label={`Activer ${title}`}
        />
      )}
    </div>
  )
}