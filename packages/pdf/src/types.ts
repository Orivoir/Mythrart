import type { Readable } from "node:stream";

export type PdfQuality = "readable" | "ready-to-print";

export interface CreatePdfOptions {
  html: string;
  gotenbergUrl: string;
  quality?: PdfQuality;
}

export interface GeneratedPdf {
  data: Readable;
  mimeType: "application/pdf";
}