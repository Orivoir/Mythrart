"use client"

import * as SelectPrimitive from "@radix-ui/react-select"
import { ChevronDown } from "lucide-react"

import { cn } from "@/lib/utils"

import type { SelectProps } from "./types"

import { SelectItem } from "./item"

export function Select({
  options,
  value,
  defaultValue,
  onValueChange,
  placeholder = "Select...",
  disabled = false,
  name,
  required = false,
  className,
}: SelectProps) {
  const selectedOption = options.find(
    (option) => option.value === value,
  )

  const SelectedLeftIcon = selectedOption?.leftIcon
  const SelectedRightIcon = selectedOption?.rightIcon

  return (
    <SelectPrimitive.Root
      value={value}
      defaultValue={defaultValue}
      onValueChange={onValueChange}
      disabled={disabled}
      name={name}
      required={required}
    >
      <SelectPrimitive.Trigger
        className={cn(
          `
            flex h-10 w-full items-center justify-between gap-3
            rounded-md border-2 border-muted bg-surface
            px-4 py-2 text-sm text-foreground
            outline-none transition-colors
            focus:border-accent/40
            disabled:cursor-not-allowed disabled:opacity-50
          `,
          className,
        )}
        aria-label={placeholder}
      >
        <span className="flex min-w-0 flex-1 items-center gap-2">
          {SelectedLeftIcon && (
            <SelectedLeftIcon
              className="size-4 shrink-0 text-muted-foreground"
              aria-hidden="true"
            />
          )}

          <SelectPrimitive.Value placeholder={placeholder} />

          {SelectedRightIcon && (
            <SelectedRightIcon
              className="size-4 shrink-0 text-muted-foreground"
              aria-hidden="true"
            />
          )}
        </span>

        <SelectPrimitive.Icon asChild>
          <ChevronDown
            className="size-4 shrink-0 text-muted-foreground"
            aria-hidden="true"
          />
        </SelectPrimitive.Icon>
      </SelectPrimitive.Trigger>

      <SelectPrimitive.Portal>
        <SelectPrimitive.Content
          position="popper"
          sideOffset={4}
          className="
            bg-surface
            z-50 max-h-[min(320px,calc(100vh-2rem))] w-[var(--radix-select-trigger-width)]
            overflow-hidden rounded-md border bg-popover
            text-popover-foreground shadow-md
            data-[state=open]:animate-in
            data-[state=closed]:animate-out
            data-[state=closed]:fade-out-0
            data-[state=open]:fade-in-0
            data-[side=bottom]:slide-in-from-top-2
            data-[side=top]:slide-in-from-bottom-2
          "
        >
          <SelectPrimitive.Viewport className="p-1">
            {options.map((option) => (
              <SelectItem
                key={option.value}
                option={option}
              />
            ))}
          </SelectPrimitive.Viewport>
        </SelectPrimitive.Content>
      </SelectPrimitive.Portal>
    </SelectPrimitive.Root>
  )
}