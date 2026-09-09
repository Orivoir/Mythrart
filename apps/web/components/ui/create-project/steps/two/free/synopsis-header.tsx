import { FileText, LockKeyhole } from "lucide-react"

import { Title, Text } from "@/components/ui/Typography"
import { Chip } from "@/components/ui/chip"
import {useTranslations} from "next-intl"

export function SynopsisHeader({isLocked}: {isLocked: boolean}) {

  const t = useTranslations("CreateProject.StepTwo.Header")

  return (
    <div className="flex items-start justify-between gap-4">
      <div className="flex min-w-0 items-start gap-3">
        <div
          className="
            flex size-10 shrink-0 items-center justify-center
            rounded-sm
            bg-soft-blue
            text-accent
          "
        >
          <FileText
            className="size-5"
            aria-hidden="true"
          />
        </div>

        <div className="min-w-0 space-y-0.5">
          <div className="flex items-center gap-2">
            <Title className="text-base">
              {t("Title")}
            </Title>

            <span className="text-sm text-muted-foreground">
              {t("Complement")}
            </span>
          </div>

          <Text variant="muted">
            {t("Describe")}
          </Text>
        </div>
      </div>

      {isLocked && (
        <Chip className="flex flex-row items-center justify-center gap-1.5">
          <LockKeyhole
            className="size-3.5"
            aria-hidden="true"
          />
          {t("LockedLabel")}
        </Chip>
      )}
    </div>
  )
}