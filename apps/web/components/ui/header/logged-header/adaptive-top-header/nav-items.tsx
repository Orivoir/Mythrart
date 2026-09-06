"use client"

import type { LucideIcon } from "lucide-react"
import {
  BarChart3,
  BookOpen,
  Compass,
  Folder,
  House,
} from "lucide-react"
import { useTranslations } from "next-intl"

export type TopNavItem = {
  icon: LucideIcon
  label: string
  href: string
  // Kept visible when the header is reduced to its essentials (quick workspace).
  quickWorkspace?: boolean
}

/** Translated navigation items shared by the workspace and quick-workspace top headers. */
export function useTopNavItems(): TopNavItem[] {
  const t = useTranslations("Header.Logged.TopHeader.Nav")

  return [
    {
      icon: House,
      label: t("Home"),
      href: "/dashboard",
      quickWorkspace: true,
    },
    {
      icon: Folder,
      label: t("Projects"),
      href: "/dashboard/projects",
      quickWorkspace: true,
    },
    {
      icon: Compass,
      label: t("Explore"),
      href: "/dashboard/explore",
      quickWorkspace: true,
    },
    {
      icon: BookOpen,
      label: t("Library"),
      href: "/dashboard/library",
      quickWorkspace: true,
    },
    {
      icon: BarChart3,
      label: t("Stats"),
      href: "/dashboard/stats",
    },
  ]
}

