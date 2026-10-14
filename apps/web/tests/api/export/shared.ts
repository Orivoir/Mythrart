
import { NextRequest } from "next/server";
import { CollaborationRole } from "@mythrart/database";

import prisma from "../../helpers/prisma";
import {
  createEbookThemeFixture,
  createEbookTypeFixture,
  createUserFixture,
} from "../../helpers/factories";
import resetDb from "../../helpers/reset-db";

export type ExportFixture = {
  ownerId: string;
  authorCollaboratorId: string;
  proofreaderCollaboratorId: string;
  outsiderId: string;
  ebookId: string;
};

export async function setupExportFixture(): Promise<ExportFixture> {
  await resetDb();

  const owner = await createUserFixture();
  const authorCollaborator = await createUserFixture();
  const proofreaderCollaborator = await createUserFixture();
  const outsider = await createUserFixture();

  const ebookType = await createEbookTypeFixture();
  const ebookTheme = await createEbookThemeFixture();

  const ebook = await prisma.ebook.create({
    data: {
      ownerId: owner.id,
      title: "Export fixture ebook",
      ebookTypeId: ebookType.id,
      ebookThemeId: ebookTheme.id,
    },
  });

  await prisma.ebookCollaborator.create({
    data: {
      ebookId: ebook.id,
      userId: authorCollaborator.id,
      role: CollaborationRole.AUTHOR,
      allChaptersAccess: true,
    },
  });

  await prisma.ebookCollaborator.create({
    data: {
      ebookId: ebook.id,
      userId: proofreaderCollaborator.id,
      role: CollaborationRole.PROOFREADER,
      allChaptersAccess: true,
    },
  });

  return {
    ownerId: owner.id,
    authorCollaboratorId: authorCollaborator.id,
    proofreaderCollaboratorId: proofreaderCollaborator.id,
    outsiderId: outsider.id,
    ebookId: ebook.id,
  };
}

export async function teardownExportFixture(): Promise<void> {
  await resetDb();
}

export function createExportRequest(options: {
  userId?: string;
  body?: unknown;
  rawBody?: string;
}): NextRequest {
  const hasStructuredBody = options.body !== undefined;
  const hasRawBody = options.rawBody !== undefined;

  return new NextRequest("http://localhost:3000/api/export", {
    method: "POST",
    headers: {
      ...((hasStructuredBody || hasRawBody)
        ? { "content-type": "application/json" }
        : {}),
      ...(options.userId
        ? { "x-auth-user-id": options.userId }
        : {}),
    },
    ...(hasStructuredBody
      ? { body: JSON.stringify(options.body) }
      : options.rawBody !== undefined
        ? { body: options.rawBody }
        : {}),
  });
}
