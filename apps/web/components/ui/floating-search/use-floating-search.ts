"use client"

import { useCallback, useEffect, useRef, useState } from "react"
import {
  computeFloatingSearchPosition,
  computeFloatingSearchWidth,
  VIEWPORT_MARGIN,
  type FloatingSearchPosition,
} from "./position"

/** Owns open/close state, positioning, and viewport/keyboard side effects. */
export function useFloatingSearch() {
  const [open, setOpen] = useState(false)
  const [position, setPosition] =
    useState<FloatingSearchPosition | null>(null)

  const anchorRef = useRef<HTMLDivElement | null>(null)
  const floatingRef = useRef<HTMLDivElement | null>(null)

  const updatePosition = useCallback(() => {
    const anchor = anchorRef.current
    const floating = floatingRef.current

    if (!anchor || !floating) return

    const anchorRect = anchor.getBoundingClientRect()

    const viewportWidth = window.innerWidth
    const viewportHeight = window.innerHeight

    const screenWidth = window.screen?.availWidth ?? viewportWidth
    const screenHeight = window.screen?.availHeight ?? viewportHeight

    const availableWidth = Math.min(viewportWidth, screenWidth)
    const availableHeight = Math.min(viewportHeight, screenHeight)

    const floatingWidth = computeFloatingSearchWidth(
      anchorRect.width,
      availableWidth,
    )

    floating.style.width = `${floatingWidth}px`

    const floatingRect = floating.getBoundingClientRect()

    const floatingHeight = Math.min(
      floatingRect.height,
      availableHeight - VIEWPORT_MARGIN * 2,
    )

    setPosition(
      computeFloatingSearchPosition({
        anchorRect,
        floatingHeight,
        floatingWidth,
        availableWidth,
        availableHeight,
      }),
    )
  }, [])

  const close = useCallback(() => {
    setOpen(false)

    requestAnimationFrame(() => {
      const input =
        anchorRef.current?.querySelector("input") ??
        floatingRef.current?.querySelector("input")

      if (input instanceof HTMLInputElement) {
        input.blur()
      }
    })
  }, [])

  const openSearch = useCallback(() => {
    setOpen(true)
  }, [])

  // Position the panel once it has rendered.
  useEffect(() => {
    if (!open) {
      setPosition(null)
      return
    }

    const frame = requestAnimationFrame(() => {
      updatePosition()
    })

    return () => {
      cancelAnimationFrame(frame)
    }
  }, [open, updatePosition])

  // Recompute the position when the viewport changes.
  useEffect(() => {
    if (!open) return

    function handleResize() {
      updatePosition()
    }

    function handleScroll() {
      updatePosition()
    }

    window.addEventListener("resize", handleResize)
    window.addEventListener("scroll", handleScroll, true)

    return () => {
      window.removeEventListener("resize", handleResize)
      window.removeEventListener("scroll", handleScroll, true)
    }
  }, [open, updatePosition])

  // Close on Escape.
  useEffect(() => {
    if (!open) return

    function handleKeyDown(event: KeyboardEvent) {
      if (event.key === "Escape") {
        close()
      }
    }

    document.addEventListener("keydown", handleKeyDown)

    return () => {
      document.removeEventListener("keydown", handleKeyDown)
    }
  }, [open, close])

  // Lock page scroll while open.
  useEffect(() => {
    if (!open) return

    const body = document.body
    const previousOverflow = body.style.overflow
    const previousPaddingRight = body.style.paddingRight

    const scrollbarWidth =
      window.innerWidth - document.documentElement.clientWidth

    body.style.overflow = "hidden"

    if (scrollbarWidth > 0) {
      body.style.paddingRight = `${scrollbarWidth}px`
    }

    return () => {
      body.style.overflow = previousOverflow
      body.style.paddingRight = previousPaddingRight
    }
  }, [open])

  return {
    open,
    position,
    anchorRef,
    floatingRef,
    openSearch,
    close,
  }
}
