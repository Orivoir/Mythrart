import { Chip } from "../chip"
import { getTranslations } from "next-intl/server"

export async function ChipNoInstall() {

  const t = await getTranslations("CTA")

  return (
    <>
    <Chip className="md:block hidden">
      {t("NoInstallChip")}
    </Chip>
    <Chip className="block md:hidden">
      {t("NoInstallChipShort")}
    </Chip>
    
    </>
  )
}