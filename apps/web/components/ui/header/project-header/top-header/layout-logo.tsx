import { AppLink } from "@/components/ui/app-link"
import { BrandName } from "@/components/ui/brand/brand-name"

export default function LayoutLogo() {

  return (
    <div className="flex shrink-0 items-center border-r border-border pr-5">
      <AppLink
        href="/dashboard"
        mutedOnHover={false}
        aria-label="Retour au tableau de bord"
      >
        <BrandName size="sm" />
      </AppLink>
    </div>
  )
}