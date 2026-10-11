
import { faker } from "@faker-js/faker"
import type { JSONContent } from "@tiptap/core"

import type { EpubChapter } from "../../types"

const IMAGE_ASSET_ID = "img-1"

function createChapter(
  position: number,
  content: JSONContent[],
): EpubChapter {
  return {
    id: faker.string.uuid(),
    title: faker.lorem.sentence(),
    position,
    content: {
      type: "doc",
      content,
    },
  }
}

/**
 * Creates a bank of six randomized chapters with different content structures.
 */
function createChapterBank(): EpubChapter[] {
  return [
    // 1. Paragraphs and text marks
    createChapter(1, [
      {
        type: "paragraph",
        content: [
          { type: "text", text: faker.lorem.words(3) + " " },
          {
            type: "text",
            text: faker.lorem.words(4),
            marks: [{ type: "bold" }],
          },
          { type: "text", text: " " + faker.lorem.words(3) },
        ],
      },
      {
        type: "paragraph",
        content: [{ type: "text", text: faker.lorem.paragraph() }],
      },
    ]),

    // 2. Headings and paragraphs
    createChapter(2, [
      {
        type: "heading",
        attrs: { level: 2 },
        content: [{ type: "text", text: faker.lorem.sentence() }],
      },
      {
        type: "paragraph",
        content: [
          {
            type: "text",
            text: faker.lorem.paragraph(),
            marks: [{ type: "italic" }],
          },
        ],
      },
    ]),

    // 3. Blockquote
    createChapter(3, [
      {
        type: "blockquote",
        content: [
          {
            type: "paragraph",
            content: [
              { type: "text", text: faker.lorem.sentence() },
            ],
          },
        ],
      },
      {
        type: "paragraph",
        content: [{ type: "text", text: faker.lorem.paragraph() }],
      },
    ]),

    // 4. Bullet list
    createChapter(4, [
      {
        type: "paragraph",
        content: [
          { type: "text", text: faker.lorem.sentence() },
        ],
      },
      {
        type: "bulletList",
        content: Array.from({ length: 3 }, () => ({
          type: "listItem",
          content: [
            {
              type: "paragraph",
              content: [
                { type: "text", text: faker.lorem.sentence() },
              ],
            },
          ],
        })),
      },
    ]),

    // 5. Ordered list
    createChapter(5, [
      {
        type: "heading",
        attrs: { level: 3 },
        content: [{ type: "text", text: faker.lorem.words(3) }],
      },
      {
        type: "orderedList",
        attrs: { start: 1 },
        content: Array.from({ length: 3 }, () => ({
          type: "listItem",
          content: [
            {
              type: "paragraph",
              content: [
                {
                  type: "text",
                  text: faker.lorem.sentence(),
                  marks: [{ type: "italic" }],
                },
              ],
            },
          ],
        })),
      },
    ]),

    // 6. Mentions and images
    createChapter(6, [
      {
        type: "paragraph",
        content: [
          { type: "text", text: faker.lorem.words(2) + " " },
          {
            type: "mention",
            attrs: {
              label: `${faker.internet.username()}`,
              id: faker.string.uuid(),
            },
          },
          { type: "text", text: " " + faker.lorem.words(3) },
        ],
      },
      {
        type: "image",
        attrs: {
          assetId: IMAGE_ASSET_ID,
          alt: faker.lorem.sentence(),
        },
      },
    ]),
  ]
}

/**
 * Returns one randomly selected chapter from a bank of six
 * freshly randomized EPUB chapters.
 *
 * The returned chapter may contain an image referencing the asset
 * whose ID is "img-1". Supply that asset when rendering the chapter.
 */
export function createRandomChapterEpub(): EpubChapter {
  const bank = createChapterBank()

  return faker.helpers.arrayElement(bank)
}
