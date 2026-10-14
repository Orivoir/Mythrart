import {
  prisma,
  CollaborationPermission,
} from "@mythrart/database";
import { NextRequest, NextResponse } from "next/server";
import type { ExportResponseAPI } from "@/app/types/api/export";

import { getAuthenticatedUserIdFromHeaders } from "@/lib/auth";
import { hasEbookPermissionForUser } from "@/lib/authorization";
import { HTTP_ERRORS } from "@/lib/constants/http-code";
import { ApiException, withApiHandler } from "@/lib/errors";
import { s3, GetObjectCommand, getSignedUrl } from "@mythrart/s3";

export const GET = withApiHandler(
  async (
    request: NextRequest,
    { params }: { params: { id: string } },
  ): Promise<NextResponse<ExportResponseAPI | ApiException>> => {
    const userId = getAuthenticatedUserIdFromHeaders(request.headers);

    if (!userId) {
      throw new ApiException(HTTP_ERRORS.UNAUTHORIZED);
    }

    const exportId = params.id;

    const exportRecord = await prisma.exportEbook.findUnique({
      where: { id: exportId },
      include: {
        asset: {
          select: {
            id: true,
            key: true,
            bucket: true,
            fileName: true,
            mimeType: true,
            sizeBytes: true,
            createdAt: true,
          },
        },
      },
    });

    if (!exportRecord) {
      throw new ApiException(HTTP_ERRORS.NOT_FOUND);
    }

    const canViewExport = await hasEbookPermissionForUser({
      ebookId: exportRecord.ebookId,
      userId,
      permission: CollaborationPermission.EBOOK_READ,
    });

    if (!canViewExport) {
      throw new ApiException(HTTP_ERRORS.NOT_FOUND);
    }

    let file: ExportResponseAPI["export"]["file"];

    if (exportRecord.asset) {
      const asset = exportRecord.asset;

      const command = new GetObjectCommand({
        Bucket: asset.bucket,
        Key: asset.key,
        ResponseContentDisposition: `attachment; filename*=UTF-8''${encodeURIComponent(asset.fileName)}`,
      });

      const downloadUrl = await getSignedUrl(s3, command, {
        expiresIn: 60 * 15,
      });

      file = {
        id: asset.id,
        fileName: asset.fileName,
        mimeType: asset.mimeType,
        sizeBytes: asset.sizeBytes,
        createdAt: asset.createdAt.getTime(),
        downloadUrl,
      };
    }

    return NextResponse.json({
      export: {
        id: exportRecord.id,
        ebookId: exportRecord.ebookId,
        format: exportRecord.format,
        status: exportRecord.status,
        createdAt: exportRecord.createdAt.getTime(),
        startedAt: exportRecord.startedAt?.getTime() ?? null,
        completedAt: exportRecord.completedAt?.getTime() ?? null,
        expiresAt: exportRecord.expiresAt?.getTime() ?? null,
        ...(file ? { file } : {}),
      },
    });
  },
);
