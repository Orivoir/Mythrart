"use client"

import ItemSkeleton from "./item-skeleton"
import { Text } from "@/components/ui/Typography"

export default function LoadingSuggestion() {

  return (
    <div className="flex flex-col gap-3 bg-soft-blue p-2 rounded">

      <div className="flex items-center gap-2 p-2 bg-muted/10 rounded-sm">
        <LoadingIcon />
        <Text>Chargement des entités...</Text>
      </div>

      <div className="flex flex-col gap-3">
        <ItemSkeleton />
        <ItemSkeleton />
        <ItemSkeleton />
      </div>
    </div>
  )
}

import { motion } from "framer-motion"
import { LoaderCircle } from "lucide-react"

export function LoadingIcon() {
  return (
    <motion.div
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