import { cn } from "@/lib/utils"

interface ContainerProps {
  children: React.ReactNode
  className?: string
}

export function Container({
  children,
  className,
}: ContainerProps) {
  return (
    <div
      className={cn(
        "w-full",
        "max-w-10xl",
        "mx-auto",
        "px-8 sm:px-10 lg:px-20",
        "mt-16",
        className
      )}
    >
      {children}
    </div>
  )
}