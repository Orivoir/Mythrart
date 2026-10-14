import type { Extensions } from "@tiptap/core";

import type { ExportJobData } from "../../../validations/export.job.js";
import type { EbookExporter } from "../exporters/types.js";

import {
  DocxExporter,
  EpubExporter,
  WebviewExporter,
  PdfExporter,
  TxtExporter,
} from "../exporters/index.js";

export type ExportJobDataFormat = ExportJobData["format"];

export type EbookExporterFactory = (
  htmlExtensions?: Extensions,
) => EbookExporter;

const exporters: Record<ExportJobDataFormat, EbookExporterFactory> = {
  docx: (extensions) => new DocxExporter(extensions),
  epub: (extensions) => new EpubExporter(extensions),
  webview: (extensions) => new WebviewExporter(extensions),
  pdf: (extensions) => new PdfExporter("readable", extensions),
  txt: (extensions) => new TxtExporter(extensions),
  markdown: (extensions) => new TxtExporter(extensions), // Currently markdown is not implemented
};

export default function mapExportFormat(
  format: ExportJobDataFormat,
): EbookExporterFactory {
  const factory = exporters[format];

  if (!factory) {
    throw new Error(`Unsupported export format: ${format}`);
  }

  return factory;
}
