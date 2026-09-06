import { getServerSession } from "next-auth"
import { redirect } from "next/navigation"

import { Container } from "@/components/ui/layout/container"
import { authOptions } from "@/lib/auth"

export default async function DashboardPage() {
  const session = await getServerSession(authOptions)

  if (!session) {
    redirect("/auth/login")
  }

  return (
    <>
      <Container>
        {null}
      </Container>
    </>
  )
}

