"use client"

import { useMemo, useState } from "react"
import * as DropdownMenu from "@radix-ui/react-dropdown-menu"
import { ChevronDown } from "lucide-react"
import { getCountryCallingCode } from "react-phone-number-input"
import type { Country } from "react-phone-number-input"

import { cn } from "@/lib/utils"

interface CountryOption {
  value?: Country
  label: string
  divider?: boolean
}

interface CountrySelectProps {
  name?: string
  "aria-label"?: string
  value?: Country
  onChange: (value?: Country) => void
  onFocus?: (event: React.FocusEvent<HTMLElement>) => void
  onBlur?: (event: React.FocusEvent<HTMLElement>) => void
  options: CountryOption[]
  iconComponent: React.ElementType
  tabIndex?: number
  disabled?: boolean
  readOnly?: boolean
  className?: string
}

export function CountrySelect({
  name,
  "aria-label": ariaLabel,
  value,
  onChange,
  onFocus,
  onBlur,
  options,
  iconComponent: Icon,
  tabIndex,
  disabled = false,
  readOnly = false,
  className,
}: CountrySelectProps) {
  const [open, setOpen] = useState(false)

  const selectedOption = useMemo(
    () => options.find((option) => !option.divider && option.value === value),
    [options, value],
  )

  const selectedCallingCode = value ? `+${getCountryCallingCode(value)}` : undefined

  const isDisabled = disabled || readOnly

  const handleSelect = (country: Country | undefined) => {
    onChange(country)
    setOpen(false)
  }

  return (
    <div className="mr-2">
      <input type="hidden" name={name} value={value ?? ""} />

      <DropdownMenu.Root open={open} onOpenChange={setOpen}>
        <DropdownMenu.Trigger asChild>
          <button
            type="button"
            aria-label={ariaLabel}
            onFocus={onFocus}
            onBlur={onBlur}
            disabled={isDisabled}
            tabIndex={tabIndex}
            className={cn(
              "relative inline-flex h-11 min-w-28 items-center",
              "gap-2",
              "rounded-md",
              "border border-border",
              "bg-surface",
              "px-3 pr-9",
              "transition-colors duration-150",
              "hover:bg-surface-hover",
              "disabled:cursor-not-allowed disabled:opacity-50",
              className,
            )}
          >
            <span className="flex items-center justify-center">
              {value ? (
                <Icon country={value} label={selectedOption?.label} />
              ) : (
                <span className="inline-flex h-4 w-6 items-center justify-center rounded-sm bg-muted text-[10px] text-muted-foreground">
                  --
                </span>
              )}
            </span>

            <span className="text-sm font-medium text-foreground whitespace-nowrap">
              {selectedCallingCode ?? selectedOption?.label}
            </span>

            <ChevronDown
              className={cn(
                "pointer-events-none absolute right-3 size-4 shrink-0 text-muted-foreground transition-transform duration-150",
                open && "rotate-180",
              )}
              aria-hidden="true"
            />
          </button>
        </DropdownMenu.Trigger>

        <DropdownMenu.Portal>
          <DropdownMenu.Content
            align="start"
            sideOffset={8}
            className={cn(
              "z-50",
              "max-h-80 w-[18rem] overflow-y-auto",
              "rounded-md border border-border",
              "bg-surface",
              "p-1",
              "shadow-md",
              "data-[state=open]:animate-in data-[state=closed]:animate-out",
              "data-[state=open]:fade-in-0 data-[state=closed]:fade-out-0",
              "data-[state=open]:zoom-in-95 data-[state=closed]:zoom-out-95",
            )}
          >
            {options.map((option) => {
              if (option.divider) {
                return (
                  <DropdownMenu.Separator
                    key={`separator-${option.label}`}
                    className="my-1 h-px bg-border"
                  />
                )
              }

              const optionValue = option.value
              const optionCallingCode = optionValue
                ? `+${getCountryCallingCode(optionValue)}`
                : undefined
              const isSelected = optionValue === value

              return (
                <DropdownMenu.Item
                  key={optionValue ?? "ZZ"}
                  onSelect={() => handleSelect(optionValue)}
                  className={cn(
                    "flex cursor-pointer items-center gap-3 rounded-md px-2 py-2",
                    "outline-none",
                    "transition-colors duration-150",
                    "data-highlighted:bg-accent/10",
                    isSelected && "bg-accent/10",
                  )}
                >
                  <span className="flex h-5 w-7 items-center justify-center overflow-hidden rounded-sm">
                    {optionValue ? (
                      <Icon country={optionValue} label={option.label} />
                    ) : (
                      <span className="inline-flex h-4 w-6 items-center justify-center rounded-sm bg-muted text-[10px] text-muted-foreground">
                        --
                      </span>
                    )}
                  </span>

                  <span className="min-w-12 text-sm font-medium text-foreground">
                    {optionCallingCode ?? "--"}
                  </span>

                  <span className="truncate text-sm text-foreground/85">
                    {option.label}
                  </span>
                </DropdownMenu.Item>
              )
            })}
          </DropdownMenu.Content>
        </DropdownMenu.Portal>
      </DropdownMenu.Root>
    </div>
  )
}