"use client"

import { Skeleton } from "@radix-ui/themes"

export default function ProjectItemCoverLoading() {

  return (
    <Skeleton
      width="100%"
      height="100%"
      style={{
        position: "absolute",
        inset: 0,
      }}
    />
  )
}