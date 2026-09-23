import type { ReactNode } from "react"
import { cn } from "@/lib/utils"

interface EditorToolbarLayoutProps {
  children: ReactNode
  className?: string
}

export default function EditorToolbarLayout({
  children,
  className,
}: EditorToolbarLayoutProps) {
    return (
      <div
        className={cn(
          `
            flex
            h-14
            shrink-0
            items-center
            gap-1
            border-b
            border-border
            bg-background
            px-6
          `,
          className,
        )}
      >
        {children}
      </div>
    )
}