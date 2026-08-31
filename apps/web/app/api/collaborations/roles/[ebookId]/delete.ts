import type { CustomRoleDeleteResponseAPI, ResponseErrorAPI } from "@/app/types/api/collaboration"
import { NextRequest, NextResponse } from "next/server"

import { getAuthenticatedUserIdFromHeaders } from "@/lib/auth"
import { HTTP_ERRORS } from "@/lib/constants/http-code"
import { ApiException, parseApiJsonObject, withApiHandler } from "@/lib/errors"
import { prisma, CollaborationPermission } from "@mythrart/database"
import { CustomRoleDeleteSchema } from "@mythrart/validations"

import { assertCustomRolesEnabled, ensureEbookPermission } from "../../utils"

export const DELETE = withApiHandler(async (
    request: NextRequest,
    { params }: { params: Promise<{ ebookId: string }> },
): Promise<NextResponse<CustomRoleDeleteResponseAPI | ResponseErrorAPI>> => {
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
    const parsed = CustomRoleDeleteSchema.parse(requestBody)

    const hasAssignedCollaborators = await prisma.ebookCollaborator.findFirst({
        where: {
            ebookId,
            customRoleId: parsed.roleId,
        },
        select: {
            id: true,
        },
    })

    if (hasAssignedCollaborators) {
        throw new ApiException({
            ...HTTP_ERRORS.VALIDATION_ERROR,
            fields: {
                roleId: ["CUSTOM_ROLE_IN_USE"],
            },
        })
    }

    const deleteResult = await prisma.ebookCustomRole.deleteMany({
        where: {
            id: parsed.roleId,
            ebookId,
        },
    })

    if (deleteResult.count === 0) {
        throw new ApiException(HTTP_ERRORS.NOT_FOUND)
    }

    return NextResponse.json<CustomRoleDeleteResponseAPI>({ success: true })
})
