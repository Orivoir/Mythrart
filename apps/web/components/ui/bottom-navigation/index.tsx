"use client"

import {
  Compass,
  Folder,
  Grid2X2,
  House,
} from "lucide-react"

import { BottomNavigationItem } from "./item"

interface BottomNavigationProps {
  activeHref?: string
  onMenuClick?: () => void
}

export function BottomNavigation({
  activeHref = "/dashboard",
  onMenuClick,
}: BottomNavigationProps) {
  return (
    <nav
      aria-label="Navigation principale"
      className="
        fixed
        inset-x-0
        bottom-0
        z-40
        box-border
        grid
        w-full
        grid-cols-4
        bg-background
        pb-[env(safe-area-inset-bottom)]
        shadow-[0_-4px_16px_rgba(0,0,0,0.04)]
      "
    >
      <BottomNavigationItem
        icon={House}
        label="Accueil"
        href="/dashboard"
        active={activeHref === "/dashboard"}
      />

      <BottomNavigationItem
        icon={Folder}
        label="Projets"
        href="/dashboard/projects"
        active={activeHref === "/dashboard/projects"}
      />

      <BottomNavigationItem
        icon={Compass}
        label="Explorer"
        href="/dashboard/explore"
        active={activeHref === "/dashboard/explore"}
      />

      <BottomNavigationItem
        icon={Grid2X2}
        label="Menu"
        onClick={onMenuClick}
      />
    </nav>
  )
}