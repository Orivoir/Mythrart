"use client"

import { useEffect, useState } from "react"
import { motion } from "framer-motion"

import { cn } from "@/lib/utils"
import useCollapseChange from "@/components/hooks/custom-events/use-drawer-collapse"

interface ContainerProps {
  children: React.ReactNode
  className?: string
  withCollapse?: boolean
}

const DRAWER_WIDTH = 280
const DRAWER_COLLAPSED_WIDTH = 72

export function Container({
  children,
  className,
  withCollapse = false,
}: ContainerProps) {
  const [isCollapsed, setIsCollapsed] = useState(false)

  const onCollapseChange = (
    event: CustomEvent<{ status: boolean }>
  ): void => {
    setIsCollapsed(event.detail.status)
  }

  const { removeListener } = useCollapseChange(onCollapseChange)

  useEffect(() => {
    if (!withCollapse) {
      removeListener()
      setIsCollapsed(false)
    }
  }, [withCollapse, removeListener])

  return (
    <motion.div
      className={cn(
        "mt-16",
        "px-8 sm:px-10 lg:px-20",
        className,
      )}
      initial={false}
      animate={{
        marginLeft: withCollapse
          ? (isCollapsed ? DRAWER_COLLAPSED_WIDTH : DRAWER_WIDTH)
          : 0,

        width: withCollapse
          ? `calc(100% - ${
              isCollapsed
                ? DRAWER_COLLAPSED_WIDTH
                : DRAWER_WIDTH
            }px)`
          : "100%",
      }}
      transition={{
        duration: 0.25,
        ease: "easeInOut",
      }}
    >
      <div className="mx-auto w-full max-w-10xl">
        {children}
      </div>
    </motion.div>
  )
}