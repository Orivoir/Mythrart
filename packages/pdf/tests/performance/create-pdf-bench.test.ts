/**
 * Role: Benchmark HTML-to-PDF generation with representative HTML fixtures.
 *
 * Requirements:
 * - Gotenberg running.
 * - Gotenberg environment variables configured.
 *
 * Note:
 * The image scenario uses placeholder URLs. It benchmarks rendering with
 * external image references, but does not guarantee that those images load.
 */

import { performance } from "node:perf_hooks";
import { describe, expect, it } from "vitest";

import { createPdf } from "../../src/create-pdf.js";
import { createHtmlSkeletons } from "../fixtures/skeletons-html.js";

const GOTENBERG_URL =
  process.env.GOTENBERG_URL ?? "http://127.0.0.1:3001";

const WARMUP_ITERATIONS = 3;
const BENCHMARK_ITERATIONS = 30;

const PLACEHOLDER_IMAGE_URLS = Array.from(
  { length: 8 },
  (_, index) =>
    `https://placehold.co/600x400/png?text=Image+${index + 1}`,
);

const SCENARIOS = ["editorial", "images"] as const;

interface Measurement {
  durationMs: number;
  sizeBytes: number;
}

let fixtures: ReturnType<typeof createHtmlSkeletons> = [];

async function consumePdf(
  stream: NodeJS.ReadableStream,
): Promise<number> {
  let size = 0;

  for await (const chunk of stream) {
    size += Buffer.isBuffer(chunk)
      ? chunk.length
      : Buffer.byteLength(chunk);
  }

  return size;
}

function percentile(
  values: number[],
  percentileValue: number,
): number {
  const sorted = [...values].sort((a, b) => a - b);
  const index = Math.ceil((percentileValue / 100) * sorted.length) - 1;

  return sorted[Math.max(0, index)]!;
}

async function measureGeneration(
  html: string,
): Promise<Measurement> {
  const start = performance.now();

  const pdf = await createPdf({
    html,
    gotenberg: {
      baseUrl: GOTENBERG_URL,
      quality: "readable",
    },
  });

  expect(pdf.mimeType).toBe("application/pdf");

  const sizeBytes = await consumePdf(pdf.data);

  expect(sizeBytes).toBeGreaterThan(0);

  return {
    durationMs: performance.now() - start,
    sizeBytes,
  };
}

function reportResults(
  name: string,
  measurements: Measurement[],
  totalDurationMs: number,
): void {
  const durations = measurements.map((item) => item.durationMs);

  const average =
    durations.reduce((sum, value) => sum + value, 0) /
    durations.length;

  const averageSize =
    measurements.reduce((sum, item) => sum + item.sizeBytes, 0) /
    measurements.length;

  console.info(`\n${name}`);
  console.info("=".repeat(name.length));
  console.info(`Iterations:    ${measurements.length}`);
  console.info(`Total time:    ${(totalDurationMs / 1000).toFixed(2)} s`);
  console.info(`Average:       ${average.toFixed(2)} ms`);
  console.info(`Median:        ${percentile(durations, 50).toFixed(2)} ms`);
  console.info(`P95:           ${percentile(durations, 95).toFixed(2)} ms`);
  console.info(`Minimum:       ${Math.min(...durations).toFixed(2)} ms`);
  console.info(`Maximum:       ${Math.max(...durations).toFixed(2)} ms`);
  console.info(`Average PDF:   ${(averageSize / 1024).toFixed(2)} KiB`);
  console.info(
    `Throughput:    ${(measurements.length / (totalDurationMs / 1000)).toFixed(2)} PDFs/s`,
  );
}

describe("PDF generation performance", () => {
  it.each(SCENARIOS)(
    "benchmarks the %s fixture",
    async (scenario) => {
      fixtures = createHtmlSkeletons(PLACEHOLDER_IMAGE_URLS);

      const fixture = fixtures.find((item) => item.name === scenario);

      expect(
        fixture,
        `Fixture "${scenario}" should exist`,
      ).toBeDefined();

      for (let i = 0; i < WARMUP_ITERATIONS; i++) {
        await measureGeneration(fixture!.html);
      }

      const measurements: Measurement[] = [];
      const benchmarkStart = performance.now();

      for (let i = 0; i < BENCHMARK_ITERATIONS; i++) {
        measurements.push(await measureGeneration(fixture!.html));
      }

      const totalDurationMs = performance.now() - benchmarkStart;

      reportResults(scenario, measurements, totalDurationMs);

      expect(measurements).toHaveLength(BENCHMARK_ITERATIONS);
    },
    180_000,
  );
});
