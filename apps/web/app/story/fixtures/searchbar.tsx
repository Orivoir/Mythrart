import { SearchBar } from "@/components/ui/searchbar"

export default function FixturesSearchBar() {
  return (
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
  )
}