"use client"

import { Mail } from "lucide-react"

import { ButtonWithIcon } from "@/components/ui/button-with-icon"
import type {
  CollaboratorRole
} from "../types"

interface InputEmailProps {
  value: string
  role: CollaboratorRole["id"]
  roles: CollaboratorRole[]
  onChange: (value: string) => void
  onRoleChange: (role: CollaboratorRole["id"]) => void
  onSubmit: () => void
}

export function InputEmail({
  value,
  role,
  roles,
  onChange,
  onRoleChange,
  onSubmit,
}: InputEmailProps) {

  return (
    <div className="grid gap-4 md:grid-cols-[minmax(0,1fr)_240px_auto]">
      <div className="space-y-2">
        <label
          htmlFor="collaborator-email"
          className="text-sm font-medium text-foreground"
        >
          Adresse e-mail
        </label>

        <div
          className="
            flex h-11 items-center gap-3 rounded
            border border-border bg-background px-3
            transition-colors
            focus-within:border-accent
            focus-within:ring-2
            focus-within:ring-accent/20
          "
        >
          <Mail className="size-4 shrink-0 text-muted-foreground" />

          <input
            id="collaborator-email"
            type="email"
            value={value}
            onChange={(event) => onChange(event.target.value)}
            placeholder="nom@exemple.com"
            autoComplete="email"
            className="
              min-w-0 flex-1 bg-transparent
              text-sm text-foreground
              outline-none
              placeholder:text-muted-foreground
            "
          />
        </div>
      </div>

      <div className="space-y-2">
        <label
          htmlFor="collaborator-email-role"
          className="text-sm font-medium text-foreground"
        >
          Rôle
        </label>

        <select
          id="collaborator-email-role"
          value={role}
          onChange={(event) =>
            onRoleChange(
              event.target.value as CollaboratorRole["id"],
            )
          }
          className="
            h-11 w-full rounded border border-border
            bg-background px-3 text-sm text-foreground
            outline-none
            focus:border-accent
            focus:ring-2 focus:ring-accent/20
          "
        >
          {roles.map((item) => (
            <option key={item.id} value={item.id}>
              {item.label}
            </option>
          ))}
        </select>
      </div>

      <div className="flex items-end">
        <ButtonWithIcon
          type="button"
          variant="primary"
          icon={Mail}
          onClick={onSubmit}
          disabled={!value.trim()}
          className="w-full md:w-auto"
        >
          Envoyer l'invitation
        </ButtonWithIcon>
      </div>
    </div>
  )
}