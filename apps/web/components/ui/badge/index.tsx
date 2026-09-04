export type BadgeVariant = "full" | "reduced"

export type BadgePosition = {
  x: "start" | "end"
  y: "start" | "end"
}

export type BadgeProps = {
  count: number
  variant?: BadgeVariant
  position?: BadgePosition
}

const positionClasses = {
  "start-start": "-left-1 -top-1",
  "end-start": "-right-1 -top-1",
  "start-end": "-left-1 -bottom-1",
  "end-end": "-right-1 -bottom-1",
} as const

export function Badge({
  count,
  variant = "full",
  position = {
    x: "end",
    y: "start",
  },
}: BadgeProps) {
  if (count <= 0) {
    return null
  }

  const positionKey =
    `${position.x}-${position.y}` as keyof typeof positionClasses

  if (variant === "reduced") {
    return (
      <span
        aria-hidden="true"
        className={`
          absolute
          ${positionClasses[positionKey]}
          size-2
          rounded-full
          bg-primary
        `}
      />
    )
  }

  return (
    <span
      className={`
        absolute
        ${positionClasses[positionKey]}
        flex
        h-4
        min-w-4
        items-center
        justify-center
        rounded-full
        bg-primary
        px-1
        text-[10px]
        font-semibold
        leading-none
        text-primary-foreground
      `}
    >
      {count > 99 ? "99+" : count}
    </span>
  )
}