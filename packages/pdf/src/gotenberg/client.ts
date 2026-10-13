
/**
 * Role: Communicate with Gotenberg and expose the PDF response as a Node.js stream.
 * Role: Handle HTTP communication with the Gotenberg PDF conversion API.
 */

import { Readable } from "node:stream";
import {
  PdfGenerationError,
  PdfRendererError,
  PdfValidationError,
} from "../errors.js";
import { getPageLayoutOptions } from "../options/page-layout.js";
import { createReadyToPrintPageCss } from "../options/ready-to-print-css.js";
import type { GeneratedPdf, PdfQuality } from "../types.js";
import type {
  GotenbergClientOptions,
  GotenbergConvertOptions,
} from "./types.js";

const CONVERT_HTML_ENDPOINT = "/forms/chromium/convert/html";
const PDF_MIME_TYPE = "application/pdf";

export class GotenbergClient {
  private readonly baseUrl: string;
  private readonly quality: PdfQuality;

  constructor(options: GotenbergClientOptions) {
    this.baseUrl = options.baseUrl.replace(/\/+$/, "");
    this.quality = options.quality;
  }

  async convertHtmlToPdf(
    options: GotenbergConvertOptions,
  ): Promise<GeneratedPdf> {
    if (!options.html.trim()) {
      throw new PdfValidationError("HTML content must not be empty.");
    }

    const html =
      this.quality === "ready-to-print"
        ? createReadyToPrintPageCss(options.html)
        : options.html;

    const formData = new FormData();

    formData.append(
      "files",
      new Blob([html], { type: "text/html" }),
      "index.html",
    );

    for (const [key, value] of Object.entries(
      getPageLayoutOptions(this.quality),
    )) {
      formData.append(key, value);
    }

    let response: Response;

    try {
      response = await fetch(
        `${this.baseUrl}${CONVERT_HTML_ENDPOINT}`,
        {
          method: "POST",
          body: formData,
        },
      );
    } catch (cause) {
      throw new PdfRendererError(
        "Failed to connect to Gotenberg.",
        { cause },
      );
    }

    if (!response.ok) {
      const details = await response.text().catch(() => "");

      throw new PdfRendererError(
        `Gotenberg returned HTTP ${response.status}` +
          `${details ? `: ${details}` : ""}`,
      );
    }

    if (!response.body) {
      throw new PdfGenerationError(
        "Gotenberg returned an empty response body.",
      );
    }

    const mimeType = response.headers.get("content-type");

    if (
      mimeType &&
      !mimeType.toLowerCase().includes(PDF_MIME_TYPE)
    ) {
      throw new PdfGenerationError(
        `Gotenberg returned an unexpected content type: ${mimeType}.`,
      );
    }

    return {
      data: Readable.from(
        (async function* () {
          const reader = response.body!.getReader();

          try {
            while (true) {
              const { done, value } = await reader.read();

              if (done) break;

              yield value;
            }
          } finally {
            reader.releaseLock();
          }
        })(),
      ),
      mimeType: PDF_MIME_TYPE,
    };
  }
}
