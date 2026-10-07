import { getServerSession } from "next-auth"
import { redirect } from "next/navigation"
import { authOptions } from "@/lib/auth"
import Project from "./project"

export default async function ProjectPage({params}: {
  params: Promise<{id: string}>
}) {

  const session = await getServerSession(authOptions)

  if (!session) {
    redirect("/auth/login")
  }

  const {id} = await params

  return (
    <Project id={id} />
  )

}