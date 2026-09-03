"use client"

import { createContext, ReactNode, useState, useMemo } from "react"
import { useMediaQuery } from "usehooks-ts"

export type AppUsageMode =
  
  // Initial state defined with device:
  // Mobile Landscape with no pointer fine (mouse) connected
  | "companion"

  // Initial state defined with device:
  // Mobile Landscape or Tablet with pointer fine (mouse) connected
  | "quick-workspace"
  
  // Laptop or Desktop
  | "workspace"
  
  // NOT IMPLEMENTED INTO MVP:
  // Initial state: Desktop with multiple screens connected
  // Implemented UI needs: getScreenDetails (https://developer.mozilla.org/en-US/docs/Web/API/Window/getScreenDetails)
  // With handler permissions for this API and handler compatibility betweens browsers
  // after that should opened other "companion" window (https://developer.mozilla.org/en-US/docs/Web/API/Window/open)
  // With handler sizing screens and event handler for screens disconnected/connected:
  // https://developer.mozilla.org/en-US/docs/Web/API/ScreenDetails/screenschange_event
  | "workspace-extended" // In MVP "workspace-extended" is fallback to "workspace"


export interface AppUsage {
  mode: AppUsageMode
}

export interface AppUsageContextValue {
  setAction: (action: AppUsageAction) => void
  usage: AppUsage
}

// Action used by engine for evolutive AppUsageMode adaptative to user interactions
// In future AppUsageAction should more rich data:
// E.g: permission or mode should be added:
// E.g: { type: "OPEN"; complement: "CHAPTER" } with a permission READ ONLY, user not intention working
export type AppUsageAction =
  | { type: "OPEN"; complement: "PROJECT" }
  | { type: "OPEN"; complement: "CHAPTER" }

  | { type: "START"; complement: "EDITING" }
  | { type: "START"; complement: "VOICE" }

  | { type: "STOP"; complement: "VOICE" }

  | { type: "OPEN"; complement: "COLLABORATION" }
  | { type: "EDIT"; complement: "COLLABORATION" }
  | { type: "EDIT"; complement: "METADATA" }

  | { type: "OPEN"; complement: "EXPLORER" }
  | { type: "OPEN"; complement: "SETTINGS" }

export const AppUsageContext =
  createContext<AppUsageContextValue | null>(null)

export type AppUsageProviderProps = {
  children: ReactNode
}


export type AppUsageCapabilities = {
  isPortrait: boolean
  isLandscape: boolean
  hasFinePointer: boolean
  hasCoarsePointer: boolean
  isDesktop: boolean
  isTablet: boolean
}

function createGetInitialAppUsageMode(capabilities: AppUsageCapabilities) {

  return () => {

    const {
      isDesktop,
      isTablet,
      isPortrait,
      isLandscape,
      hasFinePointer,
      hasCoarsePointer
    } = capabilities

    // Laptop / Desktop
    if (isDesktop) {
      return "workspace"
    }

    // Tablet in landscape with a precise pointer
    if (isTablet && isLandscape && hasFinePointer) {
      return "workspace"
    }

    if(isTablet && hasCoarsePointer) {
      return "quick-workspace"
    }

    // Mobile in landscape with a precise pointer
    if (!isTablet && isLandscape && hasFinePointer) {
      return "quick-workspace"
    }

    // Everything else on mobile / tablet
    return "companion"
  }
}

export function AppUsageProvider({
  children,
}: AppUsageProviderProps) {
  
  const isPortrait = useMediaQuery("(orientation: portrait)")
  const isLandscape = useMediaQuery("(orientation: landscape)")

  // have a fine pointer (e.g., mouse) connected
  const hasFinePointer = useMediaQuery("(pointer: fine)")
  // have not fine pointer (e.g., touch screen)
  const hasCoarsePointer = useMediaQuery("(pointer: coarse)")

  const isDesktop = useMediaQuery("(min-width: 1024px)")
  const isTablet = useMediaQuery("(min-width: 768px) and (max-width: 1023px)")

  const getInitialAppUsageMode = useMemo(() => createGetInitialAppUsageMode({
    isDesktop,
    isTablet,
    isPortrait,
    isLandscape,
    hasFinePointer,
    hasCoarsePointer
  }), [
    isPortrait,
    isLandscape,
    hasFinePointer,
    hasCoarsePointer,
    isDesktop,
    isTablet,
  ])

  const [usage] = useState<AppUsage>({
    // Pour l'instant, état initial volontairement fixe
    // afin de tester les différents modes.
    mode: getInitialAppUsageMode(),
  })

  const setAction = (action: AppUsageAction) => {
    // later action is send to engine app usage that determine
    // if AppUsageMode should be changed with:
    // - new interactions (action argument)
    // - latest interactions (stored in the engine client side session lifecycle)
    // - capabilities of the devices (Mobile, Mobile paysage orientation, Mobile + pointer fine, tablet, ect...)
    
    // currently the Initial state (determined with the capabilities of the devices only) should never changed
    // appUsageEngine(action)
  }

  const value = useMemo<AppUsageContextValue>(
    () => ({
      usage,
      setAction, // Expose to client component for call engine
    }),
    [usage],
  )

  return (
    <AppUsageContext.Provider value={value}>
      {children}
    </AppUsageContext.Provider>
  )
}