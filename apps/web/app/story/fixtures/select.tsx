"use client"

import { useState } from "react"
import {
  BookOpen,
  Feather,
  FileText,
  Lock,
  Sparkles,
} from "lucide-react"

import { Button } from "@/components/ui/button"
import { Select, type SelectOption } from "@/components/ui/select"

const projectTypes: SelectOption[] = [
  {
    value: "novel",
    label: "Roman",
    leftIcon: BookOpen,
  },
  {
    value: "short-story",
    label: "Nouvelle",
    leftIcon: FileText,
  },
  {
    value: "poetry",
    label: "Poésie",
    leftIcon: Feather,
  },
  {
    value: "screenplay",
    label: "Scénario",
    leftIcon: FileText,
    rightIcon: Sparkles,
  },
  {
    value: "premium",
    label: "Projet Premium",
    leftIcon: Lock,
    disabled: true,
  },
]

export default function SelectFixtures() {
  const [controlledValue, setControlledValue] = useState("novel")

  return (
    <div className="space-y-10 p-10">
      {/* Basic */}
      <section className="max-w-md space-y-3">
        <h2 className="text-lg font-medium">
          Basique
        </h2>

        <Select
          options={projectTypes}
          placeholder="Sélectionner un type"
        />
      </section>

      {/* Controlled */}
      <section className="max-w-md space-y-3">
        <h2 className="text-lg font-medium">
          Contrôlé
        </h2>

        <Select
          options={projectTypes}
          value={controlledValue}
          onValueChange={setControlledValue}
          placeholder="Sélectionner un type"
        />

        <p className="text-sm text-muted-foreground">
          Valeur actuelle :{" "}
          <span className="font-medium text-foreground">
            {controlledValue}
          </span>
        </p>

        <Button
          type="button"
          variant="outline"
          size="sm"
          onClick={() => setControlledValue("poetry")}
        >
          Sélectionner « Poésie »
        </Button>
      </section>

      {/* Default value */}
      <section className="max-w-md space-y-3">
        <h2 className="text-lg font-medium">
          Default value
        </h2>

        <Select
          options={projectTypes}
          defaultValue="short-story"
          placeholder="Sélectionner un type"
        />
      </section>

      {/* Disabled option */}
      <section className="max-w-md space-y-3">
        <h2 className="text-lg font-medium">
          Option désactivée
        </h2>

        <Select
          options={projectTypes}
          placeholder="Sélectionner un type"
        />

        <p className="text-sm text-muted-foreground">
          « Projet Premium » doit apparaître mais ne pas
          pouvoir être sélectionné.
        </p>
      </section>

      {/* Disabled select */}
      <section className="max-w-md space-y-3">
        <h2 className="text-lg font-medium">
          Select désactivé
        </h2>

        <Select
          options={projectTypes}
          defaultValue="novel"
          disabled
        />
      </section>

      {/* Required */}
      <section className="max-w-md space-y-3">
        <h2 className="text-lg font-medium">
          Required
        </h2>

        <Select
          options={projectTypes}
          placeholder="Type de projet"
          name="project-type"
          required
        />
      </section>

      {/* Icons */}
      <section className="max-w-md space-y-3">
        <h2 className="text-lg font-medium">
          Icônes gauche / droite
        </h2>

        <Select
          options={[
            {
              value: "left",
              label: "Icône à gauche",
              leftIcon: BookOpen,
            },
            {
              value: "right",
              label: "Icône à droite",
              rightIcon: Sparkles,
            },
            {
              value: "both",
              label: "Icônes des deux côtés",
              leftIcon: BookOpen,
              rightIcon: Sparkles,
            },
          ]}
          placeholder="Tester les icônes"
        />
      </section>
    </div>
  )
}