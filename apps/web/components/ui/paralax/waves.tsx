"use client"

import Image from "next/image"

export function Waves() {

  return (
    <div className="
      absolute
      inset-x-0
      bottom-0
      pointer-events-none
      -z-10
    ">
      <Image
        src="/waves.svg"
        alt=""
        width={1440}
        height={220}
        className="w-full h-auto"
      />
    </div>
  )
}