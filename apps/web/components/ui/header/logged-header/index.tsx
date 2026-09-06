"use client"

import { useState } from "react"

import type {
  Subscription,
  User,
} from "@/components/api/types"

import { AdaptiveDrawerMenu } from "./adaptive-drawer-menu"
import { AdaptiveTopHeader } from "./adaptive-top-header"

export type LoggedHeaderProps = {
  user?: User
  subscription?: Subscription
}

/** Renders the adaptive top header alongside its companion menu, wiring the "Menu" trigger to the drawer. */
export function LoggedHeader({
  user,
  subscription,
}: LoggedHeaderProps) {
  const [menuOpen, setMenuOpen] = useState(false)

  return (
    <>
      <AdaptiveTopHeader
        user={user}
        subscription={subscription}
        onMenuClick={() => setMenuOpen(true)}
      />

      <AdaptiveDrawerMenu
        open={menuOpen}
        onOpenChange={setMenuOpen}
        userId={user?.id}
      />
    </>
  )
}