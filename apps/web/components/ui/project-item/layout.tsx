import { AppLink } from "@/components/ui/app-link"
import { cn } from "@/lib/utils"

export default function ProjectItemLayout({ children, projectLink }: { children: React.ReactNode, projectLink: string }) {

  return (
    <AppLink
      href={projectLink}
      className={cn(
        "group block overflow-hidden rounded-lg",
        "border border-border bg-background",
        "transition-all duration-200",
        "hover:border-border-hover hover:shadow-sm",
        "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent/40",
      )}
    >
      {children}
    </AppLink>
  )
}