import type { ExportFormat, ExportJobStatus } from "@mythrart/database";

export interface ExportResponseAPI {
  export: {
    id: string;
    ebookId: string;
    format: ExportFormat;
    status: ExportJobStatus;
    createdAt: number;
    startedAt: number | null;
    completedAt: number | null;
    expiresAt: number | null;
    file?: {
      id: string;
      fileName: string;
      mimeType: string;
      sizeBytes: number;
      createdAt: number;
      downloadUrl: string;
    };
  };
}
