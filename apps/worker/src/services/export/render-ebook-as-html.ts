import { generateHTML } from "@tiptap/html"
import { extensions } from "@mythrart/editor-extensions"
import type { NormalizedEbook } from "./normalize.js"
import type { JSONContent } from "@mythrart/editor-extensions"
import type { Extensions } from "@tiptap/core"
import escapeHTML from "escape-html"

export function renderEbookAsHTML(
  ebook: NormalizedEbook,
  htmlExtensions: Extensions = extensions,
): string {
  const chapters = ebook.chapters
    .map((chapter) => {

      const content = generateHTML(chapter.content as JSONContent, htmlExtensions)

      return `
        <article>
          <h1>${escapeHTML(chapter.title)}</h1>
          ${content}
        </article>
      `
    })
    .join("\n")

  return `
    <article>
      <header>
        <h1>${escapeHTML(ebook.title)}</h1>
        ${ebook.subtitle ? `<p>${escapeHTML(ebook.subtitle)}</p>` : ""}
      </header>

      ${chapters}
    </article>
  `.trim()
}