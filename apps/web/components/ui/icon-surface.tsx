import {cn} from "@/lib/utils"

export function IconSurface(
  { children, className }:
  { children: React.ReactNode, className?: string }
) {
  return (
    <div className={cn(
      "flex h-10 w-10 shrink-0 items-center justify-center  rounded-full bg-muted/5",
      className
    )}>
      {children}
    </div>
  )
}