"use client"

import { useState } from "react"

import { Button } from "@/components/ui/button"
import { BottomNavigation } from "@/components/ui/bottom-navigation"

export default function BottomNavigationFixtures() {
  const [open, setOpen] = useState(false)

  return (
    <div className="relative p-10">
      <Button
        type="button"
        variant="outline"
        onClick={() => setOpen((value) => !value)}
      >
        {open ? "Fermer bottom nav" : "Ouvrir bottom nav"}
      </Button>

      {open && (
        <BottomNavigation
          activeHref="/dashboard"
          onMenuClick={() => {
            console.log("Menu")
          }}
        />
      )}
    </div>
  )
}