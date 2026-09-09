"use client"

import { CreateProjectStepFour } from "@/components/ui/create-project/steps/four"
import type {
  Collaborator,
  CollaboratorRole,
  StepFourProps,
  SupportedCountry,
} from "@/components/ui/create-project/steps/four/types"

const roles: CollaboratorRole[] = [
  {
    id: "reader",
    label: "Lecteur",
    description:
      "Peut consulter le projet, mais ne peut pas le modifier.",
  },
  {
    id: "editor",
    label: "Éditeur",
    description:
      "Peut consulter et modifier le contenu du projet.",
  },
  {
    id: "administrator",
    label: "Administrateur",
    description:
      "Peut consulter, modifier le projet et gérer les collaborateurs.",
  },
]

const countries: SupportedCountry[] = [
  {
    code: "FR",
    label: "France",
  },
  {
    code: "BE",
    label: "Belgique",
  },
  {
    code: "LU",
    label: "Luxembourg",
  },
  {
    code: "CH",
    label: "Suisse",
  },
  {
    code: "CA",
    label: "Canada",
  },
]

const collaborators: Collaborator[] = [
  {
    id: "owner",
    name: "John Doe",
    email: "john@mythrart.com",
    initials: "JD",
    role: "administrator",
    status: "active",
    isOwner: true,
  },
  {
    id: "pending-marie",
    name: "Marie Smith",
    email: "marie.smith@example.com",
    initials: "MS",
    role: "editor",
    status: "pending",
  },
]

const initialInvite = {
  email: "",
  phone: "",
  country: "FR" as const,
  role: "reader" as const,
}

function createProps(
  hasCustomRolesAccess: boolean,
): StepFourProps {
  return {
    roles,
    countries,
    collaborators,
    hasCustomRolesAccess,
    initialInvite,

    onInvite: (method, values) => {
      console.log("[StepFour fixture] invite", {
        method,
        values,
      })
    },

    onRoleChange: (collaboratorId, role) => {
      console.log(
        "[StepFour fixture] role change",
        {
          collaboratorId,
          role,
        },
      )
    },

    onManageAccess: () => {
      console.log(
        "[StepFour fixture] manage access",
      )
    },

    onCreateCustomRole: () => {
      console.log(
        "[StepFour fixture] create custom role",
      )
    },
  }
}

export default function CreateProjectStepFourFixture() {
  return (
    <div className="min-h-screen bg-background">
      <div className="mx-auto w-full max-w-6xl px-4 py-8">
        <div className="space-y-16">
          {/* Free */}
          <section className="space-y-6">
            <div className="space-y-1">
              <h1 className="text-xl font-semibold text-foreground">
                Utilisateur Free
              </h1>

              <p className="text-sm text-muted-foreground">
                Le rôle personnalisé est réservé aux utilisateurs Premium.
              </p>
            </div>

            <CreateProjectStepFour
              {...createProps(false)}
            />
          </section>

          {/* Premium */}
          <section className="space-y-6">
            <div className="border-t border-border pt-10">
              <h1 className="text-xl font-semibold text-foreground">
                Utilisateur Premium
              </h1>

              <p className="mt-1 text-sm text-muted-foreground">
                L'utilisateur Premium peut créer et personnaliser ses propres rôles.
              </p>
            </div>

            <CreateProjectStepFour
              {...createProps(true)}
            />
          </section>
        </div>
      </div>
    </div>
  )
}