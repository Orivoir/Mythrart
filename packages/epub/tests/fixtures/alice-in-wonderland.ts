import { readFileSync } from "node:fs"
import path from "node:path"
import { fileURLToPath } from "node:url"
import { faker } from "@faker-js/faker"
import type { JSONContent } from "@tiptap/core"

import type { CreateEpubOptions, EpubAsset, EpubChapter } from "../../types"
import { epubThemeFixture } from "./epub-theme"

const imageDir = fileURLToPath(new URL("./images/", import.meta.url))

function readImageAsset(fileName: string): Uint8Array {
  return new Uint8Array(readFileSync(path.join(imageDir, fileName)))
}

const imageFiles = ["aiw-1.jpg", "aiw-2.jpg", "aiw-3.jpg", "aiw-4.jpg"]

const imageAssets: EpubAsset[] = imageFiles.map((fileName, index) => ({
  id: `aiw-${index + 1}`,
  fileName,
  mimeType: "image/jpeg",
  data: readImageAsset(fileName),
}))

const coverImage: EpubAsset = {
  id: "cover-asset-id",
  fileName: "cover.jpg",
  mimeType: "image/jpeg",
  data: readImageAsset("aiw-1.jpg"),
}

function mention(label: string): JSONContent {
  return {
    type: "mention",
    attrs: {
      label,
      id: faker.string.uuid(),
    },
  }
}

function linkText(text: string, href: string): JSONContent {
  return {
    type: "text",
    text,
    marks: [{ type: "link", attrs: { href } }],
  }
}

function textWithMarks(
  text: string,
  marks: Array<{
    type: "bold" | "italic" | "underline" | "strike" | "code"
  }> = [],
): JSONContent {
  return {
    type: "text",
    text,
    marks,
  }
}

function paragraph(...children: JSONContent[]): JSONContent {
  return {
    type: "paragraph",
    content: children,
  }
}

function chapter(
  position: number,
  title: string,
  body: JSONContent[],
  imageFile?: string,
): EpubChapter {
  const blocks: JSONContent[] = [...body]

  if (imageFile) {
    blocks.push({
      type: "image",
      attrs: {
        assetId: imageFile,
        alt: title,
      },
    })
  }

  return {
    id: faker.string.uuid(),
    title,
    position,
    content: {
      type: "doc",
      content: blocks,
    },
  }
}

const chapterTitles = [
  "Down the Rabbit-Hole",
  "The Pool of Tears",
  "A Caucus-Race and a Long Tale",
  "The Rabbit Sends in a Little Bill",
  "Advice from a Caterpillar",
  "Pig and Pepper",
  "A Mad Tea-Party",
  "The Queen's Croquet-Ground",
  "Who Stole the Tarts?",
  "The Trial",
]

const chapters: EpubChapter[] = chapterTitles.map((title, index) => {
  const opening = paragraph(
    textWithMarks(faker.lorem.words(3), [{ type: "bold" }]),
    { type: "text", text: " " },
    textWithMarks(faker.lorem.sentence(), [{ type: "italic" }]),
    { type: "text", text: " " },
    linkText("read more", "https://example.com/curiosity"),
    { type: "text", text: " " },
    mention(faker.person.firstName()),
    { type: "text", text: ` ${faker.lorem.paragraph()}` },
  )

  const second = paragraph(
    { type: "text", text: faker.lorem.paragraph() },
    { type: "text", text: " " },
    textWithMarks(faker.lorem.words(4), [{ type: "underline" }]),
    { type: "text", text: ` ${faker.lorem.paragraph()}` },
  )

  const quote = {
    type: "blockquote",
    content: [
      {
        type: "paragraph",
        content: [
          { type: "text", text: faker.lorem.sentence() },
          { type: "text", text: " " },
          textWithMarks(faker.lorem.words(2), [{ type: "strike" }]),
        ],
      },
    ],
  }

  const list = {
    type: "bulletList",
    content: Array.from({ length: 3 }, () => ({
      type: "listItem",
      content: [
        {
          type: "paragraph",
          content: [{ type: "text", text: faker.lorem.sentence() }],
        },
      ],
    })),
  }

  const blocks: JSONContent[] = [opening, second, quote, list]

  if (index % 2 === 0) {
    blocks.push(
      paragraph(
        { type: "text", text: faker.lorem.paragraph() },
        { type: "text", text: " " },
        textWithMarks(faker.lorem.words(3), [{ type: "code" }]),
      ),
    )
  }

  return chapter(
    index + 1,
    title,
    blocks,
    index < imageFiles.length ? `aiw-${index + 1}` : undefined,
  )
})

export const aliceInWonderlandFixture: CreateEpubOptions = {
  book: {
    id: faker.string.uuid(),
    title: "Alice in Wonderland",
    subtitle: "A whimsical adventure through a curious and impossible world",
    description: faker.lorem.paragraphs(2, "\n\n"),
    language: "en",
    createdAt: new Date("2024-01-01T00:00:00.000Z"),
    creator: "Lewis Carroll",
    coverImage,
    assets: imageAssets,
    contributors: [
      { name: "Lewis Carroll", role: "aut" },
      { name: faker.person.fullName(), role: "edt" },
    ],
    chapters,
  },
  theme: epubThemeFixture,
}

export default aliceInWonderlandFixture
