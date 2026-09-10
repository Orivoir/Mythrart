"use client"

import { useRef, useState } from "react"
import { BookOpen, FileText, Plus, X } from "lucide-react"

import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogTitle,
} from "@/components/ui/dialog"

import { Button } from "@/components/ui/button"
import { ButtonWithIcon } from "@/components/ui/button-with-icon"
import { Stepper } from "@/components/ui/stepper"

import { CreateProjectComposition } from "@/components/ui/create-project/composition"

import type {
  CreateProjectCoverPreset,
  CreateProjectTheme,
} from "@/components/ui/create-project/steps/one/types"

import type { AnalysisJob } from "@/components/ui/create-project/steps/two/types"

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
    shortDescribe:
      "Un modèle polyvalent pour les romans contemporains.",
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

export default function CreateProjectCompositionFixture() {
  const [open, setOpen] = useState(false)

  const analysisJob = useRef<AnalysisJob>({
    status: "pending",
    percent: 0,
  })

  const handleAnalysisStart = async (file: File) => {
    console.log("Analysis started:", file)

    analysisJob.current = {
      status: "processing",
      percent: 0,
    }
  }

  const handleAnalysisCancel = async () => {
    console.log("Analysis cancelled")

    analysisJob.current = {
      status: "pending",
      percent: 0,
    }
  }

  const getAnalysisJob = async (): Promise<AnalysisJob> => {
    const current = analysisJob.current

    if (current.status !== "processing") {
      return current
    }

    const nextPercent = Math.min(current.percent + 20, 100)

    if (nextPercent >= 100) {
      analysisJob.current = {
        status: "completed",
        percent: 100,
        data: {
          entityCount: 12,
          locationCount: 4,
          narrativeArcCount: 3,
          timelineCount: 2,
        },
      }
    } else {
      analysisJob.current = {
        status: "processing",
        percent: nextPercent,
      }
    }

    return analysisJob.current
  }

  return (
    <>
      <ButtonWithIcon
        icon={Plus}
        variant="primary"
        onClick={() => setOpen(true)}
      >
        Ouvrir la création de projet
      </ButtonWithIcon>

      <Dialog
        open={open}
        onOpenChange={setOpen}
      >
        <DialogContent
          showClose={false}
          className="
            flex
            h-[min(844px,calc(100vh-2rem))]
            w-[calc(100vw-2rem)]
            max-w-3xl
            flex-col
            overflow-hidden
            p-0
          "
        >
          <CreateProjectComposition
            projectTypes={projectTypes}
            themes={themes}
            coverPresets={coverPresets}
            hasAnalysisAccess={false}
            onStepOneFinish={async (value) => {
              console.log("Step one finished:", value)
            }}
            onAnalysisStart={handleAnalysisStart}
            onAnalysisCancel={handleAnalysisCancel}
            getAnalysisJob={getAnalysisJob}
          >
            {(state) => (
              <div className="flex h-full min-h-0 flex-col">
                {/* Header */}
                <header className="shrink-0 px-8 pt-8">
                  <div className="relative pr-12">
                    <DialogTitle>
                      Nouveau projet
                    </DialogTitle>

                    <DialogDescription className="mt-1">
                      Créez un nouveau projet et personnalisez
                      votre espace d’écriture.
                    </DialogDescription>

                    <DialogClose asChild>
                      <ButtonWithIcon
                        icon={X}
                        variant="ghost"
                        size="icon"
                        aria-label="Fermer"
                        className="
                          absolute
                          right-0
                          top-0
                        "
                      />
                    </DialogClose>
                  </div>

                  <div className="mt-6">
                    <Stepper
                      steps={state.stepperSteps}
                      currentStep={state.currentStep}
                    />
                  </div>
                </header>

                {/* Main */}
                <main
                  className="
                    min-h-0
                    flex-1
                    overflow-y-auto
                    px-8
                  "
                >
                  <div
                    className={[
                      "flex min-h-full justify-center py-6",
                      state.currentStep === 2
                        ? "items-center"
                        : "items-start",
                    ].join(" ")}
                  >
                    {state.content}
                  </div>
                </main>

                {/* Footer */}
                <footer
                  className="
                    flex
                    min-h-[88px]
                    shrink-0
                    items-center
                    justify-between
                    border-t
                    px-8
                  "
                >
                  <Button
                    type="button"
                    variant="outline"
                    onClick={() => {
                      if (state.canGoPrevious) {
                        state.previous()
                        return
                      }

                      setOpen(false)
                    }}
                  >
                    {state.canGoPrevious
                      ? "Précédent"
                      : "Annuler"}
                  </Button>

                  <Button
                    type="button"
                    variant="primary"
                    onClick={state.next}
                    disabled={!state.canGoNext}
                  >
                    {state.currentStep ===
                    state.steps.length
                      ? "Créer le projet"
                      : "Suivant"}
                  </Button>
                </footer>
              </div>
            )}
          </CreateProjectComposition>
        </DialogContent>
      </Dialog>
    </>
  )
}