import { execFileSync } from "node:child_process";
import { describe, expect, it } from "vitest";

const WORKER = "tests/performance/create-pdf-memory-worker.test.ts";

const MODES = ["stream", "chunks", "buffer"] as const;

interface MemorySnapshot {
  rss: number;
  heapUsed: number;
  external: number;
  arrayBuffers: number;
}

interface WorkerResult {
  mode: string;
  durationMs: number;
  sizeBytes: number;
  before: MemorySnapshot;
  after: MemorySnapshot;
  peak: MemorySnapshot;
  peakDelta: MemorySnapshot;
}

function formatMiB(bytes: number): string {
  return `${(bytes / 1024 / 1024).toFixed(2)} MiB`;
}

function formatPercent(value: number, reference: number): string {
  if (reference === 0) return "N/A";

  const percent = ((value - reference) / reference) * 100;
  const sign = percent > 0 ? "+" : "";

  return `${sign}${percent.toFixed(1)}%`;
}

function runWorker(mode: (typeof MODES)[number]): WorkerResult {
  const output = execFileSync(
    "pnpm",
    [
      "exec",
      "vitest",
      "run",
      WORKER,
      "--reporter=dot",
      "--pool=forks",
      "--maxWorkers=1",
    ],
    {
      encoding: "utf8",
      env: {
        ...process.env,
        PDF_MEMORY_MODE: mode,
        NODE_OPTIONS: [
          process.env.NODE_OPTIONS,
          "--expose-gc",
        ]
          .filter(Boolean)
          .join(" "),
      },
      timeout: 180_000,
      maxBuffer: 10 * 1024 * 1024,
    },
  );

  const marker = "PDF_MEMORY_RESULT=";
  const line = output
    .split("\n")
    .find((entry) => entry.includes(marker));

  if (!line) {
    throw new Error(
      `Worker "${mode}" did not return a result.\n${output}`,
    );
  }

  return JSON.parse(
    line.slice(line.indexOf(marker) + marker.length),
  ) as WorkerResult;
}

function logIndividualResults(results: WorkerResult[]): void {
  console.info("\nPDF MEMORY BENCHMARK");
  console.info("====================");

  for (const result of results) {
    console.info(`\nMode: ${result.mode}`);
    console.info(`PDF size:                 ${formatMiB(result.sizeBytes)}`);
    console.info(`Duration:                 ${result.durationMs.toFixed(0)} ms`);
    console.info(`Baseline RSS:             ${formatMiB(result.before.rss)}`);
    console.info(`Peak RSS:                 ${formatMiB(result.peak.rss)}`);
    console.info(`Peak RSS increase:        ${formatMiB(result.peakDelta.rss)}`);
    console.info(`Peak heap increase:       ${formatMiB(result.peakDelta.heapUsed)}`);
    console.info(`Peak external increase:   ${formatMiB(result.peakDelta.external)}`);
    console.info(
      `Peak ArrayBuffers increase: ${formatMiB(result.peakDelta.arrayBuffers)}`,
    );
  }
}

function logComparison(results: WorkerResult[]): void {
  const stream = results.find((result) => result.mode === "stream");

  if (!stream) {
    throw new Error("Streaming result is missing.");
  }

  console.info("\nMODE COMPARISON");
  console.info("===============");
  console.info("Reference: stream");
  console.info(
    "Positive deltas mean higher values than streaming; negative means lower.",
  );

  const headers = [
    "Metric",
    "Stream",
    "Chunks",
    "Buffer",
    "Chunks vs stream",
    "Buffer vs stream",
  ];

  const rows: string[][] = [
    [
      "Duration",
      `${stream.durationMs.toFixed(0)} ms`,
      ...(["chunks", "buffer"] as const).map((mode) => {
        const result = results.find((item) => item.mode === mode)!;
        return `${result.durationMs.toFixed(0)} ms`;
      }),
      ...(["chunks", "buffer"] as const).map((mode) => {
        const result = results.find((item) => item.mode === mode)!;
        return formatPercent(result.durationMs, stream.durationMs);
      }),
    ],
    [
      "Peak RSS",
      formatMiB(stream.peak.rss),
      ...(["chunks", "buffer"] as const).map((mode) =>
        formatMiB(results.find((item) => item.mode === mode)!.peak.rss),
      ),
      ...(["chunks", "buffer"] as const).map((mode) =>
        formatPercent(
          results.find((item) => item.mode === mode)!.peak.rss,
          stream.peak.rss,
        ),
      ),
    ],
    [
      "RSS increase",
      formatMiB(stream.peakDelta.rss),
      ...(["chunks", "buffer"] as const).map((mode) =>
        formatMiB(results.find((item) => item.mode === mode)!.peakDelta.rss),
      ),
      ...(["chunks", "buffer"] as const).map((mode) =>
        formatPercent(
          results.find((item) => item.mode === mode)!.peakDelta.rss,
          stream.peakDelta.rss,
        ),
      ),
    ],
    [
      "Heap increase",
      formatMiB(stream.peakDelta.heapUsed),
      ...(["chunks", "buffer"] as const).map((mode) =>
        formatMiB(
          results.find((item) => item.mode === mode)!.peakDelta.heapUsed,
        ),
      ),
      ...(["chunks", "buffer"] as const).map((mode) =>
        formatPercent(
          results.find((item) => item.mode === mode)!.peakDelta.heapUsed,
          stream.peakDelta.heapUsed,
        ),
      ),
    ],
    [
      "External increase",
      formatMiB(stream.peakDelta.external),
      ...(["chunks", "buffer"] as const).map((mode) =>
        formatMiB(
          results.find((item) => item.mode === mode)!.peakDelta.external,
        ),
      ),
      ...(["chunks", "buffer"] as const).map((mode) =>
        formatPercent(
          results.find((item) => item.mode === mode)!.peakDelta.external,
          stream.peakDelta.external,
        ),
      ),
    ],
    [
      "ArrayBuffers increase",
      formatMiB(stream.peakDelta.arrayBuffers),
      ...(["chunks", "buffer"] as const).map((mode) =>
        formatMiB(
          results.find((item) => item.mode === mode)!.peakDelta.arrayBuffers,
        ),
      ),
      ...(["chunks", "buffer"] as const).map((mode) =>
        formatPercent(
          results.find((item) => item.mode === mode)!.peakDelta.arrayBuffers,
          stream.peakDelta.arrayBuffers,
        ),
      ),
    ],
  ];

  const widths = headers.map((header, index) =>
    Math.max(
      header.length,
      ...rows.map((row) => row[index]?.length ?? 0),
    ),
  );

  const printRow = (row: string[]) => {
    console.info(
      row.map((cell, index) => cell.padEnd(widths[index]!)).join(" | "),
    );
  };

  printRow(headers);
  console.info(widths.map((width) => "-".repeat(width)).join("-+-"));

  for (const row of rows) {
    printRow(row);
  }

  console.info("\nMEMORY SAVINGS VS BUFFER");

  const buffer = results.find((result) => result.mode === "buffer")!;

  for (const key of [
    "rss",
    "heapUsed",
    "external",
    "arrayBuffers",
  ] as const) {
    const savedBytes = buffer.peakDelta[key] - stream.peakDelta[key];

    console.info(
      `${key}: ${formatMiB(savedBytes)} ` +
        `(${formatPercent(stream.peakDelta[key], buffer.peakDelta[key])} lower)`,
    );
  }
}

describe("Isolated PDF memory benchmark", () => {
  it(
    "compares streaming, retained chunks and full buffering",
    () => {
      const results = MODES.map(runWorker);

      logIndividualResults(results);
      logComparison(results);

      for (const result of results) {
        expect(result.sizeBytes).toBeGreaterThan(0);
        expect(result.peak.rss).toBeGreaterThan(0);
      }

      const sizes = results.map((result) => result.sizeBytes);
      const minSize = Math.min(...sizes);
      const maxSize = Math.max(...sizes);

      expect(maxSize - minSize).toBeLessThan(maxSize * 0.1);
    },
    600_000,
  );
});
