"use client"

import { useState } from "react"

import { Button } from "@/components/ui/button"
import { Textarea } from "@/components/ui/textarea"

export default function TextareaFixtures() {
  const [controlledValue, setControlledValue] = useState("")
  const [exceededValue, setExceededValue] = useState(
    "Ce texte dépasse volontairement la limite.",
  )

  return (
    <div className="space-y-10 p-10">
      {/* Basic */}
      <section className="space-y-3">
        <h2 className="text-lg font-medium">Sans compteur</h2>

        <Textarea
          spellCheck={false}
          placeholder="Écrivez quelque chose..."
          rows={5}
        />
      </section>

      {/* Uncontrolled + maxCount */}
      <section className="space-y-3">
        <h2 className="text-lg font-medium">
          Avec compteur
        </h2>

        <Textarea
          spellCheck={false}
          maxCount={120}
          placeholder="Écrivez une description..."
          rows={5}
        />
      </section>

      {/* Controlled */}
      <section className="space-y-3">
        <h2 className="text-lg font-medium">
          Contrôlé
        </h2>

        <Textarea
          value={controlledValue}
          onChange={(event) => setControlledValue(event.target.value)}
          maxCount={200}
          placeholder="Textarea contrôlé..."
          rows={5}
        />

        <div className="flex gap-2">
          <Button
            type="button"
            variant="outline"
            onClick={() => setControlledValue("")}
          >
            Réinitialiser
          </Button>

          <Button
            type="button"
            variant="outline"
            onClick={() =>
              setControlledValue(
                "Un texte ajouté depuis le composant parent.",
              )
            }
          >
            Modifier depuis le parent
          </Button>
        </div>
      </section>

      {/* Warning */}
      <section className="space-y-3">
        <h2 className="text-lg font-medium">
          Proche de la limite
        </h2>

        <Textarea
          maxCount={50}
          defaultValue={
            "Lorem ipsum dolor sit amet, consectetur adipiscing."
          }
          rows={5}
        />
      </section>

      {/* Exceeded */}
      <section className="space-y-3">
        <h2 className="text-lg font-medium">
          Dépassement contrôlé
        </h2>

        <Textarea
          value={exceededValue}
          onChange={(event) => setExceededValue(event.target.value)}
          maxCount={20}
          rows={5}
        />

        <p className="text-sm text-muted-foreground">
          Permet de vérifier l'état `danger` lorsqu'une valeur
          contrôlée provenant du parent dépasse la limite.
        </p>
      </section>
    </div>
  )
}