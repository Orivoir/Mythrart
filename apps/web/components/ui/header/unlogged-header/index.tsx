import { BrandName } from "@/components/ui/brand/brand-name"
import { AppLink as Link } from "@/components/ui/app-link"
import { Actions } from "./actions"
import { MainNavigation } from "./main-navigation"

export function UnloggedHeader() {
  return (
    <header className="
      sticky top-0 z-50
      border-b border-border
      bg-background/80
      backdrop-blur
    ">
      <div className="
        flex
        h-16
        w-full
        items-center
        justify-between
        px-4
        sm:px-6
        lg:px-8
      ">

        <div className="flex-1">
          <Link href="/">
            <BrandName />
          </Link>
        </div>

        <MainNavigation />

        <Actions />

      </div>
    </header>
  )
}