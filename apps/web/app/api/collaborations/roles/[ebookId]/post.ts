import type { CustomRoleResponseAPI, ResponseErrorAPI } from "@/app/types/api/collaboration"
import { CollaborationPermission } from "@mythrart/database"
import { NextRequest, NextResponse } from "next/server"

import { getAuthenticatedUserIdFromHeaders } from "@/lib/auth"
import { HTTP_ERRORS } from "@/lib/constants/http-code"
import { ApiException, parseApiJsonObject, withApiHandler } from "@/lib/errors"
import { normalizeStringValue } from "@/lib/normalize-string-value"
import { prisma } from "@mythrart/database"
import { CustomRoleCreateSchema } from "@mythrart/validations"

import { assertCustomRolesEnabled, ensureEbookPermission, mapCustomRoleResponse } from "@/app/api/collaborations/utils"

export const POST = withApiHandler(async (
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
    const parsed = CustomRoleCreateSchema.parse({
        ...requestBody,
        name: typeof requestBody.name === "string" ? normalizeStringValue(requestBody.name) ?? "" : requestBody.name,
    })

    const customRole = await prisma.ebookCustomRole.create({
        data: {
            ebookId,
            name: parsed.name,
            permissions: parsed.permissions,
            createdByUserId: userId,
        },
    })

    return NextResponse.json<CustomRoleResponseAPI>(mapCustomRoleResponse(customRole), { status: 201 })
})
