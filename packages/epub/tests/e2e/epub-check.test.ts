
import { spawnSync } from "node:child_process"
import { mkdir, writeFile } from "node:fs/promises"
import { dirname, join, resolve } from "node:path"
import { fileURLToPath } from "node:url"

import { describe, expect, it } from "vitest"

import { createEpub } from "../../generator/create-epub"
import type { CreateEpubOptions } from "../../types"

const PACKAGE_ROOT = resolve(
  dirname(fileURLToPath(import.meta.url)),
  "../..",
)

const OUTPUT_DIR = join(PACKAGE_ROOT, "mythrart-epubcheck")

const VALIDATOR_SCRIPT = join(
  PACKAGE_ROOT,
  "tools/epubcheck/validate-epub.sh",
)

const PNG_DATA = Uint8Array.from(
  Buffer.from(
    "iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAQAAAC1HAwCAAAAC0lEQVR42mP8/x8AAwMCAO+/p1sAAAAASUVORK5CYII=",
    "base64",
  ),
)

function createTestBook(): CreateEpubOptions {
  return {
    id: "urn:uuid:12345678-1234-1234-1234-123456789abc",
    title: "Mythrart EPUBCheck",
    subtitle: "Test de conformité",
    description: "Livre généré pour tester la conformité EPUB 3.",
    language: "fr",
    createdAt: new Date("2026-01-15T10:30:00.000Z"),
    creator: "Mythrart",

    coverImage: {
      id: "cover-asset",
      fileName: "cover.png",
      mimeType: "image/png",
      data: PNG_DATA,
    },

    assets: [
      {
        id: "illustration",
        fileName: "illustration.png",
        mimeType: "image/png",
        data: PNG_DATA,
      },
    ],

    contributors: [],

    chapters: [
      {
        id: "introduction",
        title: "Introduction",
        position: 1,
        content: {
          type: "doc",
          content: [
            {
              type: "paragraph",
              content: [
                {
                  type: "text",
                  text: "Ce livre sert à vérifier la conformité EPUB.",
                },
              ],
            },
            {
              type: "image",
              attrs: {
                assetId: "illustration",
                alt: "Illustration de test",
              },
            },
          ],
        },
      },
    ],
  }
}

describe("EPUBCheck — conform to W3C EPUB 3.x standard", () => {
  it("Generate EPUB and validate it with the official EPUBCheck in Docker",
    async () => {
      // 1. Générer un véritable EPUB avec le générateur.
      const book = createTestBook()
      const result = await createEpub(book)

      expect(result.data.byteLength).toBeGreaterThan(0)
      expect(result.mimeType).toBe("application/epub+zip")
      expect(result.fileName).toMatch(/\.epub$/)

      // 2. Préparer le répertoire de sortie.
      await mkdir(OUTPUT_DIR, { recursive: true })

      const epubPath = join(OUTPUT_DIR, result.fileName)

      // 3. Écrire le fichier généré sur le disque.
      await writeFile(epubPath, result.data)

      // 4. Lancer le script de validation Docker.
      const validation = spawnSync(
        "bash",
        [VALIDATOR_SCRIPT, epubPath],
        {
          cwd: PACKAGE_ROOT,
          encoding: "utf8",
          timeout: 300_000,
          maxBuffer: 10 * 1024 * 1024,
        },
      )

      // 5. Signaler les problèmes d'exécution.
      if (validation.error) {
        throw new Error(
          `Impossible d'exécuter EPUBCheck : ${validation.error.message}`,
        )
      }

      // 6. Vérifier le résultat de la validation.
      expect(
        validation.status,
        [
          "EPUBCheck a rejeté le fichier EPUB.",
          `Code de sortie : ${validation.status}`,
          `Signal : ${validation.signal ?? "aucun"}`,
          "stdout:",
          validation.stdout ?? "",
          "stderr:",
          validation.stderr ?? "",
        ].join("\n"),
      ).toBe(0)
    },
    360_000,
  )
})
