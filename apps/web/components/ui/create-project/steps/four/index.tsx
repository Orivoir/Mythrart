"use client"

import { useState } from "react"

import type {
  CollaboratorRole,
  InviteMethod,
  InviteValues,
  StepFourProps,
} from "./types"

import { AboutRoles } from "./about-roles"
import { Collaborators } from "./collaborators"
import { CustomRoleBox } from "./custom-role-box"
import { StepFourHeader } from "./header"
import { Invite } from "./invite"
import { PremiumRoleBox } from "./premium-role-box"

export function CreateProjectStepFour({
  roles,
  collaborators: initialCollaborators,
  countries,
  hasCustomRolesAccess,
  initialInvite,
  onInvite,
  onRoleChange,
  onManageAccess,
  onCreateCustomRole,
}: StepFourProps) {
  const [collaborators, setCollaborators] = useState(
    initialCollaborators,
  )

  function handleInvite(
    method: InviteMethod,
    values: InviteValues,
  ) {
    onInvite?.(method, values)
  }

  function handleRoleChange(
    collaboratorId: string,
    role: CollaboratorRole["id"],
  ) {
    setCollaborators((current) =>
      current.map((collaborator) =>
        collaborator.id === collaboratorId
          ? {
              ...collaborator,
              role,
            }
          : collaborator,
      ),
    )

    onRoleChange?.(collaboratorId, role)
  }

  return (
    <div className="space-y-6">
      <StepFourHeader />

      <Invite
        roles={roles}
        countries={countries}
        initialValues={initialInvite}
        onInvite={handleInvite}
      />

      <Collaborators
        collaborators={collaborators}
        roles={roles}
        onRoleChange={handleRoleChange}
        onManageAccess={onManageAccess}
      />

      <div className="border-t border-border pt-6">
        <AboutRoles roles={roles} />
      </div>

      {hasCustomRolesAccess ? (
        <CustomRoleBox
          onCreateCustomRole={
            onCreateCustomRole ??
            (() => {})
          }
        />
      ) : (
        <PremiumRoleBox />
      )}

      <div
        className="
          rounded-lg bg-soft-blue/60
          px-4 py-3
          text-sm text-muted-foreground
        "
      >
        Vous pourrez modifier les rôles et les accès à tout
        moment depuis les paramètres du projet.
      </div>
    </div>
  )
}