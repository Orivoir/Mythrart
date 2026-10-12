import type { JSONContent } from "@tiptap/core"
import type { EpubAsset } from "../../types"

import { EpubError } from "../../errors"
import { renderNode } from "./render-node"

/**
 * Renders all children of a node in their original order.
 *
 * @param node The TipTap node whose children are to be rendered.
 * @param assets The EPUB assets used to resolve image references.
 * @returns The concatenated XHTML fragments of all child nodes.
 */
export function renderChildren(
  node: JSONContent,
  assets: readonly EpubAsset[],
): string {
  if (node.content === undefined) {
    return ""
  }

  if (!Array.isArray(node.content)) {
    throw new EpubError(
      `Invalid content array on TipTap node: ${node.type}`,
      "UNSUPPORTED_CONTENT",
    )
  }

  return node.content.map((child) => renderNode(child, assets)).join("")
}
