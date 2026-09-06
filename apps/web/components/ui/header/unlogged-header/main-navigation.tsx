import { getTranslations } from "next-intl/server"

import { RessourcesMenu } from "./ressources-menu"
import { AppLink as Link } from "@/components/ui/app-link"

export async function MainNavigation() {
  const t = await getTranslations("Header.Unlogged.Nav")

  return (
    <nav className="
      hidden
      items-center
      gap-8
      text-sm
      font-medium
      md:flex
    ">
      <Link href="/features">
        {t("Features")}
      </Link>

      <Link href="/pricing">
        {t("Pricing")}
      </Link>

      <RessourcesMenu />

      <Link href="/about">
        {t("About")}
      </Link>
    </nav>
  )
}