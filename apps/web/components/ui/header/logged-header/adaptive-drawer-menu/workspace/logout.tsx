"use client"

import { motion, AnimatePresence } from "framer-motion"
import {
  LogOut
} from "lucide-react"
import { useTranslations } from "next-intl"
import { Button } from "@/components/ui/button"
import { cn } from "@/lib/utils"

export default function WorkspaceLogout({
  collapsed,
  onLogout,
}: {
  collapsed: boolean
  onLogout?: () => void
}) {

  const t = useTranslations("Header.Logged.DrawerMenu.Workspace")

  return (
    <div
      className={cn(
        "shrink-0 border-t border-border p-2",
        collapsed && "flex justify-center",
      )}
    >
      <Button
        type="button"
        variant="ghost"
        size={collapsed ? "icon" : "default"}
        className={
          collapsed
            ? ""
            : "w-full justify-start gap-2"
        }
        title={t("Logout")}
        aria-label={t("Logout")}
        onClick={onLogout}
      >
        <LogOut
          className="size-5"
          aria-hidden="true"
        />

        <AnimatePresence initial={false}>
          {!collapsed && (
            <motion.span
              initial={{ opacity: 0, width: 0 }}
              animate={{ opacity: 1, width: "auto" }}
              exit={{ opacity: 0, width: 0 }}
              transition={{ duration: 0.15 }}
              className="overflow-hidden whitespace-nowrap"
            >
              {t("Logout")}
            </motion.span>
          )}
        </AnimatePresence>
      </Button>
    </div>
  )
}