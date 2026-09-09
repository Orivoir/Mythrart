import {
  Eye,
  Pencil,
  Users,
} from "lucide-react"

import type { CollaboratorRole } from "../types"

import { AboutRolesHeader } from "./header"
import { AboutRoleItem } from "./item"

const roleIcons = {
  reader: Eye,
  editor: Pencil,
  administrator: Users,
} as const

interface AboutRolesProps {
  roles: CollaboratorRole[]
}

export function AboutRoles({
  roles,
}: AboutRolesProps) {
  return (
    <section className="space-y-4">
      <AboutRolesHeader />

      <div className="grid gap-4 md:grid-cols-3">
        {roles.map((role) => (
          <AboutRoleItem
            key={role.id}
            role={role}
            icon={roleIcons[role.id]}
          />
        ))}
      </div>
    </section>
  )
}