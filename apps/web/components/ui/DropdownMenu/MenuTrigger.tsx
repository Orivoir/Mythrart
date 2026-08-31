import { DropdownMenuTrigger } from "@radix-ui/react-dropdown-menu"
import { ChevronDown } from "lucide-react"
import { cn } from "@/lib/utils"
  
export function MenuTrigger({
  className,
  label
}: {
  className?: string
  label: string
}) {

  return (
    <DropdownMenuTrigger
        className={cn(
          "inline-flex items-center gap-1",
          "text-sm font-medium",
          "transition-colors",
          "hover:text-foreground",
          "outline-none",
          "cursor-pointer",
          className
        )}
      >
        {label}

        <ChevronDown
          className="
            size-4
            transition-transform
            duration-200
            data-[state=open]:rotate-180
          "
        />
      </DropdownMenuTrigger>
  )
}