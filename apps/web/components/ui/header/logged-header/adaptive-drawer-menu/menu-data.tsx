"use client"

import type { LucideIcon } from "lucide-react"
import {
  Folder,
  Globe,
  Settings,
  Trash2,
  Users,
} from "lucide-react"
import { useTranslations } from "next-intl"

export type DrawerMenuActionKey =
  | "collaborations"
  | "assets"
  | "settings"
  | "trash"
  | "publications"

export type DrawerMenuAction = {
  key: DrawerMenuActionKey
  icon: LucideIcon
  label: string
  description?: string
}

/** Translated shortcut actions shared by every drawer menu variant. */
export function useDrawerMenuActions(): DrawerMenuAction[] {
  const t = useTranslations("Header.Logged.DrawerMenu.Actions")

  return [
    {
      key: "collaborations",
      icon: Users,
      label: t("Collaborations"),
    },
    {
      key: "assets",
      icon: Folder,
      label: t("Assets.Label"),
      description: t("Assets.Description"),
    },
    {
      key: "settings",
      icon: Settings,
      label: t("Settings.Label"),
      description: t("Settings.Description"),
    },
    {
      key: "trash",
      icon: Trash2,
      label: t("Trash"),
    },
    {
      key: "publications",
      icon: Globe,
      label: t("Publications.Label"),
      description: t("Publications.Description"),
    },
  ]
}

