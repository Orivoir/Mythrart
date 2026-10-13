/**
 * Isolated PDF memory benchmark worker.
 *
 * This file is launched by create-pdf-memory-bench.test.ts.
 * Running it directly without PDF_MEMORY_MODE skips the worker test.
 *
 * Modes:
 * - stream: consume chunks without retaining them.
 * - chunks: retain all chunks in memory.
 * - buffer: retain chunks and concatenate them into one Buffer.
 *
 * Metrics describe this Node.js process, not the Gotenberg container.
 */

import { randomBytes } from "node:crypto";
import { performance } from "node:perf_hooks";
import sharp from "sharp";
import { expect, it } from "vitest";

import { createPdf } from "../../src/create-pdf.js";

type ConsumptionMode = "stream" | "chunks" | "buffer";

interface MemorySnapshot {
  rss: number;
  heapUsed: number;
  external: number;
  arrayBuffers: number;
}

interface WorkerResult {
  mode: ConsumptionMode;
  durationMs: number;
  sizeBytes: number;
  before: MemorySnapshot;
  after: MemorySnapshot;
  peak: MemorySnapshot;
  peakDelta: MemorySnapshot;
}

const mode = process.env.PDF_MEMORY_MODE;

function isConsumptionMode(value: string | undefined): value is ConsumptionMode {
  return value === "stream" || value === "chunks" || value === "buffer";
}

function readMemory(): MemorySnapshot {
  const memory = process.memoryUsage();

  return {
    rss: memory.rss,
    heapUsed: memory.heapUsed,
    external: memory.external,
    arrayBuffers: memory.arrayBuffers,
  };
}

function maxSnapshot(
  first: MemorySnapshot,
  second: MemorySnapshot,
): MemorySnapshot {
  return {
    rss: Math.max(first.rss, second.rss),
    heapUsed: Math.max(first.heapUsed, second.heapUsed),
    external: Math.max(first.external, second.external),
    arrayBuffers: Math.max(
      first.arrayBuffers,
      second.arrayBuffers,
    ),
  };
}

function subtractSnapshots(
  peak: MemorySnapshot,
  baseline: MemorySnapshot,
): MemorySnapshot {
  return {
    rss: peak.rss - baseline.rss,
    heapUsed: peak.heapUsed - baseline.heapUsed,
    external: peak.external - baseline.external,
    arrayBuffers: peak.arrayBuffers - baseline.arrayBuffers,
  };
}

function makeHtml(imageDataUri: string): string {
  const paragraphs = Array.from(
    { length: 1200 },
    (_, index) => `
      <p>
        Paragraph ${index + 1}: Mythrart PDF memory benchmark.
        This representative text measures a long document with
        repeated content, headings and pagination.
      </p>
    `,
  ).join("\n");

  return `<!doctype html>
<html lang="en">
<head>
  <meta charset="utf-8">
  <style>
    @page { size: A4; margin: 18mm; }
    body { font-family: Arial, sans-serif; font-size: 12pt; }
    h1 { page-break-before: always; }
    img { width: 100%; height: auto; }
    p { line-height: 1.5; }
  </style>
</head>
<body>
  <h1>Large PDF memory benchmark</h1>
  <img src="${imageDataUri}" alt="Large embedded benchmark image">
  ${paragraphs}
</body>
</html>`;
}

async function runWorker(
  consumptionMode: ConsumptionMode,
): Promise<WorkerResult> {
  const width = 2048;
  const height = 2048;
  const channels = 3;

  // Generate a poorly compressible image without external network access.
  const rawImage = randomBytes(width * height * channels);

  const png = await sharp(rawImage, {
    raw: {
      width,
      height,
      channels,
    },
  })
    .png()
    .toBuffer();

  rawImage.fill(0);

  const html = makeHtml(
    `data:image/png;base64,${png.toString("base64")}`,
  );

  // Release the source image before taking the baseline.
  // Explicit GC is available only when Node starts with --expose-gc.
  if (globalThis.gc) {
    globalThis.gc();
  }

  const before = readMemory();
  let peak = { ...before };

  const sampleMemory = () => {
    peak = maxSnapshot(peak, readMemory());
  };

  const sampler = setInterval(sampleMemory, 5);

  let sizeBytes = 0;
  let retainedBuffer: Buffer | undefined;
  const retainedChunks: Buffer[] = [];

  const start = performance.now();

  try {
    const pdf = await createPdf({
      html,
      gotenberg: {
        baseUrl:
          process.env.GOTENBERG_URL ?? "http://127.0.0.1:3001",
        quality: "readable",
      },
    });

    expect(pdf.mimeType).toBe("application/pdf");

    for await (const chunk of pdf.data) {
      const buffer = Buffer.isBuffer(chunk)
        ? chunk
        : Buffer.from(chunk);

      sizeBytes += buffer.length;

      if (
        consumptionMode === "chunks" ||
        consumptionMode === "buffer"
      ) {
        retainedChunks.push(buffer);
      }

      sampleMemory();
    }

    if (consumptionMode === "buffer") {
      retainedBuffer = Buffer.concat(retainedChunks);

      expect(retainedBuffer.length).toBe(sizeBytes);

      sampleMemory();
    }

    expect(sizeBytes).toBeGreaterThan(0);

    // Keep all intentionally retained objects alive until after sampling.
    if (consumptionMode === "chunks") {
      expect(
        retainedChunks.reduce((sum, chunk) => sum + chunk.length, 0),
      ).toBe(sizeBytes);
    }

    if (consumptionMode === "buffer") {
      expect(retainedBuffer?.length).toBe(sizeBytes);
    }

    sampleMemory();

    const after = readMemory();
    const durationMs = performance.now() - start;

    const result: WorkerResult = {
      mode: consumptionMode,
      durationMs,
      sizeBytes,
      before,
      after,
      peak,
      peakDelta: subtractSnapshots(peak, before),
    };

    // The parent process extracts this single machine-readable line.
    console.info(`PDF_MEMORY_RESULT=${JSON.stringify(result)}`);

    return result;
  } finally {
    clearInterval(sampler);
  }
}

if (!mode) {
  it.skip(
    "worker only: launched by create-pdf-memory-bench.test.ts",
    () => {},
  );
} else {
  it(
    "measures PDF generation memory in an isolated process",
    async () => {
      if (!isConsumptionMode(mode)) {
        throw new Error(
          `Invalid PDF_MEMORY_MODE "${mode}". ` +
            'Expected "stream", "chunks" or "buffer".',
        );
      }

      await runWorker(mode);
    },
    180_000,
  );
}
