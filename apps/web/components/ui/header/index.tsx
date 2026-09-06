import { getServerSession } from "next-auth"
import { authOptions } from "@/lib/auth"

import { LoggedHeader } from "@/components/ui/header/logged-header"
import { UnloggedHeader } from "@/components/ui/header/unlogged-header"


export default async function Header() {

  // Session retrieval from JWT and should provide subscription informations.
  const session = await getServerSession(authOptions)


  const agnosticHeader = !session ? <UnloggedHeader />: (
    <LoggedHeader
        user={{
          id: session.user?.email ?? "",
          name: session.user?.name ?? "",
          email: session.user?.email ?? "",
          image: session.user?.image,
        }}
    />
  )

  return agnosticHeader
}