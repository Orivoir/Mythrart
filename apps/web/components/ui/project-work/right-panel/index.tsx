"use client"

import { Tabs } from "@radix-ui/themes"

import ProjectRightPanelContext from "./tab-context"
import ProjectRightPanelAnalysis from "./tab-analysis"
import ProjectRightPanelNotes from "./tab-notes"

export default function ProjectRightPanel() {
  return (
    <aside className="
        flex
        h-full
        w-[330px]
        shrink-0
        flex-col
        border-l
        border-border
        bg-background
    ">
      <Tabs.Root
        defaultValue="context"
        className="flex min-h-0 flex-1 flex-col"
      >
        <Tabs.List>
          <Tabs.Trigger value="context">
            Contexte
          </Tabs.Trigger>

          <Tabs.Trigger value="analysis">
            Analyse
          </Tabs.Trigger>

          <Tabs.Trigger value="notes">
            Notes
          </Tabs.Trigger>
        </Tabs.List>

        <Tabs.Content
          value="context"
          className="min-h-0 flex-1 overflow-y-auto"
        >
          <ProjectRightPanelContext />
        </Tabs.Content>

        <Tabs.Content
          value="analysis"
          className="min-h-0 flex-1 overflow-y-auto"
        >
          <ProjectRightPanelAnalysis />
        </Tabs.Content>

        <Tabs.Content
          value="notes"
          className="min-h-0 flex-1 overflow-y-auto"
        >
          <ProjectRightPanelNotes />
        </Tabs.Content>
      </Tabs.Root>
    </aside>
  )
}