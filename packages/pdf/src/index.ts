/**
 * Role: Expose the public API of the PDF package.
 */

export { createPdf } from "./create-pdf.js";

export {
  PdfError,
  PdfValidationError,
  PdfGenerationError,
  PdfRendererError,
} from "./errors.js";

export type { CreatePdfOptions } from "./create-pdf.js";

export type {
  GeneratedPdf,
  PdfQuality,
} from "./types.js";
