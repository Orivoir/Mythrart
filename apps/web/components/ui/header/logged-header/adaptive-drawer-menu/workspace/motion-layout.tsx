import { motion } from "framer-motion"

const SIDEBAR_WIDTH = 288
const SIDEBAR_COLLAPSED_WIDTH = 64

export default function MotionLayout({ children, collapsed }: { children: React.ReactNode, collapsed: boolean }) {

  return (
    <motion.aside
      initial={false}
      animate={{
        width: collapsed
          ? SIDEBAR_COLLAPSED_WIDTH
          : SIDEBAR_WIDTH,
      }}
      transition={{
        duration: 0.25,
        ease: "easeInOut",
      }}
      className="
        fixed
        inset-y-0
        left-0
        z-20
        flex
        flex-col
        border-r
        border-border
        bg-background
      "
    >
      {children}
    </motion.aside>
  )
}