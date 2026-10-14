
import { afterAll, beforeEach, expect, test, vi } from "vitest";
import { getSignedUrl } from "@mythrart/s3";
import { ExportFormat, ExportJobStatus } from "@mythrart/database";

import { GET } from "@/app/api/export/[id]/route";
import type { ExportResponseAPI } from "@/app/types/api/export";
import type { ResponseErrorAPI } from "@/app/types/api/ebook";

import prisma from "../../helpers/prisma";
import {
  setupExportFixture,
  teardownExportFixture,
  type ExportFixture,
} from "./shared";

vi.mock("@mythrart/s3", async (importOriginal) => {
  const actual = await importOriginal<typeof import("@mythrart/s3")>();

  return {
    ...actual,
    s3: {} as object,
    getSignedUrl: vi.fn(),
  };
});

let fixture: ExportFixture;

beforeEach(async () => {
  vi.restoreAllMocks();
  fixture = await setupExportFixture();
});

afterAll(async () => {
  await teardownExportFixture();
});

async function createExportRecord(options?: {
  userId?: string;
  withAsset?: boolean;
  status?: ExportJobStatus;
}) {
  const exportRecord = await prisma.exportEbook.create({
    data: {
      ebook: {
        connect: { id: fixture.ebookId },
      },
      user: {
        connect: { id: options?.userId ?? fixture.ownerId },
      },
      format: ExportFormat.PDF,
      status: options?.status ?? ExportJobStatus.COMPLETED,
      startedAt: new Date("2026-10-14T10:00:00.000Z"),
      completedAt: new Date("2026-10-14T10:01:00.000Z"),
      ...(options?.withAsset
        ? {
            asset: {
              create: {
                key: `users/${fixture.ownerId}/EXPORT/test-${Date.now()}.pdf`,
                bucket: process.env.S3_BUCKET ?? "test-bucket",
                fileName: "export.pdf",
                mimeType: "application/pdf",
                sizeBytes: 1024,
                owner: {
                  connect: { id: fixture.ownerId },
                },
              },
            },
          }
        : {}),
    },
    include: {
      asset: true,
    },
  });

  return exportRecord;
}

function createGetExportRequest(exportId: string, userId?: string) {
  return new Request(`http://localhost:3000/api/export/${exportId}`, {
    method: "GET",
    headers: {
      ...(userId ? { "x-auth-user-id": userId } : {}),
    },
  }) as Parameters<typeof GET>[0];
}

function exportRouteContext(id: string) {
  return { params: { id } };
}

test("GET /api/export/{id} with permission as ebook owner should return export", async () => {
  const exportRecord = await createExportRecord({
    withAsset: true,
  });

  vi.mocked(getSignedUrl).mockResolvedValue(
    "https://example.test/download/export.pdf",
  );

  const response = await GET(
    createGetExportRequest(exportRecord.id, fixture.ownerId),
    exportRouteContext(exportRecord.id),
  );

  const body = await response.json() as ExportResponseAPI;

  expect(response.status).toBe(200);
  expect(body.export.id).toBe(exportRecord.id);
  expect(body.export.ebookId).toBe(fixture.ebookId);
  expect(body.export.format).toBe(ExportFormat.PDF);
  expect(body.export.status).toBe(ExportJobStatus.COMPLETED);
  expect(typeof body.export.createdAt).toBe("number");

  expect(body.export.file).toMatchObject({
    id: exportRecord.asset?.id,
    fileName: "export.pdf",
    mimeType: "application/pdf",
    sizeBytes: 1024,
    downloadUrl: "https://example.test/download/export.pdf",
  });

  expect(typeof body.export.file?.createdAt).toBe("number");
  expect(getSignedUrl).toHaveBeenCalledTimes(1);
});

test("GET /api/export/{id} with permission as collaborator should return export", async () => {
  const exportRecord = await createExportRecord({
    withAsset: true,
  });

  vi.mocked(getSignedUrl).mockResolvedValue(
    "https://example.test/download/collaborator.pdf",
  );

  const response = await GET(
    createGetExportRequest(exportRecord.id, fixture.authorCollaboratorId),
    exportRouteContext(exportRecord.id),
  );

  const body = await response.json() as ExportResponseAPI;

  expect(response.status).toBe(200);
  expect(body.export.id).toBe(exportRecord.id);
  expect(body.export.ebookId).toBe(fixture.ebookId);
  expect(body.export.file?.downloadUrl).toBe(
    "https://example.test/download/collaborator.pdf",
  );
});

test("GET /api/export/{id} without permission should return 404", async () => {
  const exportRecord = await createExportRecord({
    withAsset: true,
  });

  const response = await GET(
    createGetExportRequest(exportRecord.id, fixture.outsiderId),
    exportRouteContext(exportRecord.id),
  );

  const body = await response.json() as ResponseErrorAPI;

  expect(response.status).toBe(404);
  expect(body.code).toBe("NOT_FOUND");
  expect(getSignedUrl).not.toHaveBeenCalled();
});

test("GET /api/export/{id} without authentication should return 401", async () => {
  const exportRecord = await createExportRecord();

  const response = await GET(
    createGetExportRequest(exportRecord.id),
    exportRouteContext(exportRecord.id),
  );

  const body = await response.json() as ResponseErrorAPI;

  expect(response.status).toBe(401);
  expect(body.code).toBe("UNAUTHORIZED");
});

test("GET /api/export/{id} with unknown id should return 404", async () => {
  const response = await GET(
    createGetExportRequest("export-missing", fixture.ownerId),
    exportRouteContext("export-missing"),
  );

  const body = await response.json() as ResponseErrorAPI;

  expect(response.status).toBe(404);
  expect(body.code).toBe("NOT_FOUND");
});

test("GET /api/export/{id} for a processing export without asset should return export without file", async () => {
  const exportRecord = await createExportRecord({
    status: ExportJobStatus.PROCESSING,
    withAsset: false,
  });

  const response = await GET(
    createGetExportRequest(exportRecord.id, fixture.ownerId),
    exportRouteContext(exportRecord.id),
  );

  const body = await response.json() as ExportResponseAPI;

  expect(response.status).toBe(200);
  expect(body.export.id).toBe(exportRecord.id);
  expect(body.export.status).toBe(ExportJobStatus.PROCESSING);
  expect(body.export.file).toBeUndefined();
  expect(getSignedUrl).not.toHaveBeenCalled();
});
