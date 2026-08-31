import { generateHTML } from "@tiptap/html"
import { extensions } from "@mythrart/editor-extensions"
import type { NormalizedEbook } from "./normalize.js"
import type { JSONContent } from "@mythrart/editor-extensions"

export function renderEbookAsHTML(ebook: NormalizedEbook): string {
  const chapters = ebook.chapters
    .map((chapter) => {

      const content = generateHTML(chapter.content as JSONContent, extensions)

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

function escapeHTML(value: string): string {
  return value
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;")
    .replaceAll("'", "&#39;")
}