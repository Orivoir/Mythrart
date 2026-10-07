import ProjectItemSkeleton from "@/components/ui/project-item/skeleton"
import ProjectListLayout from "./layout"
import React from "react"

export interface ProjectDashboardLoadingProps {
  withLayout?: boolean
  count?: number
}

export default function ProjectDashboardLoading({
  withLayout = true,
  count = 8
}: ProjectDashboardLoadingProps) {


  const skeletonsRendered = Array.from({ length: count }, (_, i) => <ProjectItemSkeleton key={i} />)

  const RootComponent = withLayout ? ProjectListLayout: React.Fragment

  return (
    <RootComponent>
      {skeletonsRendered}
    </RootComponent>
  )
}