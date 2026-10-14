import type { ExportFormat } from "@mythrart/database";
import type { ExportJobData } from "../../../validations/export.job.js";

export function toPrismaExportFormat(
  format: ExportJobData["format"],
): ExportFormat {
  switch (format) {
    case "txt":
      return "TXT";
    case "pdf":
      return "PDF";
    case "epub":
      return "EPUB";
    case "docx":
      return "DOCX";
    case "markdown":
      return "MD";
    case "webview":
      return "HTML";
  }
}