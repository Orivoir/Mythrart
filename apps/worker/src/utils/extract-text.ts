import mammoth from "mammoth"
import { PDFParse } from "pdf-parse"

export interface ExtractSynopsisTextInput {
  buffer: Buffer
  mimeType: string
}

export async function extractSynopsisText({
  buffer,
  mimeType,
}: ExtractSynopsisTextInput): Promise<string> {
  switch (mimeType) {
    case "text/plain":
      return buffer.toString("utf-8")

    case "application/vnd.openxmlformats-officedocument.wordprocessingml.document": // docx
      return await extractDocxText(buffer)

    case "application/pdf":
      return await extractPdfText(buffer)

    default:
      throw new Error(
        `Unsupported synopsis file type: ${mimeType}`,
      )
  }
}

async function extractDocxText(buffer: Buffer): Promise<string> {
  const result = await mammoth.extractRawText({
    buffer,
  })

  return result.value
}

async function extractPdfText(buffer: Buffer): Promise<string> {
  const parser = new PDFParse({
    data: buffer,
  })

  try {
    const result = await parser.getText()

    return result.text
  } finally {
    await parser.destroy()
  }
}