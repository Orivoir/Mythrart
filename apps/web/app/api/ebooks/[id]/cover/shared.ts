export const DEFAULT_COVER_WIDTH = 600
export const DEFAULT_COVER_RATIO = 2 / 3 // width / height of a typical book cover
export const MIN_COVER_SIZE = 16
export const MAX_COVER_SIZE = 2000
export const COVER_SIGNED_URL_TTL_SECONDS = 60 * 60

function clamp(value: number): number {
    return Math.min(MAX_COVER_SIZE, Math.max(MIN_COVER_SIZE, Math.round(value)))
}

function parsePositiveNumber(value: string | null): number | null {
    if (value === null) return null

    const parsed = Number(value)

    return Number.isFinite(parsed) && parsed > 0 ? parsed : null
}

// Accepts "2:3", "2/3" or a decimal width/height value like "0.667".
export function parseRatio(value: string | null): number | null {
    if (!value) return null

    const [w, h] = value.split(/[:/]/)

    if (h === undefined) return parsePositiveNumber(w)

    const numerator = parsePositiveNumber(w)
    const denominator = parsePositiveNumber(h)

    return numerator && denominator ? numerator / denominator : null
}

export function resolveCoverDimensions(params: URLSearchParams): { width: number, height: number } {
    const width = parsePositiveNumber(params.get("width"))
    const height = parsePositiveNumber(params.get("height"))
    const ratio = parseRatio(params.get("ratio")) ?? DEFAULT_COVER_RATIO

    if (width && height) return { width: clamp(width), height: clamp(height) }
    if (width) return { width: clamp(width), height: clamp(width / ratio) }
    if (height) return { width: clamp(height * ratio), height: clamp(height) }

    return { width: DEFAULT_COVER_WIDTH, height: clamp(DEFAULT_COVER_WIDTH / ratio) }
}

export function buildPlaceholderCoverUrl(
  width: number,
  height: number,
  text: string,
): string {
  return `https://placehold.co/${width}x${height}/e8f1ff/3b82f6/png?text=${encodeURIComponent(text)}`
}