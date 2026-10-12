import { EpubError } from "../errors"

/**
 * Normalizes and validates an ISBN-13.
 * Accepts digits with optional spaces and hyphens.
 */
export function normalizeIsbn13(value: string): string {
  const isbn = value.replace(/[\s-]/g, "")

  if (!/^\d{13}$/.test(isbn)) {
    throw new EpubError(
      "ISBN must contain exactly 13 digits",
      "INVALID_METADATA",
    )
  }

  const checksum = isbn
    .slice(0, 12)
    .split("")
    .reduce(
      (sum, digit, index) => sum + Number(digit) * (index % 2 === 0 ? 1 : 3),
      0,
    )

  const expectedCheckDigit = (10 - (checksum % 10)) % 10

  if (Number(isbn[12]) !== expectedCheckDigit) {
    throw new EpubError("Invalid ISBN-13 check digit", "INVALID_METADATA")
  }

  return isbn
}
