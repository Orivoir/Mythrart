import { Buffer } from "node:buffer"

import mammoth from "mammoth"
import { beforeEach, describe, expect, it, vi } from "vitest"

import { extractSynopsisText } from "./../../src/utils/extract-text.js"

const pdfMocks = vi.hoisted(() => ({
  getText: vi.fn(),
  destroy: vi.fn(),
}))

vi.mock("mammoth", () => ({
  default: {
    extractRawText: vi.fn(),
  },
}))

vi.mock("pdf-parse", () => ({
  PDFParse: class {
    getText = pdfMocks.getText
    destroy = pdfMocks.destroy
  },
}))

const DOCX_MIME_TYPE =
  "application/vnd.openxmlformats-officedocument.wordprocessingml.document"

describe("extractSynopsisText", () => {
  beforeEach(() => {
    vi.clearAllMocks()
  })

  it("extracts text from a TXT file", async () => {
    const text = "Jean Morel revient à Paris."
    const buffer = Buffer.from(text, "utf-8")

    const result = await extractSynopsisText({
      buffer,
      mimeType: "text/plain",
    })

    expect(result).toBe(text)
  })

  it("extracts text from a DOCX file", async () => {
    const buffer = Buffer.from("fake-docx")
    const extractedText = "Jean Morel revient à Paris."

    vi.mocked(mammoth.extractRawText).mockResolvedValue({
      value: extractedText,
      messages: [],
    })

    const result = await extractSynopsisText({
      buffer,
      mimeType: DOCX_MIME_TYPE,
    })

    expect(mammoth.extractRawText).toHaveBeenCalledOnce()
    expect(mammoth.extractRawText).toHaveBeenCalledWith({
      buffer,
    })

    expect(result).toBe(extractedText)
  })

  it("extracts text from a PDF file", async () => {
    const buffer = Buffer.from("fake-pdf")
    const extractedText = "Jean Morel revient à Paris."

    pdfMocks.getText.mockResolvedValue({
      text: extractedText,
    })

    pdfMocks.destroy.mockResolvedValue(undefined)

    const result = await extractSynopsisText({
      buffer,
      mimeType: "application/pdf",
    })

    expect(pdfMocks.getText).toHaveBeenCalledOnce()
    expect(pdfMocks.destroy).toHaveBeenCalledOnce()

    expect(result).toBe(extractedText)
  })

  it("throws when the MIME type is not supported", async () => {
    const buffer = Buffer.from("unsupported")

    await expect(
      extractSynopsisText({
        buffer,
        mimeType: "application/octet-stream",
      }),
    ).rejects.toThrow(
      "Unsupported synopsis file type: application/octet-stream",
    )
  })

  it("destroys the PDF parser when PDF extraction fails", async () => {
    const buffer = Buffer.from("fake-pdf")

    pdfMocks.getText.mockRejectedValue(
      new Error("PDF extraction failed"),
    )

    pdfMocks.destroy.mockResolvedValue(undefined)

    await expect(
      extractSynopsisText({
        buffer,
        mimeType: "application/pdf",
      }),
    ).rejects.toThrow("PDF extraction failed")

    expect(pdfMocks.destroy).toHaveBeenCalledOnce()
  })
})