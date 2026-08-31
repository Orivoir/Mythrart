import { cn } from "@/lib/utils"
import { getTranslations } from "next-intl/server"

interface BrandNameProps {
  withLogo?: boolean
  withSlogan?: boolean
  size?: "sm" | "md" | "lg"
  className?: string
}

export async function BrandName({
  withLogo = false,
  withSlogan = false,
  size = "md",
  className,
}: BrandNameProps) {

  const t = await getTranslations("Brand")

  return (
    <>
    <div className={cn(
      "flex items-center gap-2",
      className
    )}>
      {withLogo && (
        <>
          {/* futur logo */}
        </>
      )}

      <h1
        className={cn(
          "font-brand font-semibold",
          {
            "text-xl": size === "sm",
            "text-3xl": size === "md",
            "text-5xl": size === "lg",
          }
        )}
      >
        {t("Name")}
      </h1>
    </div>

    {withSlogan && (
      <p className="max-w-xl text-lg text-muted-foreground">
        {t("Slogan")}
      </p>
    )}
    </>
  )
}