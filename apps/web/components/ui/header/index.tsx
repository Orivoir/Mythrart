import { getServerSession } from "next-auth"
import { authOptions } from "@/lib/auth"

import { LoggedHeader } from "@/components/ui/header/logged-header"
import { UnloggedHeader } from "@/components/ui/header/unlogged-header"


export default async function Header() {

  const session = await getServerSession(authOptions)

  console.log(session)

  const agnosticHeader = !session ? <UnloggedHeader />: (
    <LoggedHeader
        user={{
          id: session.user?.id ?? "<no-defined>",
          name: session.user?.name ?? "<no-defined>",
          email: session.user?.email ?? "<no-defined>",
          image: session.user?.image,
        }}
        subscription={{
          type: session.user?.plan ?? "free",
          status: session.user?.subscriptionStatus ?? "none",
        }}
    />
  )

  return agnosticHeader
}