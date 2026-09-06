"use client"

import type {
  Subscription,
  User,
} from "@/components/api/types"
import { AppLink } from "@/components/ui/app-link"
import { BrandName } from "@/components/ui/brand/brand-name"
import { Notification } from "@/components/ui/notifications"
import { VoiceRecorder } from "@/components/ui/voice-recording"

import { UserAvatarMenu } from "./user-avatar-menu"

export type CompanionTopHeaderProps = {
  user?: User
  subscription?: Subscription
  notificationsCount?: number
  onNotificationsClick?: () => void
  onVoiceStart?: () => void
  onVoiceRecordFinish?: (voice: Blob) => void
}

export function CompanionTopHeader({
  user,
  subscription,
  notificationsCount = 0,
  onNotificationsClick,
  onVoiceStart,
  onVoiceRecordFinish,
}: CompanionTopHeaderProps) {
  return (
    <header
      className="
        sticky
        top-0
        z-30
        flex
        h-16
        w-full
        items-center
        justify-between
        gap-4
        border-b
        border-border
        bg-background
        px-4
      "
    >
      <AppLink
        href="/dashboard"
        mutedOnHover={false}
        className="shrink-0"
      >
        <BrandName size="sm" />
      </AppLink>

      <VoiceRecorder
        size="xs"
        className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2"
        onStart={onVoiceStart}
        onRecordFinish={onVoiceRecordFinish}
      />

      <div className="flex shrink-0 items-center gap-1">
        <Notification
          count={notificationsCount}
          onClick={onNotificationsClick}
        />

        <UserAvatarMenu
          user={user}
          subscription={subscription}
        />
      </div>
    </header>
  )
}
