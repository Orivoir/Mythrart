"use client"
// import ProjectWorkspace from "./project-workspace"
import { useProject } from "@/components/hooks/queries/use-project"
import { ProjectProvider } from "@/components/contexts/ProjectContext"
import ProjectWorkspace from "./workspace";

export interface ProjectProps {
  id: string;
}

export default function Project({ id }: ProjectProps) {

  const { data: project, isPending, isError, error } = useProject(id)

  if(isError) {
    return <div>Error: {error?.message}</div>
  }

  if(isPending) {
    return <div>Loading...</div>
  }

  return (
    <ProjectProvider workingIn={project}>
      <ProjectWorkspace />
    </ProjectProvider>
  )

}