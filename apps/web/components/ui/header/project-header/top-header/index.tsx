"use client"
import { useSession } from "next-auth/react"
import type { CreateEbookResponseAPI } from "@/app/types/api/ebook"
//import { UserAvatarMenu } from "@/components/ui/header/logged-header/adaptive-top-header/user-avatar-menu"
import { UserAvatarMenu } from "@/components/ui/header/logged-header/adaptive-top-header/user-avatar-menu"

import LayoutLogo from "./layout-logo"
import SelectProject from "./select-project"
import SelectChapterLocale from "./select-chapter-locale"
import SaveState from "./save-state"

export type ProjectTopHeaderProps = CreateEbookResponseAPI & {} 

export function ProjectTopHeader({
  createdAt,
  id,
  title,
  updatedAt,
  shortDescription,
  subtitle, // optional
}: ProjectTopHeaderProps) {

  const {data: session} = useSession()

  if(!session?.user) {
    return null
  }

  const user = session.user

  return (
    <header
      className="
        flex
        h-16
        w-full
        shrink-0
        items-center
        border-b
        border-border
        bg-background
        px-4
        md:px-6
      "
    >
      <LayoutLogo />

      <SelectProject title={title} />

      <SelectChapterLocale />

      {/* Spacer */}
      <div className="min-w-0 flex-1" />

      <SaveState updatedAt={updatedAt} />

      {/* User */}
      <div
        className="
          shrink-0
          border-l
          border-border
          pl-4
        "
      >
        <UserAvatarMenu user={{
          email: user.email || "sample@gmail.com",
          id: user.id,
          name: user.name || "John doe",
          image: user.image,
          plan: user.plan ?? "free",
          subscriptionStatus: user.subscriptionStatus ?? "none"
        }} subscription={{
          status: user.subscriptionStatus,
          type: user.plan ?? "free"
        }} />
      </div>
    </header>
  )
}