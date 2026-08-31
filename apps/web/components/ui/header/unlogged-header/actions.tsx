import { Button } from "@/components/ui/button"
import { Menu } from "lucide-react"
import { AppLink as Link } from "@/components/ui/app-link"

export function Actions() {

  return (
    <div className="
      flex
      flex-1
      justify-end
      items-center
      gap-3
    ">
      <Link href="/login" className="hidden md:inline-flex">
        Se connecter
      </Link>

      <Button variant="accent-outline" className="hidden md:inline-flex">
        Essayer gratuitement
      </Button>

      <Button
        variant="ghost"
        className="md:hidden size-10 p-0"
        aria-label="Ouvrir le menu"
      >
        <Menu className="size-5" />
      </Button>
    </div>
  )
}