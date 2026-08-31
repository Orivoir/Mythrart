import type { CustomRoleResponseAPI, ResponseErrorAPI } from "@/app/types/api/collaboration"
import { NextRequest, NextResponse } from "next/server"

import { getAuthenticatedUserIdFromHeaders } from "@/lib/auth"
import { HTTP_ERRORS } from "@/lib/constants/http-code"
import { ApiException, parseApiJsonObject, withApiHandler } from "@/lib/errors"
import { normalizeStringValue } from "@/lib/normalize-string-value"
import { prisma, CollaborationPermission } from "@mythrart/database"
import { CustomRoleUpdateSchema } from "@mythrart/validations"

import { assertCustomRolesEnabled, ensureEbookPermission, mapCustomRoleResponse } from "@/app/api/collaborations/utils"

export const PUT = withApiHandler(async (
    request: NextRequest,
    { params }: { params: Promise<{ ebookId: string }> },
): Promise<NextResponse<CustomRoleResponseAPI | ResponseErrorAPI>> => {
    const userId = getAuthenticatedUserIdFromHeaders(request.headers)

    if (!userId) {
        throw new ApiException(HTTP_ERRORS.UNAUTHORIZED)
    }

    const { ebookId } = await params

    const ebook = await ensureEbookPermission({
        ebookId,
        userId,
        permission: CollaborationPermission.ROLE_ASSIGN,
    })

    assertCustomRolesEnabled(ebook.owner.plan)

    const requestBody = await parseApiJsonObject(request)
    const parsed = CustomRoleUpdateSchema.parse({
        ...requestBody,
        name: typeof requestBody.name === "string" ? normalizeStringValue(requestBody.name) ?? "" : requestBody.name,
    })

    const updateResult = await prisma.ebookCustomRole.updateMany({
        where: {
            id: parsed.roleId,
            ebookId,
        },
        data: {
            ...(parsed.name === undefined ? {} : { name: parsed.name }),
            ...(parsed.permissions === undefined ? {} : { permissions: parsed.permissions }),
        },
    })

    if (updateResult.count === 0) {
        throw new ApiException(HTTP_ERRORS.NOT_FOUND)
    }

    const role = await prisma.ebookCustomRole.findFirst({
        where: {
            id: parsed.roleId,
            ebookId,
        },
    })

    if (!role) {
        throw new ApiException(HTTP_ERRORS.NOT_FOUND)
    }

    return NextResponse.json<CustomRoleResponseAPI>(mapCustomRoleResponse(role), { status: 200 })
})
