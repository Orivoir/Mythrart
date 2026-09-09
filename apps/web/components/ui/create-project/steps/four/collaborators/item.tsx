"use client"

import { Crown, Info, MoreHorizontal } from "lucide-react"
import { Select } from "@radix-ui/themes"

import Avatar from "@/components/ui/avatar"
import { Button } from "@/components/ui/button"
import { Chip } from "@/components/ui/chip"

import type {
  Collaborator,
  CollaboratorRole,
} from "../types"

interface CollaboratorItemProps {
  collaborator: Collaborator
  roles: CollaboratorRole[]
  onRoleChange?: (
    collaboratorId: string,
    role: CollaboratorRole["id"],
  ) => void
}

export function CollaboratorItem({
  collaborator,
  roles,
  onRoleChange,
}: CollaboratorItemProps) {
  const selectedRole = roles.find(
    (role) => role.id === collaborator.role,
  )

  return (
    <div
      className={`
        flex flex-col gap-4 rounded
        border border-border p-4
        sm:flex-row sm:items-center sm:justify-between
        ${
          collaborator.isOwner
            ? "bg-soft-blue/40"
            : "bg-background"
        }
      `}
    >
      <div className="flex min-w-0 items-center gap-3">
        <Avatar
          email={collaborator.email ?? collaborator.phone ?? ""}
          alt={collaborator.name}
          size="md"
        />

        <div className="min-w-0">
          <div className="flex flex-wrap items-center gap-2">
            <p className="font-medium text-foreground">
              {collaborator.name}
            </p>

            {collaborator.isOwner ? (
              <Chip>
                <Crown className="mr-1 size-3" />
                Propriétaire
              </Chip>
            ) : null}
          </div>

          <p className="truncate text-sm text-muted-foreground">
            {collaborator.email ?? collaborator.phone}
          </p>
        </div>
      </div>

      <div className="flex items-center gap-3 sm:shrink-0">
        {collaborator.isOwner ? (
          <span className="text-sm text-muted-foreground">
            Accès complet
          </span>
        ) : (
          <>
            <Select.Root
              value={collaborator.role}
              onValueChange={(value) =>
                onRoleChange?.(
                  collaborator.id,
                  value as CollaboratorRole["id"],
                )
              }
            >
              <Select.Trigger
                variant="surface"
                className="min-w-36"
              >
                {selectedRole?.label}
              </Select.Trigger>

              <Select.Content
                position="popper"
                variant="solid"
                className="z-50 bg-surface p-2"
              >
                {roles.map((role) => (
                  <Select.Item
                    key={role.id}
                    value={role.id}
                  >
                    {role.label}
                  </Select.Item>
                ))}
              </Select.Content>
            </Select.Root>

            {collaborator.status === "pending" ? (
              <span className="flex items-center gap-2 text-sm text-muted-foreground">
                <span className="size-2 rounded-full bg-warning" />
                En attente
              </span>
            ) : null}

            <Button
              type="button"
              variant="ghost"
              size="icon"
              aria-label={`Options on ${collaborator.name}`}
            >
              <MoreHorizontal className="size-4" />
            </Button>
          </>
        )}

        <Button
          type="button"
          variant="ghost"
          size="icon"
          aria-label={`Information on ${collaborator.name}`}
        >
          <Info className="size-4" />
        </Button>
      </div>
    </div>
  )
}