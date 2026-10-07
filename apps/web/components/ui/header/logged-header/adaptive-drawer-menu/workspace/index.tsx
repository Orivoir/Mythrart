"use client"

import { useState } from "react"
import { motion, AnimatePresence } from "framer-motion"
import {
  ChevronLeft,
  ChevronRight
} from "lucide-react"
import { useTranslations } from "next-intl"

import type { DrawerMenuSectionsProps } from "./../menu-sections"
import fireEvent from "@/lib/constants/custom-events"
import WorkspaceHeader from "./header"
import WorkspaceLogout from "./logout"
import MotionLayout from "./motion-layout"
import WorkspaceNavActions from "./nav-actions"

export type WorkspaceSidebarMenuProps = DrawerMenuSectionsProps & {
  onLogout?: () => void
  userId?: string
}

export function WorkspaceSidebarMenu({
  onLogout,
  onActionClick,
  onPlansClick,
  onHelpClick,
  userId,
  ...sectionsProps
}: WorkspaceSidebarMenuProps) {

  const [collapsed, setCollapsed] = useState(false)

  const t = useTranslations("Header.Logged.DrawerMenu.Workspace")

  const onCollapseChange = () => {
    const nextCollapsed = !collapsed

    fireEvent.drawerCollapseChange({
      status: nextCollapsed,
    })

    setCollapsed(nextCollapsed)
  }

  return (
    <MotionLayout collapsed={collapsed}>
      <WorkspaceHeader collapsed={collapsed} />

      <WorkspaceNavActions
        collapsed={collapsed}
        onActionClick={onActionClick}
        onPlansClick={onPlansClick}
        onHelpClick={onHelpClick}
        userId={userId}
        {...sectionsProps}
      />

      <WorkspaceLogout
        collapsed={collapsed}
        onLogout={onLogout}
      />

      {/* Expand/Collapse button */}
      <motion.button
        type="button"
        aria-label={
          collapsed
            ? t("ExpandAria")
            : t("CollapseAria")
        }
        onClick={onCollapseChange}
        className="
          absolute
          -right-3
          top-1/2
          z-30
          flex
          size-6
          -translate-y-1/2
          items-center
          justify-center
          rounded-full
          bg-primary
          text-primary-foreground
          shadow-md
        "
        whileTap={{ scale: 0.9 }}
      >
        <AnimatePresence mode="wait" initial={false}>
          {collapsed ? (
            <motion.div
              key="right"
              initial={{ opacity: 0, scale: 0.5 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.5 }}
            >
              <ChevronRight
                className="size-3.5"
                aria-hidden="true"
              />
            </motion.div>
          ) : (
            <motion.div
              key="left"
              initial={{ opacity: 0, scale: 0.5 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.5 }}
            >
              <ChevronLeft
                className="size-3.5"
                aria-hidden="true"
              />
            </motion.div>
          )}
        </AnimatePresence>
      </motion.button>
    </MotionLayout>
  )
}