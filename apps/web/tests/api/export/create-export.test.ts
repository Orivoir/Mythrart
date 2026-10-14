import { afterAll, beforeEach, expect, test, vi } from "vitest";

import { POST } from "@/app/api/export/route";
import type { JobCreatedResponse } from "@/app/types/api/job";
import type { ResponseErrorAPI } from "@/app/types/api/ebook";
import * as exportQueue from "@/lib/queues/export-queue";

import {
  createExportRequest,
  setupExportFixture,
  teardownExportFixture,
  type ExportFixture,
} from "./shared";

let fixture: ExportFixture;

beforeEach(async () => {
  vi.restoreAllMocks();
  fixture = await setupExportFixture();
});

afterAll(async () => {
  await teardownExportFixture();
});

test("POST /api/export returns 202 and enqueues job for ebook owner", async () => {
  const enqueueExportJobSpy = vi
    .spyOn(exportQueue, "enqueueExportJob")
    .mockResolvedValue("job-export-owner-1");

  const response = await POST(
    createExportRequest({
      userId: fixture.ownerId,
      body: {
        ebookId: fixture.ebookId,
        format: "pdf",
        locale: "fr-FR",
      },
    }),
  );

  const body = await response.json() as JobCreatedResponse;

  expect(response.status).toBe(202);
  expect(body.jobId).toBe("job-export-owner-1");
  expect(enqueueExportJobSpy).toHaveBeenCalledTimes(1);
  expect(enqueueExportJobSpy).toHaveBeenCalledWith({
    ebookId: fixture.ebookId,
    userId: fixture.ownerId,
    format: "pdf",
    locale: "fr-FR",
    snapshotId: undefined,
  });
});

test("POST /api/export allows collaborator with EBOOK_READ permission", async () => {
  const enqueueExportJobSpy = vi
    .spyOn(exportQueue, "enqueueExportJob")
    .mockResolvedValue("job-export-collaborator-1");

  const response = await POST(
    createExportRequest({
      userId: fixture.authorCollaboratorId,
      body: {
        ebookId: fixture.ebookId,
        format: "epub",
        locale: "fr-FR",
      },
    }),
  );

  const body = await response.json() as JobCreatedResponse;

  expect(response.status).toBe(202);
  expect(body.jobId).toBe("job-export-collaborator-1");
  expect(enqueueExportJobSpy).toHaveBeenCalledWith({
    ebookId: fixture.ebookId,
    userId: fixture.authorCollaboratorId,
    format: "epub",
    locale: "fr-FR",
    snapshotId: undefined,
  });
});

test("POST /api/export denies user without access to ebook", async () => {
  const enqueueExportJobSpy = vi.spyOn(exportQueue, "enqueueExportJob");

  const response = await POST(
    createExportRequest({
      userId: fixture.outsiderId,
      body: {
        ebookId: fixture.ebookId,
        format: "pdf",
        locale: "fr-FR",
      },
    }),
  );

  const body = await response.json() as ResponseErrorAPI;

  expect(response.status).toBe(404);
  expect(body.code).toBe("NOT_FOUND");
  expect(enqueueExportJobSpy).not.toHaveBeenCalled();
});

test("POST /api/export returns UNAUTHORIZED without authentication", async () => {
  const enqueueExportJobSpy = vi.spyOn(exportQueue, "enqueueExportJob");

  const response = await POST(
    createExportRequest({
      body: {
        ebookId: fixture.ebookId,
        format: "pdf",
        locale: "fr-FR",
      },
    }),
  );

  const body = await response.json() as ResponseErrorAPI;

  expect(response.status).toBe(401);
  expect(body.code).toBe("UNAUTHORIZED");
  expect(enqueueExportJobSpy).not.toHaveBeenCalled();
});

test("POST /api/export returns INVALID_JSON for malformed body", async () => {
  const response = await POST(
    createExportRequest({
      userId: fixture.ownerId,
      rawBody: "{invalid-json",
    }),
  );

  const body = await response.json() as ResponseErrorAPI;

  expect(response.status).toBe(400);
  expect(body.code).toBe("INVALID_JSON");
});

test("POST /api/export returns VALIDATION_ERROR for non-object body", async () => {
  const response = await POST(
    createExportRequest({
      userId: fixture.ownerId,
      body: [],
    }),
  );

  const body = await response.json() as ResponseErrorAPI;

  expect(response.status).toBe(400);
  expect(body.code).toBe("VALIDATION_ERROR");
  expect(body.fields?.root).toContain("INVALID_REQUEST_BODY");
});

test("POST /api/export returns VALIDATION_ERROR when ebookId is blank", async () => {
  const response = await POST(
    createExportRequest({
      userId: fixture.ownerId,
      body: {
        ebookId: "   ",
        format: "pdf",
        locale: "fr-FR",
      },
    }),
  );

  const body = await response.json() as ResponseErrorAPI;

  expect(response.status).toBe(400);
  expect(body.code).toBe("VALIDATION_ERROR");
  expect(body.fields?.ebookId).toBeDefined();
});

test("POST /api/export returns VALIDATION_ERROR for unsupported format", async () => {
  const enqueueExportJobSpy = vi.spyOn(exportQueue, "enqueueExportJob");

  const response = await POST(
    createExportRequest({
      userId: fixture.ownerId,
      body: {
        ebookId: fixture.ebookId,
        format: "unknown",
        locale: "fr-FR",
      },
    }),
  );

  const body = await response.json() as ResponseErrorAPI;

  expect(response.status).toBe(400);
  expect(body.code).toBe("VALIDATION_ERROR");
  expect(body.fields?.format).toBeDefined();
  expect(enqueueExportJobSpy).not.toHaveBeenCalled();
});

test("POST /api/export uses authenticated userId instead of body userId", async () => {
  const enqueueExportJobSpy = vi
    .spyOn(exportQueue, "enqueueExportJob")
    .mockResolvedValue("job-export-auth-user");

  const response = await POST(
    createExportRequest({
      userId: fixture.ownerId,
      body: {
        ebookId: fixture.ebookId,
        userId: fixture.outsiderId,
        format: "pdf",
        locale: "fr-FR",
      },
    }),
  );

  expect(response.status).toBe(202);
  expect(enqueueExportJobSpy).toHaveBeenCalledWith({
    ebookId: fixture.ebookId,
    userId: fixture.ownerId,
    format: "pdf",
    locale: "fr-FR",
    snapshotId: undefined,
  });
});
