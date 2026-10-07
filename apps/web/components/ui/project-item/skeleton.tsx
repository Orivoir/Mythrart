import { Skeleton } from "@radix-ui/themes"
import { motion } from "framer-motion"

import useDrawerCollapse from "@/components/hooks/use-drawer-collapse"

export default function ProjectItemSkeleton() {
  const isDrawerCollapsed = useDrawerCollapse()

  const coverHeight = isDrawerCollapsed ? 185 : 130

  return (
    <div className="rounded-lg border border-border bg-background p-3">
      <motion.div
        initial={false}
        animate={{
          height: coverHeight,
        }}
        transition={{
          duration: 0.25,
          ease: "easeInOut",
        }}
      >
        <Skeleton
          width="100%"
          height="100%"
          style={{
            borderRadius: "6px",
          }}
        />
      </motion.div>

      <div className="mt-4 flex flex-col gap-2">
        <Skeleton width="75%" height="12px" />
        <Skeleton width="65%" height="12px" />
        <Skeleton width="45%" height="12px" />
      </div>
    </div>
  )
}