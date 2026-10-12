export function createChapterHref(chapterId: string): string {
  return `chapters/${encodeURIComponent(chapterId)}.xhtml`
}
