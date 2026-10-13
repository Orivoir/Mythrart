/**
 * Role: Define errors specific to PDF generation.
 */

/**
 * Base class for errors raised by the PDF package.
 */
export class PdfError extends Error {
  override readonly name: string = "PdfError";

  constructor(message: string, options?: ErrorOptions) {
    super(message, options);
    Object.setPrototypeOf(this, new.target.prototype);
  }
}

/**
 * Raised when the input provided for PDF generation is invalid.
 */
export class PdfValidationError extends PdfError {
  override readonly name: string = "PdfValidationError";
}

/**
 * Raised when the PDF generation process fails.
 */
export class PdfGenerationError extends PdfError {
  override readonly name: string = "PdfGenerationError";
}

/**
 * Raised when the PDF rendering service fails or is unavailable.
 */
export class PdfRendererError extends PdfError {
  override readonly name: string = "PdfRendererError";
}
