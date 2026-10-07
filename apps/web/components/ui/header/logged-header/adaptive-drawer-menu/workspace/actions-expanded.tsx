import type {DrawerMenuActionKey} from "./../menu-data"
import type { DrawerMenuSectionsProps } from "./../menu-sections"
import { DrawerMenuSections } from "./../menu-sections"
import { motion } from "framer-motion"


export interface WorkspaceActionsExpandedProps extends DrawerMenuSectionsProps {
  onActionClick?: (key: DrawerMenuActionKey) => void
  onPlansClick?: () => void
  onHelpClick?: () => void
  userId?: string
}

export default function WorkspaceActionsExpanded(props: WorkspaceActionsExpandedProps) {

  return (
    <motion.div
      key="expanded-menu"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.15 }}
    >
      <DrawerMenuSections
        {...props}
      />
    </motion.div>
  )

}