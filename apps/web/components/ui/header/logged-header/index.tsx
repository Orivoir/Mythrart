"use client"

import { useState } from "react"

import { AdaptiveDrawerMenu } from "./adaptive-drawer-menu"
import { AdaptiveTopHeader } from "./adaptive-top-header"

/** Renders the adaptive top header alongside its companion menu, wiring the "Menu" trigger to the drawer. */
export function LoggedHeader() {
  const [menuOpen, setMenuOpen] = useState(false)

  return (
    <>
      <AdaptiveTopHeader
        onMenuClick={() => setMenuOpen(true)}
      />

      <AdaptiveDrawerMenu
        open={menuOpen}
        onOpenChange={setMenuOpen}
      />
    </>
  )
}