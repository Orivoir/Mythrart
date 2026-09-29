"use client"

import { useTranslations } from "next-intl"
import { List, ListOrdered } from "lucide-react"
import { useCurrentEditor, useEditorState } from "@tiptap/react"

import { ButtonWithIcon } from "@/components/ui/button-with-icon"

export interface ListActionProps {
  type: "ordered" | "unordered"
}

export default function ListAction({ type }: ListActionProps) {
  const { editor } = useCurrentEditor()

  const key =
    type === "unordered"
      ? "bulletList"
      : "orderedList"

  const method =
    type === "unordered"
      ? "toggleBulletList"
      : "toggleOrderedList"

  const t = useTranslations(
    `Editor.Toolbar.${
      type === "unordered"
        ? "UnorderedList"
        : "OrderedList"
    }`,
  )

  const isActive = useEditorState({
    editor,
    selector: ({ editor }) => {
      return editor?.isActive(key) ?? false
    },
  })

  const onClick = () => {
    editor?.chain().focus()[method]().run()
  }

  return (
    <ButtonWithIcon
      type="button"
      icon={type === "unordered" ? List : ListOrdered}
      iconSize="lg"
      variant={isActive ? "accent-outline" : "ghost"}
      size="default"
      aria-label={t("AriaLabel")}
      title={t("Title")}
      onClick={onClick}
    />
  )
}