import { readFileSync } from "node:fs"
import { performance } from "node:perf_hooks"
import { describe, it } from "vitest"
import type { JSONContent } from "@tiptap/core"

import aliceInWonderlandFixture from "../fixtures/alice-in-wonderland"

import { renderChapter } from "../../renderers/chapter"
import { renderNode } from "../../renderers/tiptap/render-node"
import { renderChildren } from "../../renderers/tiptap/render-children"
import { renderImage } from "../../renderers/tiptap/render-image"
import { renderMarks } from "../../renderers/tiptap/render-marks"
import { renderMention } from "../../renderers/tiptap/render-mention"

import { createContainerXml } from "../../document/container"
import { createCoverXhtml } from "../../document/cover"
import { createLandmarks } from "../../document/landmarks"
import { createMetadataXml } from "../../document/metadata"
import { createNavigationXhtml } from "../../document/navigation"
import { createPackageDocument } from "../../document/package-document"
import { createSpine } from "../../document/spine"

import { createEpubResources } from "../../resources/assets"
import {
  getImageMediaTypeFromFileName,
  isSupportedImageMediaType,
} from "../../resources/media-types"

import { buildEpubArchive } from "../../generator/build-archive"
import { createEpub } from "../../generator/create-epub"

import { createChapterHref } from "../../utils/chapter-href"
import { escapeXml } from "../../utils/escape-xml"
import type { EpubArchiveFile } from "../../types"

const epub = aliceInWonderlandFixture
const { book } = epub

const WARMUP_ITERATIONS = 2
const DEFAULT_ITERATIONS = 20
const FULL_GENERATION_ITERATIONS = 5

interface BenchmarkResult {
  operation: string
  iterations: number
  minMs: number
  meanMs: number
  medianMs: number
  p95Ms: number
}

function findNode(
  root: JSONContent,
  predicate: (node: JSONContent) => boolean,
): JSONContent | undefined {
  if (predicate(root)) {
    return root
  }

  for (const child of root.content ?? []) {
    const found = findNode(child, predicate)

    if (found) {
      return found
    }
  }

  return undefined
}

function requireNode(
  root: JSONContent,
  predicate: (node: JSONContent) => boolean,
  description: string,
): JSONContent {
  const node = findNode(root, predicate)

  if (!node) {
    throw new Error(`Fixture missing required node: ${description}`)
  }

  return node
}

function roundMs(value: number): number {
  return Number(value.toFixed(3))
}

function percentile(values: number[], p: number): number {
  const sorted = [...values].sort((a, b) => a - b)
  const index = Math.max(0, Math.ceil(p * sorted.length) - 1)

  return sorted[index]!
}

async function measure(
  operation: string,
  callback: () => unknown | Promise<unknown>,
  iterations = DEFAULT_ITERATIONS,
): Promise<BenchmarkResult> {
  // Warm-up: avoid measuring only cold-start/JIT effects.
  for (let i = 0; i < WARMUP_ITERATIONS; i++) {
    await callback()
  }

  const durations: number[] = []

  for (let i = 0; i < iterations; i++) {
    const start = performance.now()

    await callback()

    durations.push(performance.now() - start)
  }

  const sorted = [...durations].sort((a, b) => a - b)
  const total = durations.reduce((sum, value) => sum + value, 0)

  const middle = Math.floor(sorted.length / 2)
  const median =
    sorted.length % 2 === 0
      ? (sorted[middle - 1]! + sorted[middle]!) / 2
      : sorted[middle]!

  return {
    operation,
    iterations,
    minMs: roundMs(sorted[0]!),
    meanMs: roundMs(total / durations.length),
    medianMs: roundMs(median),
    p95Ms: roundMs(percentile(durations, 0.95)),
  }
}

describe("EPUB generator — performance benchmark", () => {
  it("benchmarks renderers, documents, resources and archive generation", async () => {
    const firstChapter = [...book.chapters].sort(
      (a, b) => a.position - b.position,
    )[0]!

    const firstChapterHref = createChapterHref(firstChapter.id)

    const imageNode = requireNode(
      firstChapter.content,
      (node) => node.type === "image",
      "image node",
    )

    const mentionNode = requireNode(
      firstChapter.content,
      (node) => node.type === "mention",
      "mention node",
    )

    const markedTextNode = requireNode(
      firstChapter.content,
      (node) =>
        node.type === "text" &&
        typeof node.text === "string" &&
        Boolean(node.marks?.length),
      "marked text node",
    )

    const resources = createEpubResources(book)

    const styles = readFileSync(
      new URL("../../resources/styles.css", import.meta.url),
      "utf8",
    )

    // Prépare une archive comparable à celle produite par createEpub().
    // Cette préparation est volontairement hors du chronométrage ZIP.
    const archiveFiles: EpubArchiveFile[] = [
      {
        path: "META-INF/container.xml",
        data: createContainerXml(),
      },
      {
        path: "OEBPS/content.opf",
        data: createPackageDocument(book),
      },
      {
        path: "OEBPS/nav.xhtml",
        data: createNavigationXhtml(book),
      },
      {
        path: "OEBPS/cover.xhtml",
        data: createCoverXhtml(book),
      },
      ...[...book.chapters]
        .sort((a, b) => a.position - b.position)
        .map((chapter) => ({
          path: `OEBPS/${createChapterHref(chapter.id)}`,
          data: renderChapter(chapter, book.language, book.assets),
        })),
      ...resources.map((resource) => ({
        path: resource.path,
        data: resource.data,
      })),
      {
        path: "OEBPS/styles.css",
        data: styles,
      },
    ]

    const results: BenchmarkResult[] = []

    // ── Renderers ──────────────────────────────────────────────

    results.push(
      await measure("renderNode — document complet", () =>
        renderNode(firstChapter.content, book.assets),
      ),
    )

    results.push(
      await measure("renderChildren", () =>
        renderChildren(firstChapter.content, book.assets),
      ),
    )

    results.push(
      await measure("renderImage", () => renderImage(imageNode, book.assets)),
    )

    results.push(
      await measure("renderMarks", () =>
        renderMarks(
          escapeXml(markedTextNode.text ?? ""),
          markedTextNode.marks ?? [],
        ),
      ),
    )

    results.push(
      await measure("renderMention", () => renderMention(mentionNode)),
    )

    results.push(
      await measure("renderChapter — 1 chapitre", () =>
        renderChapter(firstChapter, book.language, book.assets),
      ),
    )

    results.push(
      await measure("renderChapter — tous les chapitres", () =>
        book.chapters.map((chapter) =>
          renderChapter(chapter, book.language, book.assets),
        ),
      ),
    )

    // ── Documents ──────────────────────────────────────────────

    results.push(
      await measure("createContainerXml", () => createContainerXml()),
    )

    results.push(
      await measure("createCoverXhtml", () => createCoverXhtml(book)),
    )

    results.push(
      await measure("createLandmarks", () =>
        createLandmarks(book, firstChapterHref),
      ),
    )

    results.push(
      await measure("createMetadataXml", () =>
        createMetadataXml(book, new Date("2026-01-01T00:00:00.000Z")),
      ),
    )

    results.push(
      await measure("createNavigationXhtml", () => createNavigationXhtml(book)),
    )

    results.push(await measure("createSpine", () => createSpine(book)))

    results.push(
      await measure("createPackageDocument", () => createPackageDocument(book)),
    )

    // ── Resources ──────────────────────────────────────────────

    results.push(
      await measure("createEpubResources", () => createEpubResources(book)),
    )

    results.push(
      await measure("isSupportedImageMediaType", () =>
        isSupportedImageMediaType("image/jpeg"),
      ),
    )

    results.push(
      await measure("getImageMediaTypeFromFileName", () =>
        getImageMediaTypeFromFileName("illustration.jpg"),
      ),
    )

    // ── ZIP ────────────────────────────────────────────────────

    results.push(
      await measure(
        "buildEpubArchive",
        () => buildEpubArchive(archiveFiles),
        FULL_GENERATION_ITERATIONS,
      ),
    )

    // ── Full pipeline ─────────────────────────────────────────

    let finalEpubSize = 0

    results.push(
      await measure(
        "createEpub — pipeline complet",
        async () => {
          const result = await createEpub(epub)
          finalEpubSize = result.data.byteLength
          return result
        },
        FULL_GENERATION_ITERATIONS,
      ),
    )

    console.log("\n📊 Mythrart EPUB benchmark")
    console.log(`Book: ${book.title}`)
    console.log(`Chapters: ${book.chapters.length}`)
    console.log(`Assets: ${resources.length}`)
    console.log(`Archive entries: ${archiveFiles.length + 1}`)
    console.log(`EPUB size: ${(finalEpubSize / 1024 / 1024).toFixed(2)} MiB`)
    console.table(results)
  }, 180_000)
})
