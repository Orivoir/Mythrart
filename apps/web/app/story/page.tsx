"use client"

import { Compass, Folder, Home } from "lucide-react"

import Avatar from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"
import { Notification } from "@/components/ui/notifications"
import { NavigationItem } from "@/components/ui/navigation-item"
import { SearchBar } from "@/components/ui/searchbar"
import { VoiceRecorder } from "@/components/ui/voice-recording"

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

          <div className="max-w-xl">
            <SearchBar mode="workspace" />
          </div>

          <div className="max-w-xl">
            <SearchBar mode="companion" />
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
            <VoiceRecorder disabled={false} onRecordFinish={() => {}} />
            <VoiceRecorder disabled={true} onRecordFinish={() => {}} />
          </div>
        </section>
        

      </div>
    </main>
  )
}