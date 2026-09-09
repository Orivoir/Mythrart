import type { CountryCode } from "libphonenumber-js"

export type InviteMethod = "email" | "telephone"

export type CollaboratorRoleId =
  | "reader"
  | "editor"
  | "administrator"

export type CollaboratorRole = {
  id: CollaboratorRoleId
  label: string
  description: string
}

export type CollaboratorStatus =
  | "active"
  | "pending"

export type Collaborator = {
  id: string
  name: string
  email?: string
  phone?: string
  initials: string
  role: CollaboratorRoleId
  status: CollaboratorStatus
  isOwner?: boolean
}

export type SupportedCountry = {
  code: CountryCode
  label: string
}

export type InviteValues = {
  email: string
  phone: string
  role: CollaboratorRoleId
  country: CountryCode
}

export type StepFourProps = {
  roles: CollaboratorRole[]
  collaborators: Collaborator[]
  countries: SupportedCountry[]

  hasCustomRolesAccess: boolean

  initialInvite?: Partial<InviteValues>

  onInvite?: (
    method: InviteMethod,
    values: InviteValues,
  ) => void

  onRoleChange?: (
    collaboratorId: string,
    role: CollaboratorRoleId,
  ) => void

  onManageAccess?: () => void

  onCreateCustomRole: () => void
}