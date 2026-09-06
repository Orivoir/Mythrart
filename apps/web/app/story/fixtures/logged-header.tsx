"use client"

import { LoggedHeader } from "@/components/ui/header/logged-header"

/** Renders the real LoggedHeader; resize/rotate or toggle devtools device mode to see it adapt. */
export default function LoggedHeaderFixture() {
  return (
    <section className="space-y-4">
      <div>
        <h2 className="text-lg font-semibold">
          Logged Header
        </h2>

        <p className="text-sm text-muted-foreground">
          En-tête adaptatif (Workspace / Quick Workspace / Companion).
          Change d&apos;orientation ou de type de pointeur pour voir
          les variantes.
        </p>
      </div>

      {/* The header/sidebar/bottom-nav are fixed to the viewport, not this box. */}
      <LoggedHeader />
    </section>
  )
}
