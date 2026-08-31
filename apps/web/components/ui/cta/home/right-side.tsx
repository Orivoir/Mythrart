import { EditorPreview as CTAPreviewEditor } from "@/components/ui/cta/editor-preview"
import React from "react"

export function RightSide() {
  return (
    <React.Fragment>
      <div className="
        hidden
        md:flex
        flex-col
        gap-4
        xl:flex-1
        w-full
      ">
        <CTAPreviewEditor />
      </div>

        <div className="
        md:hidden
        flex
        flex-col
        gap-4
        xl:flex-1
        w-full
      ">
        <CTAPreviewEditor small />
      </div>
    </React.Fragment>
  )
}