export function createImageHref(fileName: string): string {
  return `images/${encodeURIComponent(fileName)}`
}