"use client"

import FixtureAvatar from "./fixtures/avatar"
import FixtureBadge from "./fixtures/badge"
import FixturesNotifications from "./fixtures/notifications"
import FixturesNavigationItem from "./fixtures/navigation-item"
import FixturesSearchBar from "./fixtures/searchbar"
import RichSearchBarFixture from "./fixtures/rich-searchbar"
import AdaptiveSurfaceFixtures from "./fixtures/adaptive-surface"
import UserMenuFixtures from "./fixtures/user-menu"
import RichUserMenuFixtures from "./fixtures/rich-user-menu"
import StepperFixtures from "./fixtures/stepper"
import BottomNavigationFixtures from "./fixtures/bottom-navigation"
import TextareaFixtures from "./fixtures/textarea"
import SelectFixtures from "./fixtures/select"

export default function StoryPage() {

  return (
    <main className="min-h-screen bg-background p-8">
      <div className="mx-auto max-w-5xl space-y-12">

        <header>
          <h1 className="text-2xl font-semibold">
            UI Story
          </h1>

          <p className="mt-2 text-sm text-muted-foreground">
            Catalogue des composants UI de Mythrart.
          </p>
        </header>

        <FixtureAvatar />

        <FixtureBadge />

        <FixturesNotifications />

        <FixturesNavigationItem />

        <FixturesSearchBar />

        <RichSearchBarFixture />

        <AdaptiveSurfaceFixtures />
        
        <UserMenuFixtures />

        <RichUserMenuFixtures />

        <BottomNavigationFixtures />

        <StepperFixtures />

        <TextareaFixtures />

        <SelectFixtures />

      </div>
    </main>
  )
}