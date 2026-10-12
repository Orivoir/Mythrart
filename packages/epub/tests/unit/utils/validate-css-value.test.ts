import { describe, expect, it } from "vitest"
import { validateCssValue } from "./../../../utils/validate-css-value"

describe("validateCssValue", () => {
  it.each([
    ["color keyword", "red"],
    ["hex color", "#1a2b3c"],
    ["length", "12px"],
    ["percentage", "75%"],
    ["multiple values", "1px 2px 3px 4px"],
    ["CSS function", "calc(100% - 2rem)"],
    ["quoted text", '"A title: with punctuation"'],
    ["custom property reference", "var(--theme-color, rebeccapurple)"],
  ])("accepts valid CSS %s values", (_label, value) => {
    expect(validateCssValue(value, "color")).toBe(value)
  })

  it("trims surrounding whitespace before returning the value", () => {
    expect(validateCssValue("  12px  ", "margin")).toBe("12px")
  })

  it.each(["", "   ", "red; color: blue", "red{color:blue}", "<script>"])(
    "rejects empty values and values containing forbidden characters: %s",
    (value) => {
      expect(() => validateCssValue(value, "color")).toThrow(
        "Invalid CSS value for color",
      )
    },
  )

  it.each([
    "url(https://example.com/image.png)",
    "URL (https://example.com/image.png)",
    "expression(alert(1))",
    "ExPrEsSiOn (alert(1))",
  ])("rejects unsafe CSS functions: %s", (value) => {
    expect(() => validateCssValue(value, "background")).toThrow(
      "Invalid CSS value for background",
    )
  })
})
