'use client'

import { LoggedHeader, LoggedHeaderProps } from "@/components/ui/header/logged-header"
import { ProjectHeader } from "@/components/ui/header/project-header"

import { useEffect, useState } from "react"
import useWorkMode from "@/components/hooks/custom-events/use-work-mode"

import type { CreateEbookResponseAPI } from "@/app/types/api/ebook"

export type HeaderSwitcherProps = LoggedHeaderProps & {}

export function HeaderSwitcher(props: HeaderSwitcherProps) {

  const [project, setProject] = useState<CreateEbookResponseAPI | null>(null)

  const onStartWorkMode = (event: CustomEvent<CreateEbookResponseAPI>) => {
    setProject(event.detail)
  }

  const removeListener = useWorkMode(onStartWorkMode)

  const onProjectMenuClick = () => {
    console.log("Project menu clicked")
  }

  useEffect(() => {
    return () => {
      removeListener()
    }
  }, [removeListener])


  if(project) {
    return <ProjectHeader {...project} />
  }


  return (
    <LoggedHeader
      user={{
        id: props.user?.id ?? "<no-defined>",
        name: props.user?.name ?? "<no-defined>",
        email: props.user?.email ?? "<no-defined>",
        image: props.user?.image,
        plan: props.user?.plan ?? "free",
        subscriptionStatus: props.user?.subscriptionStatus ?? "none",
      }}
      subscription={{
        type: props.user?.plan ?? "free",
        status: props.user?.subscriptionStatus ?? "none",
      }}
    />
  )
}