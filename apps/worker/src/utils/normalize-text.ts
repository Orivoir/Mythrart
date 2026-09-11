export function normalizeSynopsisText(text: string): string {
  return text
    // Normalize line endings.
    .replace(/\r\n/g, "\n")
    .replace(/\r/g, "\n")

    // Remove null bytes and other control characters,
    // while preserving newlines and tabs.
    .replace(/[\u0000-\u0008\u000B\u000C\u000E-\u001F\u007F]/g, "")

    // Normalize non-breaking spaces.
    .replace(/\u00A0/g, " ")

    // Replace tabs with regular spaces.
    .replace(/\t/g, " ")

    // Collapse consecutive spaces.
    .replace(/[ ]{2,}/g, " ")

    // Remove spaces at the beginning and end of lines.
    .replace(/[ ]+\n/g, "\n")
    .replace(/\n[ ]+/g, "\n")

    // Collapse excessive blank lines.
    .replace(/\n{3,}/g, "\n\n")

    // Remove leading/trailing whitespace.
    .trim()
}