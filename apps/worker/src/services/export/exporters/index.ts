import { ExportJobData } from "../../../validations"
import mapExportFormat from "../utils/map-export-format"
import normalizeExportData, {
  type ExportSource,
} from "./../utils/normalize.js";
import { loadSnapshotSource } from "./../snapshot-source.js";
import { loadRequirements } from "../../utils.js";

export default async function createExportedFile({
  ebookId,
  format,
  locale,
  snapshotId
}: ExportJobData) {
  const source: ExportSource = snapshotId
    ? await loadSnapshotSource(ebookId, snapshotId)
    : await loadRequirements(
      ebookId,
      "with-content-assets",
      locale,
    );
  
  const normalized = normalizeExportData(source, locale);

  const createExporter = mapExportFormat(format);
  const exporter = createExporter();

  // create the export file using the exporter
  const exportedFile = await exporter.export(normalized);
  
  return exportedFile;
}


export {EpubExporter} from "./epub.exporter"
export {WebviewExporter} from "./webview.exporter"
export {PdfExporter} from "./pdf.exporter"
export {TxtExporter} from "./txt.exporter"
export {DocxExporter} from "./docx.exporter"
// export {MarkdownExporter} from "./markdown.exporter"