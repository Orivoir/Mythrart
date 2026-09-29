"use client"

import { useTranslations } from "next-intl"

import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"

interface LinkContentProps {
  url: string
  isActive: boolean
  onUrlChange: (url: string) => void
  onSubmit: () => void
  onUnsetLink: () => void
  onCancel: () => void
}

export default function LinkContent({
  url,
  isActive,
  onUrlChange,
  onSubmit,
  onUnsetLink,
  onCancel,
}: LinkContentProps) {
  const t = useTranslations("Editor.Toolbar.Link")

  return (
    <div className="w-full max-w-sm space-y-4 p-4">
      <div className="space-y-2">
        <label
          htmlFor="editor-link-url"
          className="text-sm font-medium"
        >
          {t("UrlLabel")}
        </label>

        <Input
          id="editor-link-url"
          type="url"
          value={url}
          onChange={(event) => {
            onUrlChange(event.target.value)
          }}
          placeholder={t("UrlPlaceholder")}
          onKeyDown={(event) => {
            if (event.key === "Enter") {
              event.preventDefault()
              onSubmit()
            }
          }}
        />
      </div>

      <div className="flex items-center justify-end gap-2">
        {isActive && (
          <Button
            type="button"
            variant="ghost"
            onClick={onUnsetLink}
          >
            {t("Remove")}
          </Button>
        )}

        <Button
          type="button"
          variant="ghost"
          onClick={onCancel}
        >
          {t("Cancel")}
        </Button>

        <Button
          type="button"
          onClick={onSubmit}
          disabled={!url.trim()}
        >
          {t("Apply")}
        </Button>
      </div>
    </div>
  )
}