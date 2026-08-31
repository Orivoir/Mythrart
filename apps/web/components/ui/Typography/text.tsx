import { cn } from "@/lib/utils"

export function Text({
  children,
  className,
  variant = "default"
}: {
  children: React.ReactNode
  className?: string
  variant?: "default" | "success" | "warning" | "muted",
}) {
  return (
    <p
      className={cn(
        "text-sm",
        className,
        variant === "success" && "text-success",
        variant === "warning" && "text-warning",
        variant === "muted" && "text-muted-foreground"
      )}
    >
      {children}
    </p>
  )
}