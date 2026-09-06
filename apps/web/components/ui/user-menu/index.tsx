"use client"

import {
  createContext,
  useContext,
  type ReactNode,
} from "react"


import { UserMenuLayout } from "./layout"
import { UserMenuContent } from "./content"
import { UserMenuIdentity } from "./identity"
import { UserMenuAction } from "./action"

interface UserMenuContextValue {}

const UserMenuContext =
  createContext<UserMenuContextValue | null>(null)

export function useUserMenu() {
  const context = useContext(UserMenuContext)

  if (!context) {
    throw new Error(
      "UserMenu components must be used within UserMenu."
    )
  }

  return context
}

interface UserMenuRootProps {
  children: ReactNode
}

function UserMenuRoot({
  children,
}: UserMenuRootProps) {
  return (
    <UserMenuContext.Provider value={{}}>
      {children}
    </UserMenuContext.Provider>
  )
}

export const UserMenu = Object.assign(
  UserMenuRoot,
  {
    Layout: UserMenuLayout,
    Content: UserMenuContent,
    Identity: UserMenuIdentity,
    Action: UserMenuAction,
  }
)