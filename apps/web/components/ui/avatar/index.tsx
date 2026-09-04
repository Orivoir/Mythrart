"use client"

import * as AvatarPrimitive from "@radix-ui/react-avatar"
import {sizeClasses, type AvatarSize} from "./sizes"
import { useAvatar } from "./use-avatar"

export type AvatarProps = {
  image?: string
  email: string
  alt: string
  size?: AvatarSize
}

export default function Avatar({
  image,
  email,
  alt,
  size = "md",
}: AvatarProps) {

  const { src, initial, handleError } = useAvatar({ image, email, alt })

  return (
    <AvatarPrimitive.Root
      className={`
        relative
        inline-flex
        shrink-0
        overflow-hidden
        rounded-full
        ${sizeClasses[size]}
      `}
    >
      <AvatarPrimitive.Image
        src={src}
        alt={alt}
        className="size-full object-cover"
        onError={handleError}
      />

      <AvatarPrimitive.Fallback
        className="
          flex
          size-full
          items-center
          justify-center
          rounded-full
          bg-muted
          font-medium
          text-muted-foreground
          uppercase
        "
      >
        {initial}
      </AvatarPrimitive.Fallback>
    </AvatarPrimitive.Root>
  )
}