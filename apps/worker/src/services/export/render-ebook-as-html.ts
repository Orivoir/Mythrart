import { generateHTML } from "@tiptap/html"
import { extensions } from "@mythrart/editor-extensions"
import type { NormalizedEbook } from "./normalize.js"
import type { JSONContent } from "@mythrart/editor-extensions"
import type { Extensions } from "@tiptap/core"
import escapeHTML from "escape-html"

export type RenderEbookAsHTMLOptions = {
  extensions?: Extensions
  resolveImageUrl?: (assetId: string) => Promise<string | undefined>
  coverImageUrl?: string
}

export async function renderEbookAsHTML(
  ebook: NormalizedEbook,
  {
    extensions: htmlExtensions = extensions,
    resolveImageUrl,
    coverImageUrl,
  }: RenderEbookAsHTMLOptions = {},
): Promise<string> {
  const headingId = createHeadingIdFactory()
  const addHeadingIds = (html: string): string => html.replace(
    /<h([1-6])>([\s\S]*?)<\/h\1>/g,
    (_match, level: string, content: string) => `<h${level} id="${escapeHTML(headingId(stripHtml(content)))}">${content}</h${level}>`,
  )
  const chapters: string[] = []

  for (const chapter of ebook.chapters) {
    const content = generateHTML(
      await resolveImageUrls(chapter.content as JSONContent, resolveImageUrl),
      htmlExtensions,
    )

    chapters.push(`
        <article>
          <h1 id="${escapeHTML(headingId(chapter.title))}">${escapeHTML(chapter.title)}</h1>
          ${addHeadingIds(content)}
        </article>
      `)
  }

  return `
    <article>
      ${coverImageUrl ? `<img src="${escapeHTML(coverImageUrl)}" alt="${escapeHTML(ebook.title)} cover">` : ""}
      <header>
        <h1 id="${escapeHTML(headingId(ebook.title))}">${escapeHTML(ebook.title)}</h1>
        ${ebook.subtitle ? `<p>${escapeHTML(ebook.subtitle)}</p>` : ""}
      </header>

      ${chapters.join("\n")}
    </article>
  `.trim()
}

function createHeadingIdFactory(): (value: string) => string {
  const usedIds = new Set<string>()

  return (value: string): string => {
    const base = value
      .toLowerCase()
      .trim()
      .replace(/[^a-z0-9]+/g, "-")
      .replace(/^-|-$/g, "") || "section"
    let id = base
    let suffix = 2

    while (usedIds.has(id)) {
      id = `${base}-${suffix++}`
    }

    usedIds.add(id)
    return id
  }
}

function stripHtml(value: string): string {
  return value.replace(/<[^>]+>/g, "")
}

async function resolveImageUrls(
  content: JSONContent,
  resolveImageUrl?: RenderEbookAsHTMLOptions["resolveImageUrl"],
): Promise<JSONContent> {
  const attrs = { ...content.attrs }

  if (content.type === "image" && typeof attrs.assetId === "string" && resolveImageUrl) {
    const url = await resolveImageUrl(attrs.assetId)

    if (!url) {
      throw new Error(`Unable to resolve image asset ${attrs.assetId}`)
    }

    attrs.src = url
  }

  return {
    ...content,
    attrs,
    content: content.content
      ? await Promise.all(content.content.map((child) => resolveImageUrls(child, resolveImageUrl)))
      : undefined,
  }
}