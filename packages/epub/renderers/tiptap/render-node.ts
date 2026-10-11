
import type { JSONContent } from "@tiptap/core"
import type { EpubAsset } from "../../types"

import { EpubError } from "../../errors"
import { escapeXml } from "../../utils/escape-xml"
import { renderImage } from "./render-image"
import { renderMarks } from "./render-marks"
import { renderChildren } from "./render-children"
import { renderMention } from "./render-mention"

/**
 * Renders a TipTap JSONContent node as XHTML.
 *
 * Supported nodes are explicitly whitelisted. Unsupported nodes throw
 * EpubError instead of being silently discarded.
 *
 * @param node The TipTap node to render.
 * @param assets The EPUB assets used to resolve image references.
 * @returns The XHTML fragment generated for the node.
 */
export function renderNode(
  node: JSONContent,
  assets: readonly EpubAsset[],
): string {
  if (!node || typeof node.type !== "string") {
    throw new EpubError(
      "Invalid TipTap node: missing node type",
      "UNSUPPORTED_CONTENT",
    )
  }

  switch (node.type) {
    case "doc":
      return renderChildren(node, assets)

    case "paragraph":
      return `<p>${renderChildren(node, assets)}</p>`

    case "heading": {
      const level = node.attrs?.level

      if (
        typeof level !== "number" ||
        !Number.isInteger(level) ||
        level < 1 ||
        level > 6
      ) {
        throw new EpubError(
          `Invalid heading level: ${String(level)}`,
          "UNSUPPORTED_CONTENT",
        )
      }

      return `<h${level}>${renderChildren(node, assets)}</h${level}>`
    }

    case "blockquote":
      return `<blockquote>${renderChildren(node, assets)}</blockquote>`

    case "bulletList":
      return `<ul>${renderChildren(node, assets)}</ul>`

    case "orderedList": {
      const start = node.attrs?.start

      if (start !== undefined && start !== null) {
        if (
          typeof start !== "number" ||
          !Number.isInteger(start) ||
          start < 1
        ) {
          throw new EpubError(
            `Invalid ordered list start: ${String(start)}`,
            "UNSUPPORTED_CONTENT",
          )
        }

        if (start !== 1) {
          return `<ol start="${start}">${renderChildren(node, assets)}</ol>`
        }
      }

      return `<ol>${renderChildren(node, assets)}</ol>`
    }

    case "listItem":
      return `<li>${renderChildren(node, assets)}</li>`

    case "horizontalRule":
      return "<hr />"

    case "hardBreak":
      return "<br />"

    case "text": {
      if (typeof node.text !== "string") {
        throw new EpubError(
          "Invalid TipTap text node: missing text content",
          "UNSUPPORTED_CONTENT",
        )
      }

      // Escape the raw text before wrapping it with XHTML marks.
      const text = escapeXml(node.text)

      return renderMarks(text, node.marks)
    }

    case "image":
      return renderImage(node, assets)
    
    case "mention":
      return renderMention(node)
    default:
      throw new EpubError(
        `Unsupported TipTap node: ${node.type}`,
        "UNSUPPORTED_CONTENT",
      )
  }
}

