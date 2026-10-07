"use client"

import { useProjectList } from "@/components/hooks/queries/use-project-list"
import SeoArticles from "@/components/ui/project-dashboard/seo-articles"
import ProjectDashboardEmpty from "@/components/ui/project-dashboard/empty"
import ProjectDashboardLoading from "@/components/ui/project-dashboard/loading"
import ProjectListLayout from "@/components/ui/project-dashboard/layout"
import ProjectItem from "@/components/ui/project-item"
import ProjectDashboardEmptyBanner from "@/components/ui/project-dashboard/empty/banner"

export default function Dashboard() {
  const {
    data: projectsList,
    isPending,
    isError,
    error,
  } = useProjectList()

  if (isPending) {
    return <ProjectDashboardLoading />
  }

  if (isError) {
    return (
      <p>
        Error: {error?.message ?? JSON.stringify(error)}
      </p>
    )
  }

  if (!projectsList.items.length) {
    return <ProjectDashboardEmpty />
  }

  const withBanner = projectsList.items.length < 3

  return (
    <div className="flex flex-col gap-24">
      <ProjectListLayout>
        {projectsList.items.map((project) => (
          <ProjectItem
            key={project.id}
            {...project}
          />
        ))}

        {withBanner && (
          <ProjectDashboardEmptyBanner />
        )}
      </ProjectListLayout>

      <SeoArticles />
    </div>
  )
}