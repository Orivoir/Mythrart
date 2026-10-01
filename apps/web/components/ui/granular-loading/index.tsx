"use client"

import { motion } from "framer-motion"
import { LoaderCircle } from "lucide-react"

export default function GranularLoading() {
  return (
    <motion.div
      className="flex size-5 items-center justify-center"
      animate={{ rotate: 360 }}
      transition={{
        duration: 1,
        repeat: Infinity,
        ease: "linear",
      }}
    >
      <LoaderCircle className="size-5 text-accent" />
    </motion.div>
  )
}