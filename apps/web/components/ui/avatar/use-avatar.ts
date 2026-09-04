import { useMemo, useState } from "react"
import { getGravatarUrl, getGeneratedAvatarUrl } from "./gravatar"

type AvatarSource = "image" | "gravatar" | "generated"

type UseAvatarProps = {
  image?: string
  email: string
  alt: string
} 

export function useAvatar({ image, email, alt }: UseAvatarProps) {
  const [source, setSource] = useState<AvatarSource>(
    image ? "image" : "gravatar",
  )

  const gravatarUrl = useMemo(
    () => getGravatarUrl(email),
    [email],
  )

  const initial = alt.trim().charAt(0).toUpperCase()

  const generatedUrl = useMemo(
    () => getGeneratedAvatarUrl(initial),
    [initial],
  )

  const src =
    source === "image"
      ? image
      : source === "gravatar"
        ? gravatarUrl
        : generatedUrl

  function handleError() {
    if (source === "image") {
      setSource("gravatar")
      return
    }

    if (source === "gravatar") {
      setSource("generated")
    }
  }

  return {
    src,
    initial,
    handleError,
  }
}