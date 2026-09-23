"use client"

import ProjectLeftPanelChaptersSection from "./chapters-section"
import ProjectLeftPanelScenesSection from "./scenes-section"

import ProjectLeftPanelHeader from "./header"

export default function ProjectLeftPanel() {

  return (
    <aside
      className="
        flex
        h-[calc(100vh-64px)]
        w-[282px]
        shrink-0
        flex-col
        border-r
        border-border
        bg-soft-blue/30
      "
    >

      {/* Chapters */}
      <ProjectLeftPanelHeader type="chapters" />

      <div className="flex min-h-0 flex-1 flex-col px-3 py-3">
        <ProjectLeftPanelChaptersSection />
      </div>


        {/* Scenes */}
        <ProjectLeftPanelHeader type="scenes" />

        <div className="flex min-h-0 flex-1 flex-col px-3 py-3">
          <ProjectLeftPanelScenesSection />
        </div>
    </aside>
  )
}