import { AppLink as Link } from "@/components/ui/app-link"
import { DropdownMenu, DropdownMenuLink } from "../../DropdownMenu"

export function RessourcesMenu() {

  return (
    <DropdownMenu
      label="Ressources"
    >
        <DropdownMenuLink>
          <Link href="/blog">
            Blog
          </Link>
        </DropdownMenuLink>


        <DropdownMenuLink>
          <Link href="/guides">
            Guides d'écriture
          </Link>
        </DropdownMenuLink>


        <DropdownMenuLink>
          <Link href="/help">
            Centre d'aide
          </Link>
        </DropdownMenuLink>
    </DropdownMenu>
  )
}