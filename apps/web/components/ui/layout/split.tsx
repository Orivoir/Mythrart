import { cn } from "@/lib/utils"

export function SplitLayout({children, className}: {children: React.ReactNode, className?: string}) {

  return (
    <section className={cn(
      "flex",
      "flex-col",
      "xl:flex-row",
      "md:gap-48",
      "gap-24",
      "items-center",
      "justify-between",
      "w-full",
      "mb-16",
      "min-h-100",
      className
    )}> 
      {children}
    </section>
  )
}