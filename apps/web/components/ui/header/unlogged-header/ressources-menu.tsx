import { getTranslations } from "next-intl/server"

import { AppLink as Link } from "@/components/ui/app-link"
import { DropdownMenu, DropdownMenuLink } from "../../DropdownMenu"

export async function RessourcesMenu() {
  const t = await getTranslations("Header.Unlogged.Resources")

  return (
    <DropdownMenu
      label={t("Label")}
    >
        <DropdownMenuLink>
          <Link href="/blog">
            {t("Blog")}
          </Link>
        </DropdownMenuLink>


        <DropdownMenuLink>
          <Link href="/guides">
            {t("Guides")}
          </Link>
        </DropdownMenuLink>


        <DropdownMenuLink>
          <Link href="/help">
            {t("Help")}
          </Link>
        </DropdownMenuLink>
    </DropdownMenu>
  )
}