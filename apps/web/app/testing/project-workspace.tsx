"use client"

import { useWorkMode } from "@/components/hooks/use-work-mode"

import {EditorProvider} from "@tiptap/react"
import {extensions} from "@mythrart/editor-extensions"

import ProjectLeftNav from "@/components/ui/project-work/left-nav"
import ProjectWorkLayoutRoot from "@/components/ui/project-work/layout/root"
import ProjectLeftPanel from "@/components/ui/project-work/left-panel"
import ProjectRightPanel from "@/components/ui/project-work/right-panel"

export default function ProjectWorkspace() {
  const project = useWorkMode()


  return (
    <EditorProvider extensions={extensions}>
      <ProjectWorkLayoutRoot>

        {/* Project navigation */}
        <ProjectLeftNav />

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
          <ProjectRightPanel />
        </aside>
      </ProjectWorkLayoutRoot>
    </EditorProvider>
  )
}