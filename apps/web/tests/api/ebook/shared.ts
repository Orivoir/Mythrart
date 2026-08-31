import { NextRequest } from "next/server"

import { createUserFixture } from "../../helpers/factories"
import resetDb from "../../helpers/reset-db"

export async function setupEbookFixture() {
    await resetDb()
    return createUserFixture()
}

export async function teardownEbookFixture() {
    await resetDb()
}

export function authorizedRequest(url: string, userId: string, init?: {
    method?: "GET" | "POST" | "PUT" | "DELETE"
    body?: unknown
}): NextRequest {
    const method = init?.method ?? "GET"
    const hasBody = init?.body !== undefined

    return new NextRequest(url, {
        method,
        headers: {
            ...(hasBody ? { "content-type": "application/json" } : {}),
            "x-auth-user-id": userId,
        },
        ...(hasBody ? { body: JSON.stringify(init.body) } : {}),
    })
}
