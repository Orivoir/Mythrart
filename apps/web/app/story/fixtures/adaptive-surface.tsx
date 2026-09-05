"use client"

import { useState } from "react"

import { Button } from "@/components/ui/button"
import { useAdaptiveSurface } from "@/components/hooks/useAdaptiveSurface"

export default function AdaptiveSurfaceFixtures() {
  const [open, setOpen] = useState(false)

  return (
    <div className="space-y-12 p-10">
      <section className="space-y-6">
        <div>
          <h2 className="text-lg font-semibold">Adaptive Surface</h2>
          <p className="text-sm text-muted-foreground">
            Surface avec suffisamment de contenu pour tester les dimensions,
            le scroll et le comportement adaptatif.
          </p>
        </div>

        <BasicSurface open={open} onOpenChange={setOpen} />
      </section>

      <section className="space-y-6 border-t pt-10">
        <div>
          <h2 className="text-lg font-semibold">Rich Surface</h2>
          <p className="text-sm text-muted-foreground">
            Surface contenant plusieurs éléments interactifs et une surface
            imbriquée.
          </p>
        </div>

        <RichSurface />
      </section>
    </div>
  )
}

type BasicSurfaceProps = {
  open: boolean
  onOpenChange: (open: boolean) => void
}

function BasicSurface({ open, onOpenChange }: BasicSurfaceProps) {
  const { Surface } = useAdaptiveSurface()

  return (
    <Surface
      trigger={
        <Button type="button">
          Ouvrir la surface
        </Button>
      }
      open={open}
      onOpenChange={onOpenChange}
    >
      <div className="flex min-h-0 flex-col">
        <div className="border-b px-6 py-5">
          <h3 className="text-base font-semibold">
            Adaptive Surface
          </h3>

          <p className="mt-1 text-sm text-muted-foreground">
            Une surface de test avec plusieurs éléments.
          </p>
        </div>

        <div className="space-y-6 overflow-y-auto px-6 py-6">
          <div className="space-y-2">
            <h4 className="text-sm font-medium">
              Informations générales
            </h4>

            <p className="text-sm leading-6 text-muted-foreground">
              Ce bloc permet de vérifier le comportement du contenu lorsque
              la surface devient suffisamment grande pour nécessiter un
              défilement.
            </p>
          </div>

          <div className="grid gap-3 sm:grid-cols-2">
            <div className="rounded-lg border p-4">
              <p className="text-sm font-medium">Projets</p>
              <p className="mt-1 text-2xl font-semibold">12</p>
              <p className="mt-1 text-xs text-muted-foreground">
                Projets créés
              </p>
            </div>

            <div className="rounded-lg border p-4">
              <p className="text-sm font-medium">Chapitres</p>
              <p className="mt-1 text-2xl font-semibold">48</p>
              <p className="mt-1 text-xs text-muted-foreground">
                Chapitres rédigés
              </p>
            </div>
          </div>

          <div className="space-y-3">
            <h4 className="text-sm font-medium">
              Activité récente
            </h4>

            {[
              "Le chapitre 4 a été modifié",
              "Un nouveau projet a été créé",
              "Une collaboration a été acceptée",
              "La couverture du projet a été modifiée",
              "Le chapitre 7 a été déplacé",
            ].map((activity) => (
              <div
                key={activity}
                className="flex items-center justify-between rounded-lg border px-4 py-3"
              >
                <span className="text-sm">{activity}</span>

                <span className="text-xs text-muted-foreground">
                  Aujourd'hui
                </span>
              </div>
            ))}
          </div>

          <div className="rounded-lg bg-muted/50 p-4">
            <p className="text-sm font-medium">
              Zone supplémentaire
            </p>

            <p className="mt-1 text-sm leading-6 text-muted-foreground">
              Encore un peu de contenu afin de pouvoir observer précisément
              comment la surface gère une quantité importante de contenu.
            </p>
          </div>
        </div>

        <div className="flex items-center justify-end gap-2 border-t px-6 py-4">
          <Button
            type="button"
            variant="ghost"
            onClick={() => onOpenChange(false)}
          >
            Annuler
          </Button>

          <Button
            type="button"
            onClick={() => onOpenChange(false)}
          >
            Fermer
          </Button>
        </div>
      </div>
    </Surface>
  )
}

function RichSurface() {
  const [open, setOpen] = useState(false)

  const { Surface } = useAdaptiveSurface()

  return (
    <Surface
      trigger={
        <Button type="button" variant="outline">
          Ouvrir la Rich Surface
        </Button>
      }
      open={open}
      onOpenChange={setOpen}
    >
      <div className="flex flex-col">
        <div className="border-b px-6 py-5">
          <h3 className="text-base font-semibold">
            Menu principal
          </h3>

          <p className="mt-1 text-sm text-muted-foreground">
            Cette surface contient elle-même une surface adaptative.
          </p>
        </div>

        <div className="space-y-6 px-6 py-6">
          <div className="space-y-2">
            <p className="text-sm font-medium">
              Actions rapides
            </p>

            <div className="grid gap-2">
              <Button
                type="button"
                variant="outline"
                className="justify-start"
              >
                Modifier le profil
              </Button>

              <Button
                type="button"
                variant="outline"
                className="justify-start"
              >
                Gérer les préférences
              </Button>

              <Button
                type="button"
                variant="outline"
                className="justify-start"
              >
                Voir les collaborateurs
              </Button>
            </div>
          </div>

          <NestedSurface />

          <div className="rounded-lg bg-muted/50 p-4">
            <p className="text-sm font-medium">
              Contenu de la surface parente
            </p>

            <p className="mt-1 text-sm text-muted-foreground">
              Ce contenu permet de vérifier que la surface parente reste
              correctement positionnée lorsque la surface enfant est ouverte.
            </p>
          </div>
        </div>

        <div className="border-t px-6 py-4">
          <Button
            type="button"
            className="w-full"
            onClick={() => setOpen(false)}
          >
            Fermer la surface principale
          </Button>
        </div>
      </div>
    </Surface>
  )
}

function NestedSurface() {
  const [open, setOpen] = useState(false)

  const { Surface } = useAdaptiveSurface()

  return (
    <div className="rounded-lg border p-4">
      <div className="flex items-center justify-between gap-4">
        <div>
          <p className="text-sm font-medium">
            Surface imbriquée
          </p>

          <p className="mt-1 text-xs text-muted-foreground">
            Ouvre une deuxième surface depuis la première.
          </p>
        </div>

        <Surface
          trigger={
            <Button type="button" size="sm">
              Ouvrir
            </Button>
          }
          open={open}
          onOpenChange={setOpen}
        >
          <div className="flex flex-col">
            <div className="border-b px-6 py-5">
              <h4 className="text-base font-semibold">
                Surface enfant
              </h4>

              <p className="mt-1 text-sm text-muted-foreground">
                Cette surface est rendue à l'intérieur de la surface
                principale.
              </p>
            </div>

            <div className="space-y-4 px-6 py-6">
              <div className="rounded-lg border p-4">
                <p className="text-sm font-medium">
                  Comportement imbriqué
                </p>

                <p className="mt-1 text-sm leading-6 text-muted-foreground">
                  Vérifie notamment le focus, le clic extérieur, le z-index
                  et la fermeture de la surface enfant sans fermer
                  automatiquement la surface parente.
                </p>
              </div>

              <div className="space-y-2">
                <p className="text-sm font-medium">
                  Actions
                </p>

                <Button
                  type="button"
                  variant="outline"
                  className="w-full"
                >
                  Action enfant
                </Button>

                <Button
                  type="button"
                  className="w-full"
                  onClick={() => setOpen(false)}
                >
                  Fermer la surface enfant
                </Button>
              </div>
            </div>
          </div>
        </Surface>
      </div>
    </div>
  )
}