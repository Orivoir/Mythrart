import {Button} from "@/components/ui/button"
import { useDrawerMenuActions } from "./../menu-data"
import type {DrawerMenuActionKey} from "./../menu-data"
export default function WorkspaceActions({
  onActionClick
}: {
  onActionClick?: (key: DrawerMenuActionKey) => void
}) {

  const drawerMenuActions = useDrawerMenuActions()

  return (
    <>
    {drawerMenuActions.map((action) => (
      <Button
        key={action.key}
        type="button"
        variant="ghost"
        size="icon"
        title={action.label}
        aria-label={action.label}
        onClick={() =>
          onActionClick?.(action.key)
        }
      >
        <action.icon
          className="size-5"
          aria-hidden="true"
        />
      </Button>
    ))}
    </>
  )
}