// Role: Define internal types for the Gotenberg HTTP client.

import type { PdfQuality, GeneratedPdf } from "../types.js";

export interface GotenbergClientOptions {
  baseUrl: string;
  quality: PdfQuality;
}

export interface GotenbergConvertOptions {
  html: string;
}

export type GotenbergConvertResult = GeneratedPdf;
