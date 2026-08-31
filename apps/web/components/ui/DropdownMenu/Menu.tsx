import * as React from "react"
import { DropdownMenu as RootDropdownMenu } from "@radix-ui/react-dropdown-menu"
import {DropdownMenuContent} from "./MenuContent"
import { MenuTrigger } from "./MenuTrigger"

interface DropdownMenuProps {
  label: string
  children: React.ReactNode
  className?: string
}


export function DropdownMenu({
  label,
  children,
  className,
}: DropdownMenuProps) {
  return (
    <RootDropdownMenu>
      <MenuTrigger label={label} className={className} />

      <DropdownMenuContent>{children}</DropdownMenuContent>
    </RootDropdownMenu>
  )
}
