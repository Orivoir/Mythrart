import * as SelectPrimitive from "@radix-ui/react-select"
import { Check } from "lucide-react"

import type { SelectOption } from "./types"

export interface SelectItemProps {
  option: SelectOption
}

export function SelectItem({
  option,
}: SelectItemProps) {
  const LeftIcon = option.leftIcon
  const RightIcon = option.rightIcon

  const isRich =
    !!option.image ||
    !!option.description

  return (
    <SelectPrimitive.Item
      value={option.value}
      disabled={option.disabled}
      className="
        relative flex w-full cursor-default select-none
        items-center rounded-sm px-3
        text-sm outline-none
        data-[disabled]:pointer-events-none
        data-[disabled]:opacity-50
        data-[highlighted]:bg-accent
        data-[highlighted]:text-accent-foreground
      "
    >
      <span
        className={`
          flex min-w-0 flex-1 items-center
          ${isRich ? "gap-3 py-2" : "gap-2 py-2"}
        `}
      >
        {option.image && (
          <img
            src={option.image}
            alt=""
            className="
              size-10 shrink-0 rounded-md object-cover
            "
          />
        )}

        {LeftIcon && !option.image && (
          <LeftIcon
            className="size-4 shrink-0 text-muted-foreground"
            aria-hidden="true"
          />
        )}

        <span className="min-w-0 flex-1">
          <SelectPrimitive.ItemText>
            <span className="block truncate font-medium">
              {option.label}
            </span>
          </SelectPrimitive.ItemText>

          {option.description && (
            <span className="mt-0.5 block truncate text-xs text-muted-foreground">
              {option.description}
            </span>
          )}
        </span>

        {RightIcon && (
          <RightIcon
            className="size-4 shrink-0 text-muted-foreground"
            aria-hidden="true"
          />
        )}
      </span>

      <span
        className="
          absolute right-2 flex size-4
          items-center justify-center
        "
      >
        <SelectPrimitive.ItemIndicator>
          <Check
            className="size-4"
            aria-hidden="true"
          />
        </SelectPrimitive.ItemIndicator>
      </span>
    </SelectPrimitive.Item>
  )
}