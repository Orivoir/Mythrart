"use client"

import { useWorkMode } from "@/components/hooks/use-work-mode"

import ProjectRightNav from "@/components/ui/project-work/right-nav"
import ProjectWorkLayoutRoot from "@/components/ui/project-work/layout/root"
import ProjectLeftPanel from "@/components/ui/project-work/left-panel"

export default function ProjectWorkspace() {
  const project = useWorkMode()


  return (
    <ProjectWorkLayoutRoot>

      {/* Project navigation */}
      <ProjectRightNav />

      {/* Left Panel */}
      <ProjectLeftPanel />

      {/* Editor */}
      <main className="min-w-0 flex-1">
        {/* EditorToolbar */}
        {/* EditorHeader */}
        {/* EditorContent */}
        {/* EditorEmpty */}
        {/* EditorMetadata */}
      </main>

      {/* Right Panel */}
      <aside>
        {/* Project / Entities / Analysis */}
      </aside>
    </ProjectWorkLayoutRoot>
  )
}