import type { LucideIcon } from "lucide-react"

export interface AnalysisItemProps {
  icon: LucideIcon
  label: string
  value: number
}

export function AnalysisItem({
  icon: Icon,
  label,
  value,
}: AnalysisItemProps) {
  return (
    <div className="flex items-center gap-3">
      <Icon
        className="size-4 shrink-0 text-accent"
        aria-hidden="true"
      />

      <span className="text-sm text-foreground">
        {value} {label}
      </span>
    </div>
  )
}