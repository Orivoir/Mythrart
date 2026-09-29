import EditorToolbarLayout from "@/components/ui/project-work/layout/editor/toolbar"
import { EditorToolbarGroup } from "@/components/ui/project-work/layout/editor/toolbar-group"
import {
  UndoAction,
  RedoAction,
  BoldAction,
  ItalicAction,
  UnderlineAction,
  StrikethroughAction,
  ListAction,
  ListIndentAction,
  LinkAction
} from "./actions"
export default function EditorToolbar() {

  return (
    <EditorToolbarLayout>

      <EditorToolbarGroup>
        {/* Action Text style */}
        <></>
      </EditorToolbarGroup>

      <EditorToolbarGroup>
        <UndoAction />
        <RedoAction />
      </EditorToolbarGroup>

      <EditorToolbarGroup>
        <BoldAction />
        <ItalicAction />
        <UnderlineAction />
        <StrikethroughAction />
      </EditorToolbarGroup>

      <EditorToolbarGroup>
        <ListAction type="unordered" />
        <ListAction type="ordered" />
        <ListIndentAction />
      </EditorToolbarGroup>

      <EditorToolbarGroup>
        <LinkAction />
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