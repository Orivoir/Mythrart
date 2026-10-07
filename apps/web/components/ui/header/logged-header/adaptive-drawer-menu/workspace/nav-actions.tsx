import { AnimatePresence } from "framer-motion"
import WorkspaceActionsReduced from "./actions-reduced"
import WorkspaceActionsExpanded from "./actions-expanded"
import { DrawerMenuActionKey } from "../menu-data"

export default function WorkspaceNavActions({
  collapsed,
  onActionClick,
  onPlansClick,
  onHelpClick,
  userId,
  ...sectionsProps
}: {
  collapsed: boolean
  onActionClick?: (key: DrawerMenuActionKey) => void
  onPlansClick?: () => void
  onHelpClick?: () => void
  userId?: string
  [key: string]: any
}) {

  return (
    <div className="min-h-0 flex-1 overflow-y-auto">
      <AnimatePresence mode="wait" initial={false}>
        {collapsed ? (
          <WorkspaceActionsReduced
            onActionClick={onActionClick}
            onPlansClick={onPlansClick}
            onHelpClick={onHelpClick}
          />
        ) : (
          <WorkspaceActionsExpanded
            onActionClick={onActionClick}
            onPlansClick={onPlansClick}
            onHelpClick={onHelpClick}
            userId={userId}
            {...sectionsProps}
          />
        )}
      </AnimatePresence>
    </div>
  )
}