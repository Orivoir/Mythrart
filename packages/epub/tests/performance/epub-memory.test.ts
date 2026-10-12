import { describe, it, expect } from "vitest"
import { createEpub } from "../../generator/create-epub"
import { aliceInWonderlandFixture } from "../fixtures/alice-in-wonderland"

type MemorySnapshot = ReturnType<typeof process.memoryUsage>

const metrics = ["rss", "heapUsed", "external", "arrayBuffers"] as const

type Metric = (typeof metrics)[number]

type MemoryValues = Pick<MemorySnapshot, Metric>

function snapshot(): MemoryValues {
  const memory = process.memoryUsage()

  return {
    rss: memory.rss,
    heapUsed: memory.heapUsed,
    external: memory.external,
    arrayBuffers: memory.arrayBuffers,
  }
}

function updatePeak(peak: MemoryValues, current: MemoryValues): MemoryValues {
  return {
    rss: Math.max(peak.rss, current.rss),
    heapUsed: Math.max(peak.heapUsed, current.heapUsed),
    external: Math.max(peak.external, current.external),
    arrayBuffers: Math.max(peak.arrayBuffers, current.arrayBuffers),
  }
}

function toMiB(bytes: number): string {
  return (bytes / 1024 / 1024).toFixed(2)
}

function printMemoryReport(baseline: MemoryValues, peak: MemoryValues): void {
  console.log("\n📊 Mythrart EPUB memory benchmark")
  console.log("Book: Alice in Wonderland")
  console.log("\nMemory usage (MiB)")
  console.table(
    Object.fromEntries(
      metrics.map((metric) => [
        metric,
        {
          baseline: toMiB(baseline[metric]),
          peak: toMiB(peak[metric]),
          delta: toMiB(Math.max(0, peak[metric] - baseline[metric])),
        },
      ]),
    ),
  )
}

describe("EPUB memory benchmark", () => {
  it("measures peak memory during EPUB generation", async () => {
    // Warmup : évite de mesurer uniquement le premier passage.
    await createEpub(aliceInWonderlandFixture)

    await new Promise((resolve) => setTimeout(resolve, 100))

    // GC facultatif, uniquement si Node a été lancé avec --expose-gc.
    const gc = (globalThis as typeof globalThis & { gc?: () => void }).gc

    gc?.()

    const baseline = snapshot()
    let peak = baseline

    // Échantillonnage pendant la génération.
    const sampler = setInterval(() => {
      peak = updatePeak(peak, snapshot())
    }, 5)

    let result: Awaited<ReturnType<typeof createEpub>>

    try {
      result = await createEpub(aliceInWonderlandFixture)
      peak = updatePeak(peak, snapshot())
    } finally {
      clearInterval(sampler)
    }

    expect(result!.data.byteLength).toBeGreaterThan(0)

    console.log(`\nEPUB size: ${toMiB(result!.data.byteLength)} MiB`)

    printMemoryReport(baseline, peak)
  }, 30_000)
})
