"use client"

import { Check } from "lucide-react"
import { FR, GB } from "country-flag-icons/react/3x2"

import { useAdaptiveSurface } from "@/components/hooks/useAdaptiveSurface"
import {
  HelperText,
  Text,
  Title,
} from "@/components/ui/Typography"
import { cn } from "@/lib/utils"

import type { LanguageMenuProps } from "./types"

const flags = {
  FR,
  GB,
} as const

export function LanguageMenu({
  trigger,
  availableLanguages,
  currentLocale,
  onLanguageChange,
}: LanguageMenuProps) {
  const { Surface } = useAdaptiveSurface()

  return (
    <Surface trigger={trigger}>
      <div className="w-full min-w-[220px] p-2">
        <div className="mb-2 px-2 py-1.5">
          <Title>
            Langue
          </Title>

          <HelperText>
            Choisissez votre langue
          </HelperText>
        </div>

        <div className="space-y-1">
          {availableLanguages.map((language) => {
            const isCurrent =
              language.locale.toLowerCase() ===
              currentLocale.toLowerCase()

            const Flag = flags[language.countryCode]

            return (
              <button
                key={language.locale}
                type="button"
                disabled={isCurrent}
                aria-current={isCurrent ? "true" : undefined}
                className={cn(
                  "flex min-h-10 w-full items-center gap-3",
                  "rounded-lg px-2 py-2 text-left",
                  "transition-colors duration-150",
                  "focus-visible:outline-none",
                  "focus-visible:ring-2 focus-visible:ring-primary/30",
                  !isCurrent && "cursor-pointer hover:bg-muted/50",
                  isCurrent && "cursor-default",
                )}
                onClick={() => {
                  if (!isCurrent) {
                    onLanguageChange?.(language.locale)
                  }
                }}
              >
                <Flag
                  title={language.label}
                  className="h-4 w-6 shrink-0"
                />

                <span className="min-w-0 flex-1">
                  <Text className="font-medium">
                    {language.label}
                  </Text>

                  <Text variant="muted" className="text-xs">
                    {language.code}
                  </Text>
                </span>

                {isCurrent && (
                  <Check
                    className="size-4 shrink-0 text-primary"
                    aria-hidden="true"
                  />
                )}
              </button>
            )
          })}
        </div>
      </div>
    </Surface>
  )
}