import { authOptions } from "@/lib/auth"
import { getServerSession } from "next-auth"

import Resolver from "./resolver"

export default async function TestingPage() {

  const session = await getServerSession(authOptions)

  if (!session?.user) {
    return (
      <div>
        <h1>You are not authenticated</h1>
        <p>Testing page needs a logged user</p>
        <a href="/auth/login">Login</a>
      </div>
    )
  }


  return (
    <Resolver />
  )
}