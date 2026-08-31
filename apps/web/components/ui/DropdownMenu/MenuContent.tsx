import { DropdownMenuContent as RootDropdownMenuContent } from "@radix-ui/react-dropdown-menu"

export function DropdownMenuContent({ children }: { children: React.ReactNode }) {
  return (
      <RootDropdownMenuContent
        sideOffset={8}
        className="
          z-50
          min-w-48
          rounded-lg
          border
          border-border
          bg-background
          py-2
          px-4
          shadow-md

          data-[state=open]:animate-in
          data-[state=closed]:animate-out

          data-[state=open]:fade-in-0
          data-[state=closed]:fade-out-0

          data-[state=open]:zoom-in-95
          data-[state=closed]:zoom-out-95

          data-[side=bottom]:slide-in-from-top-2
        "
      >
        {children}
      </RootDropdownMenuContent>

  )
}