import {
  ChartLine,
  Compass,
  Folder,
  House,
} from "lucide-react"

import { BrandName } from "@/components/ui/brand/brand-name"
import { FloatingSearch } from "@/components/ui/floating-search"
import { NavigationItem } from "@/components/ui/navigation-item"

import { CreateProjectButton } from "./create-project-button"

export function AdaptiveTopHeaderWorkspace() {
  return (
    <header className="w-full px-4 py-4">
      <div className="mx-auto flex h-20 w-full items-center rounded-xl border bg-background px-6 shadow-sm">
        {/* Brand */}
        <div className="shrink-0">
          <BrandName
            withSlogan={false}
            withLogo={false}
            size="lg"
          />
        </div>

        {/* Main navigation */}
        <nav className="ml-10 flex items-center gap-6">
          <NavigationItem
            icon={House}
            label="Home"
            href="#"
            active
          />

          <NavigationItem
            icon={Folder}
            label="Projects"
            href="#"
          />

          <NavigationItem
            icon={Compass}
            label="Explore"
            href="#"
          />

          <NavigationItem
            icon={ChartLine}
            label="Analytics"
            href="#"
          />
        </nav>

        {/* Right actions */}
        <div className="ml-auto flex items-center gap-6">
          {/* Search */}
          <div className="w-[208px]">
            <FloatingSearch suggestions={[]} />
          </div>

          {/* Create project */}
          <CreateProjectButton />

          {/* Notifications */}
          {/* <Notification ... /> */}

          {/* Separator */}
          <div
            className="h-8 w-px bg-border"
            aria-hidden="true"
          />

          {/* User */}
          {/* <UserMenu ... /> */}
        </div>
      </div>
    </header>
  )
}