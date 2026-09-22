import { getServerSession } from "next-auth"
import { authOptions } from "@/lib/auth"

import { UnloggedHeader } from "@/components/ui/header/unlogged-header"
import { HeaderSwitcher } from "@/components/ui/header/switcher"

export default async function Header() {

  const session = await getServerSession(authOptions)


  const agnosticHeader = !session ? <UnloggedHeader />: (
    <HeaderSwitcher
        user={{
          id: session.user?.id ?? "<no-defined>",
          name: session.user?.name ?? "<no-defined>",
          email: session.user?.email ?? "<no-defined>",
          image: session.user?.image,
          plan: session.user?.plan ?? "free",
          subscriptionStatus: session.user?.subscriptionStatus ?? "none",
        }}
        subscription={{
          type: session.user?.plan ?? "free",
          status: session.user?.subscriptionStatus ?? "none",
        }}
    />
  )

  return agnosticHeader
}