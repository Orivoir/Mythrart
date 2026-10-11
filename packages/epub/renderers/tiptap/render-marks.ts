import type { JSONContent } from "@tiptap/core"
import { EpubError } from "../../errors"
import { escapeXml } from "../../utils/escape-xml"
import { validateHref } from "../../utils/validate-href"

type JsonMark = NonNullable<JSONContent["marks"]>[number]

/**
 * Applies TipTap marks to XML-escaped text.
 *
 * The content must already be escaped with escapeXml().
 */
export function renderMarks(
  content: string,
  marks: readonly JsonMark[] = [],
): string {
  return marks.reduceRight((result, mark) => {
    switch (mark.type) {
      case "bold":
        return `<strong>${result}</strong>`

      case "italic":
        return `<em>${result}</em>`

      case "underline":
        return `<u>${result}</u>`

      case "strike":
        return `<s>${result}</s>`

      case "code":
        return `<code>${result}</code>`

      case "link": {
        const href = validateHref(mark.attrs?.href)

        return `<a href="${escapeXml(href)}">${result}</a>`
      }

      default:
        throw new EpubError(
          `Unsupported TipTap mark: ${mark.type}`,
          "UNSUPPORTED_CONTENT",
        )
    }
  }, content)
}
