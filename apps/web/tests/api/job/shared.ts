import { NextRequest } from "next/server"

export function createJobRequest(
  jobId: string,
  userId?: string,
): NextRequest {
  const headers = new Headers()

  if (userId) {
    headers.set("x-auth-user-id", userId)
  }

  return new NextRequest(
    `http://localhost:3000/api/job/${jobId}`,
    { method: "GET", headers },
  )
}

export function jobRouteContext(id: string) {
  return {
    params: Promise.resolve({ id }),
  }
}