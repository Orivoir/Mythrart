import type { JSONContent } from "@tiptap/core"
import { EpubError } from "../../errors"
import { escapeXml } from "../../utils/escape-xml"

/**
 * Renders a mention node as simple text in XHTML.
 *
 * @param node The TipTap mention node to render.
 * @returns The XHTML fragment generated for the mention node.
 */
export function renderMention(node: JSONContent): string {

  if (node.type !== "mention") {
    throw new EpubError(
      "Invalid TipTap mention node",
      "UNSUPPORTED_CONTENT",
    )
  }

  const label = node.attrs?.label

  if (typeof label === "string" && label.trim()) {
    return escapeXml(label)
  }

  const id = node.attrs?.id

  if (typeof id === "string" && id.trim()) {
    return escapeXml(id)
  }

  throw new EpubError(
    "Mention node has no usable label or id",
    "UNSUPPORTED_CONTENT",
  )
}