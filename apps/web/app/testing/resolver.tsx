"use client"
import ProjectWorkspace from "./project-workspace"
import { useProject } from "@/components/hooks/queries/use-project"

import { ProjectProvider } from "@/components/contexts/ProjectContext"

const PROJECT_ID_FIXTURE = "cmumljgvb0000ibm99m8yv5yq"

export default function Resolver() {

  const { data: project, isLoading, error } = useProject(PROJECT_ID_FIXTURE)

  if(isLoading || !project) {

    return (
      <div>
        <h1>Loading...</h1>
        <p>Please wait while the project is being loaded.</p>
      </div>
    )
  }

  if(error) {

    return  (
      <div className="flex justify-end flex-col gap-1 bg-soft-blue/40">
        <h1>Error</h1>
        <p>There was an error loading the project.</p>
        <pre>
          {JSON.stringify(error, null, 2)}
        </pre>
      </div>
    )
  }


  return (
    <ProjectProvider workingIn={project}>
      <ProjectWorkspace />
    </ProjectProvider>
  )
}