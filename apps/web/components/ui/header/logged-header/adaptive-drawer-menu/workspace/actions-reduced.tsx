import { motion } from "framer-motion"
import { Button } from "@/components/ui/button"
import { Crown, Headphones } from "lucide-react"
import WorkspaceActions from "./actions"
import { useTranslations } from "next-intl"
import { DrawerMenuActionKey } from "../menu-data"

export default function WorkspaceActionsReduced({
  onActionClick,
  onPlansClick,
  onHelpClick,
}: {
  onActionClick?: (key: DrawerMenuActionKey) => void
  onPlansClick?: () => void
  onHelpClick?: () => void
}) {

  const t = useTranslations("Header.Logged.DrawerMenu.Workspace")

  return (
    <motion.div
      key="collapsed-menu"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.12 }}
      className="flex flex-col items-center gap-1 py-4"
    >
      <WorkspaceActions
        onActionClick={onActionClick}
      />

      <div className="my-2 h-px w-8 bg-border" />

      <Button
        type="button"
        variant="ghost"
        size="icon"
        title={t("SubscriptionAria")}
        aria-label={t("SubscriptionAria")}
        onClick={onPlansClick}
      >
        <Crown
          className="size-5"
          aria-hidden="true"
        />
      </Button>

      <Button
        type="button"
        variant="ghost"
        size="icon"
        title={t("HelpAria")}
        aria-label={t("HelpAria")}
        onClick={onHelpClick}
      >
        <Headphones
          className="size-5"
          aria-hidden="true"
        />
      </Button>
    </motion.div>
  )
}