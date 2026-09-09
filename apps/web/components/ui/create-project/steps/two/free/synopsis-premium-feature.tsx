import { Check } from "lucide-react"

export function AnalysisFeature({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <li className="flex items-start gap-2 text-sm text-foreground">
      <Check
        className="
          mt-0.5 size-4 shrink-0
          text-accent
        "
        aria-hidden="true"
      />

      <span>{children}</span>
    </li>
  )
}