"use client"

import { ChevronRight } from "lucide-react"

import type {
  Subscription,
  User,
} from "@/components/api/types"

import Avatar from "@/components/ui/avatar"
import { Chip } from "@/components/ui/chip"

import { getPlanLabel } from "./utils"

export interface UserMenuIdentityProps {
  user?: User
  subscription?: Subscription
}

export function UserMenuIdentity({
  user,
  subscription,
}: UserMenuIdentityProps) {
  if (!user) {
    return (
      <div className="flex items-center gap-3">
        <div
          className="
            size-12
            shrink-0
            animate-pulse
            rounded-full
            bg-muted
          "
        />

        <div className="min-w-0 flex-1 space-y-2">
          <div
            className="
              h-4
              w-28
              animate-pulse
              rounded-sm
              bg-muted
            "
          />

          <div
            className="
              h-3
              w-40
              animate-pulse
              rounded-sm
              bg-muted
            "
          />

          <div
            className="
              h-5
              w-20
              animate-pulse
              rounded-full
              bg-muted
            "
          />
        </div>

        <ChevronRight
          className="size-4 shrink-0 text-muted-foreground"
          aria-hidden="true"
        />
      </div>
    )
  }

  return (
    <div className="flex items-center gap-3">
      <Avatar
        image={user.image ?? undefined}
        email={user.email}
        alt={user.name}
        size="lg"
      />

      <div className="min-w-0 flex-1">
        <p className="truncate text-sm font-semibold">
          {user.name}
        </p>

        <p className="truncate text-xs text-muted-foreground">
          {user.email}
        </p>

        <div className="mt-2">
          {subscription ? (
            <Chip className="px-2 py-0.5 text-xs">
              {getPlanLabel(subscription)}
            </Chip>
          ) : (
            <div
              className="
                h-5
                w-20
                animate-pulse
                rounded-full
                bg-muted
              "
            />
          )}
        </div>
      </div>

      <ChevronRight
        className="size-4 shrink-0 text-muted-foreground"
        aria-hidden="true"
      />
    </div>
  )
}