import { cn } from "@/lib/utils"

interface ChipProps {
  children: React.ReactNode
  className?: string
}

export function Chip({
  children,
  className,
}: ChipProps) {
  return (
    <span
      className={cn(
        "inline-flex w-fit items-center",
        "rounded-full",
        "px-3 py-1",
        "text-sm font-medium",
        "bg-accent/10",
        "text-accent",
        className
      )}
    >
      {children}
    </span>
  )
}