import type { EpubTheme } from "../types"

function validateCssValue(value: string, property: string): string {
  const trimmed = value.trim()

  if (
    !trimmed ||
    /[;{}<>]/.test(trimmed) ||
    /url\s*\(|expression\s*\(/i.test(trimmed)
  ) {
    throw new Error(`Invalid CSS value for ${property}`)
  }

  return trimmed
}

export function createThemeStylesheet(theme: EpubTheme): string {
  const backgroundColor = validateCssValue(
    theme.backgroundColor,
    "backgroundColor",
  )
  const textColor = validateCssValue(theme.textColor, "textColor")
  const textFont = validateCssValue(theme.textFont, "textFont")
  const titleFont = validateCssValue(theme.titleFont, "titleFont")
  const subtitleFont = validateCssValue(theme.subtitleFont, "subtitleFont")
  const headingColor = validateCssValue(theme.headingColor, "headingColor")
  const fontSize = validateCssValue(theme.fontSize, "fontSize")
  const lineHeight = validateCssValue(theme.lineHeight, "lineHeight")
  const paragraphSpacing = validateCssValue(
    theme.paragraphSpacing,
    "paragraphSpacing",
  )
  const headingSpacing = validateCssValue(
    theme.headingSpacing,
    "headingSpacing",
  )

  return `
/* Theme overrides */
body {
  background-color: ${backgroundColor};
  color: ${textColor};
  font-family: ${textFont};
  font-size: ${fontSize};
  line-height: ${lineHeight};
}

h1,
h2,
h3,
h4,
h5,
h6 {
  color: ${headingColor};
  margin-top: ${headingSpacing};
  margin-bottom: ${headingSpacing};
}

h1 {
  font-family: ${titleFont};
}

h2,
h3,
h4,
h5,
h6 {
  font-family: ${subtitleFont};
}

p {
  margin-bottom: ${paragraphSpacing};
}
`.trim()
}
