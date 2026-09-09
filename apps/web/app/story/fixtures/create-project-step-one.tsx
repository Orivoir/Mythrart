"use client"

import { useState } from "react"
import { BookOpen, FileText } from "lucide-react"

import { Button } from "@/components/ui/button"
import { Stepper } from "@/components/ui/stepper"

import { CreateProjectStepOne } from "@/components/ui/create-project/steps/one"

import type {
  CreateProjectCoverPreset,
  CreateProjectStepOneValues,
  CreateProjectTheme,
} from "@/components/ui/create-project/steps/one/types"

import type { SelectOption } from "@/components/ui/select"

const projectTypes: SelectOption[] = [
  {
    value: "novel",
    label: "Roman",
    leftIcon: BookOpen,
  },
  {
    value: "biography",
    label: "Biographie",
    leftIcon: FileText,
  },
  {
    value: "essay",
    label: "Essai",
    leftIcon: FileText,
  },
  {
    value: "short-story",
    label: "Nouvelle",
    leftIcon: FileText,
  },
]

const themes: CreateProjectTheme[] = [
  {
    id: "modern-fiction",
    name: "Fiction moderne",
    shortDescribe: "Un modèle polyvalent pour les romans contemporains.",
    cover: "https://placehold.co/80x80",
  },
  {
    id: "fantasy",
    name: "Fantasy",
    shortDescribe:
      "Une structure adaptée aux univers imaginaires et aux récits épiques.",
    cover: "https://placehold.co/80x80",
  },
  {
    id: "thriller",
    name: "Thriller",
    shortDescribe:
      "Un modèle pensé pour les récits à suspense et les intrigues complexes.",
    cover: "https://placehold.co/80x80",
  },
  {
    id: "romance",
    name: "Romance",
    shortDescribe:
      "Une structure centrée sur les personnages et leurs relations.",
    cover: "https://placehold.co/80x80",
  },
]

const coverPresets: CreateProjectCoverPreset[] = [
  {
    id: "sunset",
    image: "https://placehold.co/180x260",
    label: "Coucher de soleil",
  },
  {
    id: "forest",
    image: "https://placehold.co/180x260",
    label: "Forêt",
  },
  {
    id: "castle",
    image: "https://placehold.co/180x260",
    label: "Château",
  },
  {
    id: "night",
    image: "https://placehold.co/180x260",
    label: "Nuit étoilée",
  },
]

const steps = [
  {
    id: "informations",
    index: 1,
    title: "Informations",
    description: "Détails de base",
  },
  {
    id: "synopsis",
    index: 2,
    title: "Synopsis",
    description: "Votre histoire et son analyse",
  },
  {
    id: "features",
    index: 3,
    title: "Fonctionnalités",
    description: "Personnalisez votre projet",
  },
  {
    id: "collaborators",
    index: 4,
    title: "Collaborateurs",
    description: "Invitez des personnes",
  },
]

export default function CreateProjectStepOneFixture() {

  const [value, setValue] = useState<CreateProjectStepOneValues>({
    title: "",
    subtitle: "",
    type: "novel",
    description: "",
    theme: "modern-fiction",
    cover: null,
    coverPreset: null,
  })

  const handleChange = (
    field: keyof Omit<
      CreateProjectStepOneValues,
      "cover" | "coverPreset"
    >,
    nextValue: string,
  ) => {
    setValue((current) => ({
      ...current,
      [field]: nextValue,
    }))
  }

  const handleCoverChange = (files: File[]) => {
    setValue((current) => ({
      ...current,
      cover: files[0] ?? null,
      coverPreset: null,
    }))
  }

  const handleCoverPresetChange = (preset: string | null) => {
    setValue((current) => ({
      ...current,
      coverPreset: preset,
      cover: null,
    }))
  }

  const isValid =
    value.title.trim().length > 0 &&
    value.type.length > 0 &&
    value.theme.length > 0

  return (
    <div className="mx-auto w-full max-w-4xl rounded-xl border bg-background shadow-sm">
      <div className="space-y-6 p-6">
        <Stepper
          steps={steps.map((step) => ({
            ...step,
            status: step.index === 1 ? "active" : "upcoming",
            isCurrent: step.index === 1,
          }))}
          currentStep={1}
        />

        <CreateProjectStepOne
          value={value}
          projectTypes={projectTypes}
          themes={themes}
          coverPresets={coverPresets}
          onChange={handleChange}
          onCoverChange={handleCoverChange}
          onCoverPresetChange={handleCoverPresetChange}
        />
      </div>

      <div className="flex items-center justify-end gap-3 border-t px-6 py-4">
        <Button type="button" variant="outline">
          Annuler
        </Button>

        <Button
          type="button"
          variant="primary"
          disabled={!isValid}
        >
          Suivant
        </Button>
      </div>
    </div>
  )
}