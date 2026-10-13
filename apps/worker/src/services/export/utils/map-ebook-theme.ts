import type { EbookTheme } from "@mythrart/database"
import type { EpubTheme } from "@mythrart/epub"

export function mapEbookTheme(dbTheme: EbookTheme): EpubTheme {
  return {
    backgroundColor: dbTheme.backgroundColor,
    textColor: dbTheme.textColor,
    textFont: dbTheme.textFont,
    titleFont: dbTheme.titleFont,
    subtitleFont: dbTheme.subtitleFont ?? "inherit",
    headingColor: dbTheme.headingColor ?? "inherit",
    fontSize: dbTheme.fontSize ?? "1em",
    lineHeight: dbTheme.lineHeight ?? "inherit",
    paragraphSpacing: dbTheme.paragraphSpacing ?? "0",
    headingSpacing: dbTheme.headingSpacing ?? "0",
  }
}
