"use client"

import * as React from "react"

import { cn } from "@/lib/utils"

export interface TextareaProps
  extends React.ComponentProps<"textarea"> {
  maxCount?: number
}

export function Textarea({
  className,
  maxCount,
  value,
  defaultValue,
  onChange,
  ...props
}: TextareaProps) {
  const [internalValue, setInternalValue] = React.useState(
    () => String(defaultValue ?? ""),
  )

  const currentValue =
    value !== undefined
      ? String(value)
      : internalValue

  const count = currentValue.length
  const hasExceededMax =
    maxCount !== undefined && count > maxCount
  const isAtMax =
    maxCount !== undefined && count === maxCount
  const isWarning =
    maxCount !== undefined &&
    count >= maxCount * 0.9 &&
    !hasExceededMax

  const handleChange = (
    event: React.ChangeEvent<HTMLTextAreaElement>,
  ) => {
    const nextValue = event.target.value

    if (
      maxCount !== undefined &&
      nextValue.length > maxCount
    ) {
      return
    }

    if (value === undefined) {
      setInternalValue(nextValue)
    }

    onChange?.(event)
  }

  return (
    <div className="w-full">
      <textarea
        {...props}
        value={value}
        defaultValue={value === undefined ? undefined : defaultValue}
        onChange={handleChange}
        className={cn(
          `
            min-h-24
            w-full
            resize-y
            rounded-md
            border-2
            border-muted
            bg-background
            px-4
            py-2
            outline-none
            transition-colors
            focus:border-accent/40
          `,
          hasExceededMax
            ? "border-danger focus:border-danger"
            : isWarning || isAtMax
              ? "border-warning focus:border-warning"
              : null,
          className,
        )}
      />

      {maxCount !== undefined && (
        <div
          className={cn(
            "mt-1 text-right text-xs",
            hasExceededMax
              ? "text-danger"
              : isWarning || isAtMax
                ? "text-warning"
                : "text-muted-foreground",
          )}
        >
          {count}/{maxCount}
        </div>
      )}
    </div>
  )
}