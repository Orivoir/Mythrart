/**
 * Role: Expose the main HTML-to-PDF generation use case.
 */

import { GotenbergClient } from "./gotenberg/client.js";
import type { GotenbergConvertOptions, GotenbergClientOptions } from "./gotenberg/types.js";
import type { GeneratedPdf } from "./types.js";

export interface CreatePdfOptions extends GotenbergConvertOptions {
  gotenberg: GotenbergClientOptions;
}

/**
 * Generate a PDF from HTML using Gotenberg.
 *
 * The returned PDF data is a Node.js readable stream.
 */
export async function createPdf(
  options: CreatePdfOptions,
): Promise<GeneratedPdf> {
  const client = new GotenbergClient(options.gotenberg);

  return client.convertHtmlToPdf({
    html: options.html,
  });
}
