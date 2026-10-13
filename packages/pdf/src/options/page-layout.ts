import type { PdfQuality } from "../types.js";

export function getPageLayoutOptions(
  quality: PdfQuality,
): Record<string, string> {
  if (quality === "ready-to-print") {
    return {
      preferCssPageSize: "true",
      printBackground: "true",
      marginTop: "0",
      marginBottom: "0",
      marginLeft: "0",
      marginRight: "0",
    };
  }

  return {
    preferCssPageSize: "false",
    printBackground: "true",
    paperWidth: "8.5",
    paperHeight: "11",
    marginTop: "1",
    marginBottom: "1",
    marginLeft: "1",
    marginRight: "1",
  };
}