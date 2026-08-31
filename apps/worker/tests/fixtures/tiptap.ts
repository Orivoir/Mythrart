import { Faker, en } from "@faker-js/faker"
import type { JSONContent } from "@mythrart/editor-extensions"

const fixtureFaker = new Faker({ locale: [en] })
fixtureFaker.seed(20_260_831)

export type TipTapChapterFixture = {
  id: string
  title: string
  position: number
  content: JSONContent
}

export type TipTapAssetFixture = {
  id: string
  fileName: string
  mimeType: "image/jpeg" | "image/png"
  alt: string
  title: string
}

export type TipTapMentionEntityFixture = {
  id: string
  label: string
  role: string
}

export type TipTapEbookFixture = {
  id: string
  title: string
  subtitle: string
  chapters: readonly TipTapChapterFixture[]
  assets: readonly TipTapAssetFixture[]
  mentionEntities: readonly TipTapMentionEntityFixture[]
}

export const tipTapAssetFixtures: readonly TipTapAssetFixture[] = [
  {
    id: "asset-sunrise-landscape",
    fileName: "sunrise-landscape.jpg",
    mimeType: "image/jpeg",
    alt: "Sunrise over the opening chapter landscape",
    title: "First light",
  },
  {
    id: "asset-workshop-tools",
    fileName: "workshop-tools.png",
    mimeType: "image/png",
    alt: "Annotated tools arranged on a workshop table",
    title: "The working table",
  },
  {
    id: "asset-route-map",
    fileName: "route-map.jpg",
    mimeType: "image/jpeg",
    alt: "A route map with handwritten waypoints",
    title: "Waypoints",
  },
]

export const tipTapMentionEntityFixtures: readonly TipTapMentionEntityFixture[] = [
  { id: "person-ada-rowan", label: "Ada Rowan", role: "Research editor" },
  { id: "person-milo-chen", label: "Milo Chen", role: "Field photographer" },
  { id: "person-noor-hassan", label: "Noor Hassan", role: "Cartographer" },
]

function text(value: string, marks?: JSONContent["marks"]): JSONContent {
  return { type: "text", text: value, marks }
}

function paragraph(...content: JSONContent[]): JSONContent {
  return { type: "paragraph", content }
}

function hardBreak(): JSONContent {
  return { type: "hardBreak" }
}

function heading(level: 1 | 2 | 3, value: string): JSONContent {
  return {
    type: "heading",
    attrs: { level },
    content: [text(value)],
  }
}

function mention(entity: TipTapMentionEntityFixture): JSONContent {
  return {
    type: "mention",
    attrs: {
      id: entity.id,
      label: entity.label,
    },
  }
}

function image(asset: TipTapAssetFixture): JSONContent {
  return {
    type: "image",
    attrs: {
      assetId: asset.id,
      alt: asset.alt,
      title: asset.title,
    },
  }
}

const openingTitle = fixtureFaker.lorem.words({ min: 3, max: 5 })
const [sunriseAsset, workshopAsset, routeMapAsset] = tipTapAssetFixtures
const [ada, milo, noor] = tipTapMentionEntityFixtures
const openingContent: JSONContent = {
  type: "doc",
  content: [
    paragraph(
      text("At first light, "),
      text(fixtureFaker.location.city(), [{ type: "bold" }]),
      text(" felt less like a place than a promise. "),
      mention(ada),
      text(" called it "),
      text(fixtureFaker.lorem.sentence(), [{ type: "italic" }]),
    ),
    image(sunriseAsset),
    heading(2, "A note from the road"),
    heading(3, "Archive annotations"),
    {
      type: "blockquote",
      content: [paragraph(text(fixtureFaker.lorem.sentence()))],
    },
    paragraph(
      text("The original field notes are preserved at "),
      text("the archive", [
        { type: "bold" },
        { type: "italic" },
        {
          type: "link",
          attrs: {
            href: "https://example.test/archive/field-notes",
            target: "_blank",
            rel: "noopener noreferrer",
            class: null,
          },
        },
      ]),
      text(" for curious readers."),
    ),
    {
      type: "bulletList",
      content: [
        { type: "listItem", content: [paragraph(text(fixtureFaker.lorem.sentence()))] },
        { type: "listItem", content: [paragraph(text(fixtureFaker.lorem.sentence()))] },
        { type: "listItem", content: [paragraph(text(fixtureFaker.lorem.sentence()))] },
      ],
    },
    paragraph(
      text("The first captions were drafted with "),
      mention(milo),
      text(" during a rain-darkened afternoon."),
    ),
  ],
}

const craftTitle = fixtureFaker.lorem.words({ min: 3, max: 5 })
const craftContent: JSONContent = {
  type: "doc",
  content: [
    paragraph(
      text("This chapter begins with "),
      text("patient observation", [{ type: "underline" }]),
      text(", not the abandoned idea that speed alone creates insight.", [
        { type: "strike" },
      ]),
    ),
    {
      type: "orderedList",
      attrs: { start: 1 },
      content: [
        {
          type: "listItem",
          content: [
            paragraph(
              text("Gather "),
              text("only", [{ type: "bold" }]),
              text(" what the work requires."),
            ),
            {
              type: "bulletList",
              content: [
                { type: "listItem", content: [paragraph(text("A pencil, a ruler, and room to revise."))] },
                { type: "listItem", content: [paragraph(text("A question worth carrying forward."))] },
              ],
            },
          ],
        },
        { type: "listItem", content: [paragraph(text("Record the detail that surprises you."))] },
        { type: "listItem", content: [paragraph(text("Return after the first draft has cooled."))] },
      ],
    },
    { type: "horizontalRule" },
    heading(2, "Workshop notation"),
    {
      type: "codeBlock",
      attrs: { language: "text" },
      content: [text("observe\nrevise\nrepeat")],
    },
    paragraph(
      text("The small instruction "),
      text("keep the margin", [{ type: "code" }]),
      text(" became a useful refrain."),
    ),
    paragraph(
      text("For the final diagram, "),
      mention(noor),
      text(" checked every distance twice."),
    ),
    image(workshopAsset),
  ],
}

const journeyTitle = fixtureFaker.lorem.words({ min: 3, max: 5 })
const journeyContent: JSONContent = {
  type: "doc",
  content: [
    paragraph(
      text(fixtureFaker.lorem.sentence()),
      hardBreak(),
      text(fixtureFaker.lorem.sentence()),
      hardBreak(),
      text("By evening, the itinerary had become a story."),
    ),
    heading(2, "Three landmarks"),
    {
      type: "bulletList",
      content: [
        { type: "listItem", content: [paragraph(text(fixtureFaker.location.streetAddress()))] },
        {
          type: "listItem",
          content: [
            paragraph(text(fixtureFaker.location.city())),
            {
              type: "bulletList",
              content: [
                { type: "listItem", content: [paragraph(text("A doorway painted ochre."))] },
                { type: "listItem", content: [paragraph(text("A map marked in pencil."))] },
              ],
            },
          ],
        },
      ],
    },
    {
      type: "blockquote",
      content: [
        paragraph(
          text("Travel is an education in attention, not accumulation.", [
            { type: "italic" },
          ]),
        ),
      ],
    },
    image(routeMapAsset),
    paragraph(
      text(fixtureFaker.lorem.paragraph()),
      text(" The final route was reviewed by "),
      mention(ada),
      text(" and "),
      mention(noor),
      text(" before publication."),
    ),
  ],
}

export const tipTapChapterFixtures: readonly TipTapChapterFixture[] = [
  { id: "chapter-opening", title: openingTitle, position: 0, content: openingContent },
  { id: "chapter-craft", title: craftTitle, position: 1, content: craftContent },
  { id: "chapter-journey", title: journeyTitle, position: 2, content: journeyContent },
]

export const tipTapEbookFixture: TipTapEbookFixture = {
  id: "ebook-exporter-fixture",
  title: "The Cartographer's Notebook",
  subtitle: "Three chapters for realistic export testing",
  chapters: tipTapChapterFixtures,
  assets: tipTapAssetFixtures,
  mentionEntities: tipTapMentionEntityFixtures,
}