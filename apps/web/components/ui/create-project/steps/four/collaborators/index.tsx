import type {
  Collaborator,
  CollaboratorRole,
} from "../types"

import { CollaboratorsHeader } from "./header"
import { CollaboratorItem } from "./item"

interface CollaboratorsProps {
  collaborators: Collaborator[]
  roles: CollaboratorRole[]
  onRoleChange?: (
    collaboratorId: string,
    role: CollaboratorRole["id"],
  ) => void
  onManageAccess?: () => void
}

export function Collaborators({
  collaborators,
  roles,
  onRoleChange,
  onManageAccess,
}: CollaboratorsProps) {
  return (
    <section className="space-y-4">
      <CollaboratorsHeader
        count={collaborators.length}
        onManageAccess={onManageAccess}
      />

      <div className="space-y-3">
        {collaborators.map((collaborator) => (
          <CollaboratorItem
            key={collaborator.id}
            collaborator={collaborator}
            roles={roles}
            onRoleChange={onRoleChange}
          />
        ))}
      </div>
    </section>
  )
}