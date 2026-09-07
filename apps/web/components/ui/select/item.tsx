import * as SelectPrimitive from "@radix-ui/react-select"
import { Check } from "lucide-react"
import type { SelectOption } from "./types"

export interface SelectItemProps {
  option: SelectOption
}

export function SelectItem({ option }: SelectItemProps) {
  const LeftIcon = option.leftIcon
  const RightIcon = option.rightIcon

  
  
  return (
    <SelectPrimitive.Item
      value={option.value}
      disabled={option.disabled}
      className="
        relative flex w-full cursor-default select-none items-center
        rounded-sm py-2 pl-3 pr-8 text-sm outline-none
        data-[disabled]:pointer-events-none
        data-[disabled]:opacity-50
        data-[highlighted]:bg-accent
        data-[highlighted]:text-accent-foreground
      "
    >
      <span className="flex min-w-0 flex-1 items-center gap-2">
        {LeftIcon && (
          <LeftIcon
            className="size-4 shrink-0 text-muted-foreground"
            aria-hidden="true"
          />
        )}

        <SelectPrimitive.ItemText>
          {option.label}
        </SelectPrimitive.ItemText>

        {RightIcon && (
          <RightIcon
            className="ml-auto size-4 shrink-0 text-muted-foreground"
            aria-hidden="true"
          />
        )}
      </span>

      <span
        className="
          absolute right-2 flex size-4 items-center justify-center
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