import type {Ebook, Asset} from "@mythrart/database"
import type {NormalizedEbook} from "./../../src/services/export/utils/normalize.js"

export interface GenerateNormalizedEbookOptions {
  ebook: Ebook,
  coverAsset: Asset,
  chartAsset: Asset,
  eyeAsset: Asset,
  chapters: { id: string, title: string, createdAt: Date }[]
}

export default function generateNormalizedEbook({ ebook, coverAsset, chartAsset, eyeAsset, chapters }: GenerateNormalizedEbookOptions): NormalizedEbook {
  return {
      id: ebook.id,
      title: ebook.title,
      subtitle: ebook.subtitle,
      shortDescription: ebook.shortDescription,
      createdAt: ebook.createdAt,
      locale: "en",
      coverImage: {
        assetId: coverAsset.id,
        key: coverAsset.key,
        bucket: coverAsset.bucket,
      },
      // Note: Include cover asset in assets array as well, to verify loadEbookAssets filters it out
      assets: [
        { id: coverAsset.id, key: coverAsset.key, bucket: coverAsset.bucket },
        { id: chartAsset.id, key: chartAsset.key, bucket: chartAsset.bucket },
        { id: eyeAsset.id, key: eyeAsset.key, bucket: eyeAsset.bucket },
      ],
      chapters: [
        {
          id: chapters[0].id,
          title: chapters[0].title,
          position: 0,
          createdAt: chapters[0].createdAt,
          content: {
            type: "doc",
            content: [
              {
                type: "heading",
                attrs: { level: 1 },
                content: [{ type: "text", text: "Chapter I: The Celestial Observatory" }],
              },
              {
                type: "paragraph",
                content: [
                  { type: "text", text: "High above the obsidian cliffs, brass astrolabes ticked in silence. " },
                  { type: "text", text: "Captain Elena Vance", marks: [{ type: "bold" }] },
                  { type: "text", text: " gazed toward the constellation of the Weaver." },
                ],
              },
              {
                type: "image",
                attrs: {
                  assetId: chartAsset.id,
                  alt: "Ancient celestial navigation chart",
                  title: "The Star Chart of the Southern Crossing",
                },
              },
              {
                type: "blockquote",
                content: [
                  {
                    type: "paragraph",
                    content: [
                      {
                        type: "text",
                        text: "The stars do not guide us; they only remind us how far we have wandered.",
                        marks: [{ type: "italic" }],
                      },
                    ],
                  },
                ],
              },
            ],
          },
        },
        {
          id: chapters[1].id,
          title: chapters[1].title,
          position: 1,
          createdAt: chapters[1].createdAt,
          content: {
            type: "doc",
            content: [
              {
                type: "heading",
                attrs: { level: 2 },
                content: [{ type: "text", text: "The Astral Currents" }],
              },
              {
                type: "paragraph",
                content: [
                  {
                    type: "text",
                    text: "With sails woven from luminous thread, the ship traversed the twilight sea.",
                  },
                ],
              },
              {
                type: "image",
                attrs: {
                  assetId: eyeAsset.id,
                  alt: "The navigator's optical telescope",
                  title: "The Navigator's Eye",
                },
              },
            ],
          },
        },
      ],
    }
}
