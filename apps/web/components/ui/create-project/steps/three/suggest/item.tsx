import { LockKeyhole } from "lucide-react"

import { AppLink } from "@/components/ui/app-link"
import { Button } from "@/components/ui/button"
import ButtonSeeDemo from "@/components/ui/button-see-demo"
import { Chip } from "@/components/ui/chip"
import { URI_BILLING } from "@/lib/constants/client-routes"
import {useTranslations} from "next-intl"

interface SuggestItemProps {
  title: string
  describe: string
  isLocked: boolean
  selected: boolean
  onSelect: () => void
  onDemo?: () => void
}

export function SuggestItem({
  title,
  describe,
  isLocked,
  selected,
  onSelect,
  onDemo,
}: SuggestItemProps) {

  const t = useTranslations("CreateProject.StepThree.Suggest")
  
  return (
    <div
      className={`
        flex items-start gap-3
        rounded-lg border border-border
        px-3 py-3
        ${
          selected
            ? "bg-soft-blue"
            : "bg-background"
        }
      `}
    >
      <Button
        type="button"
        variant="ghost"
        onClick={onSelect}
        disabled={isLocked}
        className="
          h-auto min-w-0 flex-1
          items-start justify-start
          gap-3 rounded-sm
          p-0 text-left
          hover:bg-transparent
          disabled:cursor-default
          disabled:opacity-100
        "
      >
        <span
          className={`
            mt-0.5 flex size-4 shrink-0
            items-center justify-center
            rounded-full border
            ${
              selected
                ? "border-accent"
                : "border-muted-foreground"
            }
          `}
          aria-hidden="true"
        >
          {selected && (
            <span className="size-2 rounded-full bg-accent" />
          )}
        </span>

        <span className="min-w-0">
          <span className="flex items-center gap-2">
            <span className="text-sm font-medium text-foreground">
              {title}
            </span>

            {isLocked && (
              <Chip>
                <LockKeyhole
                  className="mr-1 size-3"
                  aria-hidden="true"
                />
                Premium
              </Chip>
            )}
          </span>

          <span className="mt-0.5 block text-xs leading-5 text-muted-foreground">
            {describe}
          </span>
        </span>
      </Button>

      {isLocked && (
        <div className="flex shrink-0 items-center gap-2">
          {onDemo && (
            <ButtonSeeDemo
              onClick={onDemo}
            />
          )}

          <Button
            asChild
            variant="accent-outline"
            size="sm"
            className="hidden md:inline-flex"
          >
            <AppLink mutedOnHover={false} href={URI_BILLING}>
              {t("LinkFreeTrialPeriod")}
            </AppLink>
          </Button>
        </div>
      )}
    </div>
  )
}