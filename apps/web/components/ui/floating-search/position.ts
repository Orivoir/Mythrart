export type FloatingSearchPosition = {
  top: number
  left: number
  width: number
  maxHeight: number
}

export const VIEWPORT_MARGIN = 16
export const SEARCH_GAP = 8

/** Computes the floating panel width, clamped to the available viewport. */
export function computeFloatingSearchWidth(
  anchorWidth: number,
  availableWidth: number,
): number {
  return Math.min(anchorWidth + 16, availableWidth - VIEWPORT_MARGIN * 2)
}

type ComputeFloatingSearchPositionParams = {
  anchorRect: DOMRect
  floatingHeight: number
  floatingWidth: number
  availableWidth: number
  availableHeight: number
}

/**
 * Positions the floating panel above the anchor when possible, falling back
 * below it, and always clamping the result inside the viewport.
 */
export function computeFloatingSearchPosition({
  anchorRect,
  floatingHeight,
  floatingWidth,
  availableWidth,
  availableHeight,
}: ComputeFloatingSearchPositionParams): FloatingSearchPosition {
  const spaceAbove = anchorRect.top - SEARCH_GAP - VIEWPORT_MARGIN
  const spaceBelow =
    availableHeight - anchorRect.bottom - SEARCH_GAP - VIEWPORT_MARGIN

  let top: number

  if (spaceAbove >= floatingHeight) {
    top = anchorRect.top - floatingHeight - SEARCH_GAP
  } else if (spaceBelow >= floatingHeight) {
    top = anchorRect.bottom + SEARCH_GAP
  } else {
    // Neither side fits entirely: clamp into the available space.
    top = Math.max(
      VIEWPORT_MARGIN,
      Math.min(
        anchorRect.top - floatingHeight - SEARCH_GAP,
        availableHeight - floatingHeight - VIEWPORT_MARGIN,
      ),
    )
  }

  // Center horizontally relative to the anchor, then clamp.
  let left = anchorRect.left - (floatingWidth - anchorRect.width) / 2

  left = Math.max(
    VIEWPORT_MARGIN,
    Math.min(left, availableWidth - floatingWidth - VIEWPORT_MARGIN),
  )

  top = Math.max(
    VIEWPORT_MARGIN,
    Math.min(top, availableHeight - floatingHeight - VIEWPORT_MARGIN),
  )

  return { top, left, width: floatingWidth, maxHeight: floatingHeight }
}
