import { Command } from "lucide-react"

export default function ShortcutIcon() {

  return (
    <div
      className="
        pointer-events-none
        absolute
        right-3
        top-1/2
        flex
        -translate-y-1/2
        items-center
        gap-0.5
        text-muted-foreground
      "
      aria-hidden="true"
    >
      <Command
        className="size-3.5"
        strokeWidth={1.8}
      />

      <span className="text-xs">
        K
      </span>
    </div>
  )
}