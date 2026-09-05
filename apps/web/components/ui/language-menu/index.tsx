"use client"

import type { ReactNode } from "react"
import { Check, Globe } from "lucide-react"
import { FR, GB } from "country-flag-icons/react/3x2"

import { useAdaptiveSurface } from "@/components/hooks/useAdaptiveSurface"
import { ButtonWithIcon } from "@/components/ui/button-with-icon"
import { Chip } from "@/components/ui/chip"

export interface AvailableLanguage {
  locale: string
  label: string
  code: string
  countryCode: "FR" | "GB"
}

export interface LanguageMenuProps {
  availablesLangs: AvailableLanguage[]
  currentLocale: string

  open?: boolean
  onOpenChange?: (open: boolean) => void

  onLanguageChange?: (locale: string) => void
  trigger: ReactNode
}

const countryFlags = {
  FR,
  GB,
}

export function LanguageMenu({
  availablesLangs,
  currentLocale,
  open,
  onOpenChange,
  onLanguageChange,
  trigger,
}: LanguageMenuProps) {
  const { Surface } = useAdaptiveSurface()

  return (
    <Surface
      trigger={trigger}
      open={open}
      onOpenChange={onOpenChange}
    >
      <div className="w-full max-w-sm p-4">
        <div className="mb-4">
          <h2 className="text-sm font-semibold">
            Langue
          </h2>

          <p className="mt-1 text-xs text-muted-foreground">
            Choisissez la langue de l'application.
          </p>
        </div>

        <div className="space-y-1">
          {availablesLangs.map((language) => {
            const isCurrent =
              language.locale === currentLocale

            const Flag = countryFlags[language.countryCode]

            return (
              <ButtonWithIcon
                key={language.locale}
                type="button"
                icon={isCurrent ? Check : Globe}
                iconPosition="left"
                iconSize="md"
                variant="ghost"
                className="
                  h-auto
                  min-h-14
                  w-full
                  justify-start
                  rounded-lg
                  px-2
                  py-2
                  text-left
                "
                onClick={() => {
                  onLanguageChange?.(language.locale)
                  onOpenChange?.(false)
                }}
              >
                <span className="min-w-0 flex-1">
                  <span className="block text-sm font-medium">
                    {language.label}
                  </span>

                  <span className="mt-0.5 block text-xs text-muted-foreground">
                    {language.code}
                  </span>
                </span>

                <Flag
                  title={language.label}
                  className="h-4 w-6 shrink-0 rounded-sm object-cover"
                  aria-hidden="true"
                />

                {isCurrent && (
                  <Chip className="px-2 py-0.5 text-xs">
                    Actuel
                  </Chip>
                )}
              </ButtonWithIcon>
            )
          })}
        </div>
      </div>
    </Surface>
  )
}