import { useSession, type UseSessionOptions } from "next-auth/react"
import { redirect } from "next/navigation"

export type UseAuthOptions = {
  redirectTo?: string
  options?: UseSessionOptions<boolean>
}

export type UseAuthReturn = {
  session: ReturnType<typeof useSession>["data"]
  status: ReturnType<typeof useSession>["status"]
  isAuthenticated: boolean
}

export function useAuth({
  redirectTo,
  options
}: UseAuthOptions): UseAuthReturn {
  const { data: session, status } = useSession(options)
  const isAuthenticated = status === "authenticated"

  if(!isAuthenticated && redirectTo) {
    redirect(redirectTo)
  }
  return { session, status, isAuthenticated }
}