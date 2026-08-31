import type { CollaboratorDeleteResponseAPI, ResponseErrorAPI } from "@/app/types/api/collaboration"
import { NextRequest, NextResponse } from "next/server"

import { getAuthenticatedUserIdFromHeaders } from "@/lib/auth"
import { HTTP_ERRORS } from "@/lib/constants/http-code"
import { ApiException, parseApiJsonObject, withApiHandler } from "@/lib/errors"
import { deleteEbookCollaborator } from "./service"

export const DELETE = withApiHandler(async (
    request: NextRequest,
    { params }: { params: Promise<{ ebookId: string }> },
): Promise<NextResponse<CollaboratorDeleteResponseAPI | ResponseErrorAPI>> => {
    const userId = getAuthenticatedUserIdFromHeaders(request.headers)

    if (!userId) {
        throw new ApiException(HTTP_ERRORS.UNAUTHORIZED)
    }

    const { ebookId } = await params
    const requestBody = await parseApiJsonObject(request)
    await deleteEbookCollaborator({
        ebookId,
        actorUserId: userId,
        payload: requestBody,
    })

    return NextResponse.json<CollaboratorDeleteResponseAPI>({ success: true })
})
