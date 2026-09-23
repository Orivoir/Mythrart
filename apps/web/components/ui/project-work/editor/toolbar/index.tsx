import EditorToolbarLayout from "@/components/ui/project-work/layout/editor/toolbar"
import { EditorToolbarGroup } from "@/components/ui/project-work/layout/editor/toolbar-group"

export default function EditorToolbar() {

  return (
    <EditorToolbarLayout>
      <EditorToolbarGroup>
        {/* Action Text style */}
        <></>
      </EditorToolbarGroup>

      <EditorToolbarGroup>
        {/* Action Undo */}
        <></>
        {/* Action Redo */}
        <></>
      </EditorToolbarGroup>

      <EditorToolbarGroup>
        {/* Action Bold */}
        <></>
        {/* Action Italic */}
        <></>
        {/* Action underline */}
        <></>
        {/* Action Strikethrough */}
        <></>
      </EditorToolbarGroup>

      <EditorToolbarGroup>
        {/* Action Bullet list */}
        <></>
        {/* Action ordered list */}
        <></>
        {/* Action List Indent */}
        <></>
      </EditorToolbarGroup>

      <EditorToolbarGroup>
        {/* Action Link */}
        <></>
        {/* Action Image */}
        <></>
        {/* Action Mention */}
        <></>
        {/* Action Blockquote */}
        <></>
        {/* Action more */}
        <></>
      </EditorToolbarGroup>
    </EditorToolbarLayout>
  )
}