"use client"

import ItemSkeleton from "./item-skeleton"
import { Text } from "@/components/ui/Typography"
import GranularLoading from "@/components/ui/granular-loading"

export default function LoadingSuggestion() {

  return (
    <div className="flex flex-col gap-3 bg-soft-blue p-2 rounded">

      <div className="flex items-center gap-2 p-2 bg-muted/10 rounded-sm">
        <GranularLoading />
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