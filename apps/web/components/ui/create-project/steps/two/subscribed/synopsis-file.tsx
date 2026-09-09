import { FileText, X } from "lucide-react"

import { Button } from "@/components/ui/button"
import { Text } from "@/components/ui/Typography"

interface SynopsisFileProps {
  file: File
  onRemove?: () => void
}

export function SynopsisFile({
  file,
  onRemove,
}: SynopsisFileProps) {
  const sizeInMb = file.size / (1024 * 1024)

  const formattedSize =
    sizeInMb >= 1
      ? `${sizeInMb.toFixed(1)} Mo`
      : `${Math.max(1, Math.round(file.size / 1024))} Ko`

  return (
    <div
      className="
        flex items-center gap-3 rounded-lg border
        border-border bg-surface p-4
      "
    >
      <div
        className="
          flex size-10 shrink-0 items-center justify-center
          rounded bg-soft-blue text-accent
        "
      >
        <FileText
          className="size-5"
          aria-hidden="true"
        />
      </div>

      <div className="min-w-0 flex-1">
        <p className="truncate text-sm font-medium text-foreground">
          {file.name}
        </p>

        <Text variant="muted">
          {file.type || "Fichier"} · {formattedSize}
        </Text>
      </div>

      {onRemove && (
        <Button
          type="button"
          variant="ghost"
          size="icon"
          aria-label="Supprimer le synopsis"
          onClick={onRemove}
        >
          <X
            className="size-4"
            aria-hidden="true"
          />
        </Button>
      )}
    </div>
  )
}