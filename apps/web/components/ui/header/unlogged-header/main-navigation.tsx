import { RessourcesMenu } from "./ressources-menu"
import { AppLink as Link } from "@/components/ui/app-link"

export function MainNavigation() {

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
        Fonctionnalités
      </Link>

      <Link href="/pricing">
        Tarifs
      </Link>

      <RessourcesMenu />

      <Link href="/about">
        À propos
      </Link>
    </nav>
  )
}