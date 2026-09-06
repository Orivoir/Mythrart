import { Menu } from "lucide-react"
import { getTranslations } from "next-intl/server"

import { Button } from "@/components/ui/button"
import { AppLink as Link } from "@/components/ui/app-link"

export async function Actions() {
  const t = await getTranslations("Header.Unlogged.Actions")

  return (
    <div className="
      flex
      flex-1
      justify-end
      items-center
      gap-3
    ">
      <Link href="/login" className="hidden md:inline-flex">
        {t("Login")}
      </Link>

      <Button variant="accent-outline" className="hidden md:inline-flex">
        {t("TryFree")}
      </Button>

      <Button
        variant="ghost"
        className="md:hidden size-10 p-0"
        aria-label={t("OpenMenuAria")}
      >
        <Menu className="size-5" />
      </Button>
    </div>
  )
}