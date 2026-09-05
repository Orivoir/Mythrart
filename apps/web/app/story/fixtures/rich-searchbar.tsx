import { FloatingSearch } from "@/components/ui/floating-search"
import { SearchBottomSheet } from "@/components/ui/search-bottom-sheet"
import type { SuggestionsData } from "@/components/ui/suggestion-ressource/types"
import { useState } from "react"

export default function RichSearchBarFixture() {
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
    }
  ]
  return (
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
  )
}