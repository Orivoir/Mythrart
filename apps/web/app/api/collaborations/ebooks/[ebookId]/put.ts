import type { CollaboratorResponseAPI, ResponseErrorAPI } from "@/app/types/api/collaboration"
import { NextRequest, NextResponse } from "next/server"

import { getAuthenticatedUserIdFromHeaders } from "@/lib/auth"
import { HTTP_ERRORS } from "@/lib/constants/http-code"
import { ApiException, parseApiJsonObject, withApiHandler } from "@/lib/errors"

import { mapCollaboratorResponse } from "@/app/api/collaborations/utils"
import { updateEbookCollaborator } from "./service"

export const PUT = withApiHandler(async (
    request: NextRequest,
    { params }: { params: Promise<{ ebookId: string }> },
): Promise<NextResponse<CollaboratorResponseAPI | ResponseErrorAPI>> => {
    const userId = getAuthenticatedUserIdFromHeaders(request.headers)

    if (!userId) {
        throw new ApiException(HTTP_ERRORS.UNAUTHORIZED)
    }

    const { ebookId } = await params
    const requestBody = await parseApiJsonObject(request)
    const updatedCollaborator = await updateEbookCollaborator({
        ebookId,
        actorUserId: userId,
        payload: requestBody,
    })

    return NextResponse.json<CollaboratorResponseAPI>(mapCollaboratorResponse(updatedCollaborator), { status: 200 })
})
