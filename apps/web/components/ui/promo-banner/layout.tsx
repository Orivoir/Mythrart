import { cn } from "@/lib/utils"
import type { PromoBannerTheme } from "./theme"

interface PromoBannerLayoutProps {
  header: React.ReactNode
  children: React.ReactNode
  theme: PromoBannerTheme
  className?: string
}

export default function PromoBannerLayout({
  header,
  children,
  theme,
  className,
}: PromoBannerLayoutProps) {
  return (
    <div
      className={cn(
        "flex h-full min-h-[165px] w-full flex-col",
        "overflow-hidden rounded-lg",
        theme.root,
        className,
      )}
      style={{
        backgroundImage: `url("${theme.image}"), ${theme.gradient}`,
        backgroundRepeat: "no-repeat, no-repeat",
        backgroundPosition: `${theme.imagePosition}, center`,
        backgroundSize: `${theme.imageSize}, cover`,
      }}
    >
      {/* Header */}
      <div className="w-full shrink-0 px-5 pt-4 sm:px-6">
        {header}
      </div>

      {/* Content */}
      <div className="flex flex-1 items-start px-5 pt-7 pb-6 sm:px-6">
        <div className="w-[78%]">
          {children}
        </div>
      </div>
    </div>
  )
}