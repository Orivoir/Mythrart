"use client"

import { motion } from "framer-motion"

type FloatingSearchOverlayProps = {
  onClose: () => void
}

/** Animated backdrop that closes the floating search on click. */
export function FloatingSearchOverlay({
  onClose,
}: FloatingSearchOverlayProps) {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.15 }}
      className="fixed inset-0 z-40 bg-black/20"
      onMouseDown={onClose}
    />
  )
}
