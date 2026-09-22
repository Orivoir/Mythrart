import { authOptions } from "@/lib/auth"
import { getServerSession } from "next-auth"
import ProjectWorkspace from "./project-workspace"

import type { CreateEbookResponseAPI } from "@/app/types/api/ebook"

import { ProjectProvider } from "@/components/contexts/ProjectContext"

export default async function TestingPage({
  searchParams,
}: {
  searchParams: Promise<{
    mode?: string
  }>
}) {
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

  const { mode = "free" } = await searchParams

  const response = await fetch(
    `${process.env.NEXTAUTH_URL}/api/testing-fixtures?mode=${mode}`,
    {
      headers: {
        "x-auth-user-id": session.user.id,
      },
      cache: "no-store",
    },
  )

  if (!response.ok) {
    throw new Error(
      `Unable to load testing fixture (${response.status})`,
    )
  }

  const fixture = await response.json()

  const project = fixture.ebook as CreateEbookResponseAPI

  return (
    <ProjectProvider workingIn={project}>
      <ProjectWorkspace />
    </ProjectProvider>
  )
}