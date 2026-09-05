import { NavigationItem } from "@/components/ui/navigation-item"
import { Compass, Folder, Home } from "lucide-react"

export default function FixturesNavigationItem() {
  return (
    <section className="space-y-6">
      <div>
        <h2 className="text-lg font-semibold">
          Navigation Item
        </h2>

        <p className="text-sm text-muted-foreground">
          Navigation avec ou sans titre.
        </p>
      </div>

      <div className="flex flex-wrap items-center gap-4">
        <NavigationItem
          icon={Home}
          label="Accueil"
          href="/dashboard"
          active
        />

        <NavigationItem
          icon={Folder}
          label="Projets"
          href="/dashboard/projects"
        />

        <NavigationItem
          icon={Compass}
          label="Explorer"
          href="/dashboard/explore"
        />

        <NavigationItem
          icon={Home}
          label="Accueil"
          href="/dashboard"
          active
          withTitle={false}
        />

        <NavigationItem
          icon={Folder}
          label="Projets"
          href="/dashboard/projects"
          withTitle={false}
        />

        <NavigationItem
          icon={Compass}
          label="Explorer"
          href="/dashboard/explore"
          withTitle={false}
        />
      </div>
    </section>
  )
}