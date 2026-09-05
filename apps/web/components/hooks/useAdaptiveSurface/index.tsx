"use client"

import { useAppMode } from "@/components/hooks/useAppMode"

import { DrawerSurface, DropdownSurface } from "@/components/ui/surface"

export function useAdaptiveSurface() {
  const { usage: {mode} } = useAppMode()

  const Surface =
    mode === "companion"
      ? DrawerSurface
      : DropdownSurface

  return {
    Surface,
  }
}