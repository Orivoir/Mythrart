"use client"

import { Compass, Folder, Home } from "lucide-react"
import { useState } from "react"

import Avatar from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"
import { Notification } from "@/components/ui/notifications"
import { NavigationItem } from "@/components/ui/navigation-item"
import { SearchBar } from "@/components/ui/searchbar"
import { VoiceRecorder } from "@/components/ui/voice-recording"
import { FloatingSearch } from "@/components/ui/floating-search"
import { SearchBottomSheet } from "@/components/ui/search-bottom-sheet"
import type { SuggestionsData } from "@/components/ui/suggestion-ressource/types"

export default function StoryPage() {
  const [bottomSheetOpen, setBottomSheetOpen] = useState(false)

  const suggestions: SuggestionsData = [
    {
      resource: "recent-searches",
      items: [
        {
          id: "1",
          label: "Le dernier hiver",
          type: "Ebook",
          resource: "ebooks",
          href: "/dashboard/search/1",
        },
        {
          id: "2",
          label: "La rencontre",
          type: "Chapitre · Le dernier hiver",
          resource: "chapters",
          href: "/dashboard/search/2",
        },
        {
          id: "3",
          label: "Jean Dupont",
          type: "Auteur",
          resource: "authors",
          href: "/dashboard/search/3",
        },
      ],
    },
    {
      resource: "assets",
      items: [
        {
          id: "4",
          label: "Couverture principale",
          type: "Image",
          resource: "assets",
          href: "/dashboard/search/4",
        },
        {
          id: "5",
          label: "Couverture principale",
          type: "Image",
          resource: "assets",
          href: "/dashboard/search/5",
        },
        {
          id: "6",
          label: "Couverture principale",
          type: "Image",
          resource: "assets",
          href: "/dashboard/search/6",
        },
      ],
    },
    {
      resource: "authors",
      items: [
        {
          id: "4",
          label: "John Doe",
          type: "Traducteur",
          resource: "authors",
          href: "/dashboard/search/4",
        },
        {
          id: "5",
          label: "Jane Smith",
          type: "Auteur",
          resource: "authors",
          href: "/dashboard/search/5",
        },
        {
          id: "6",
          label: "Alice Johnson",
          type: "Auteur",
          resource: "authors",
          href: "/dashboard/search/6",
        },
      ],
    },
    {
      resource: "chapters",
      items: [
        {
          id: "4",
          label: "Ebook Name 1",
          type: "Chapter Name",
          resource: "chapters",
          href: "/dashboard/search/4",
        },
        {
          id: "5",
          label: "Ebook Name 2",
          type: "Chapter Name",
          resource: "chapters",
          href: "/dashboard/search/5",
        },
        {
          id: "6",
          label: "Ebook Name 3",
          type: "Chapter Name",
          resource: "chapters",
          href: "/dashboard/search/6",
        },
      ],
    },
    
  ]

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

        {/* Avatar */}
        <section className="space-y-6">
          <div>
            <h2 className="text-lg font-semibold">
              Avatar
            </h2>

            <p className="text-sm text-muted-foreground">
              Différentes tailles et sources d&apos;avatar.
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-6">
            {["xs", "sm", "md", "lg", "xl", "2xl"].map((size) => (
              <Avatar
                key={size}
                email="sam@example.com"
                alt="Sam"
                size={size as "xs" | "sm" | "md" | "lg" | "xl" | "2xl"}
              />
            ))}
          </div>

          <div className="flex flex-wrap items-center gap-6">
            {["xs", "sm", "md", "lg", "xl", "2xl"].map((size) => (
              <Avatar
                key={size}
                email="sam.gabor@hotmail.com"
                alt="Sam"
                size={size as "xs" | "sm" | "md" | "lg" | "xl" | "2xl"}
              />
            ))}
          </div>
        </section>

        {/* Badge */}
        <section className="space-y-6">
          <div>
            <h2 className="text-lg font-semibold">
              Badge
            </h2>

            <p className="text-sm text-muted-foreground">
              Variantes et positions disponibles.
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-8">
            <div className="relative size-10 rounded-full border">
              <Badge count={3} />
            </div>

            <div className="relative size-10 rounded-full border">
              <Badge
                count={3}
                variant="reduced"
              />
            </div>

            <div className="relative size-10 rounded-full border">
              <Badge
                count={12}
                position={{
                  x: "start",
                  y: "start",
                }}
              />
            </div>

            <div className="relative size-10 rounded-full border">
              <Badge
                count={12}
                position={{
                  x: "start",
                  y: "end",
                }}
              />
            </div>

            <div className="relative size-10 rounded-full border">
              <Badge
                count={12}
                position={{
                  x: "end",
                  y: "end",
                }}
              />
            </div>

            <div className="relative size-10 rounded-full border">
              <Badge count={0} />
            </div>
          </div>
        </section>

        {/* Notification */}
        <section className="space-y-6">
          <div>
            <h2 className="text-lg font-semibold">
              Notification
            </h2>

            <p className="text-sm text-muted-foreground">
              Bouton de notification avec compteur.
            </p>
          </div>

          <div className="flex items-center gap-6">
            <Notification count={0} />

            <Notification count={3} />

            <Notification
              count={12}
              variant="reduced"
            />

            <Notification count={125} />
          </div>
        </section>

        {/* Navigation Item */}
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

        {/* SearchBar */}
        <section className="space-y-6">
          <div>
            <h2 className="text-lg font-semibold">
              SearchBar
            </h2>

            <p className="text-sm text-muted-foreground">
              Barre de recherche adaptative au mode d&apos;utilisation.
            </p>
          </div>

          <div className="max-w-xl flex flex-col gap-3">
            <SearchBar isCompanion={false} />
            <SearchBar isCompanion />
          </div>
        </section>

        {/* Voice Recorder */}
        <section className="space-y-6">
          <div>
            <h2 className="text-lg font-semibold">
              Voice Recorder
            </h2>

            <p className="text-sm text-muted-foreground">
              Enregistreur vocal interactif.
            </p>
          </div>

          <div className="max-w-xl flex flex-col gap-12">
            <VoiceRecorder disabled={false} />
            <VoiceRecorder disabled={true} />
          </div>
        </section>

        {/* Rich Search */}
        <section className="space-y-8">
          <div>
            <h2 className="text-lg font-semibold">
              Rich Search
            </h2>

            <p className="text-sm text-muted-foreground">
              Recherche et suggestions selon le contexte d&apos;utilisation.
            </p>
          </div>

          {/* Floating Search */}
          <div className="space-y-4">
            <section className="space-y-4">
              <div>
                <h3 className="text-sm font-medium">
                  Floating Search · Workspace
                </h3>

                <p className="text-sm text-muted-foreground">
                  Recherche avec suggestions affichées sous la barre.
                </p>
              </div>

              <div className="max-w-xl">
                <FloatingSearch
                  suggestions={suggestions}
                />
              </div>
            </section>
          </div>

          {/* Search Bottom Sheet */}
          <div className="space-y-4">
            <div>
              <h3 className="text-sm font-medium">
                Search Bottom Sheet · Companion
              </h3>

              <p className="text-sm text-muted-foreground">
                Recherche avec suggestions dans une bottom sheet.
              </p>
            </div>

            <button
              type="button"
              onClick={() => setBottomSheetOpen(true)}
              className="rounded-lg border px-4 py-2 text-sm"
            >
              Ouvrir la recherche Companion
            </button>

            <SearchBottomSheet
              open={bottomSheetOpen}
              onOpenChange={setBottomSheetOpen}
              suggestions={suggestions}
            />
          </div>
        </section>

      </div>
    </main>
  )
}