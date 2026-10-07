import { cn } from "@/lib/utils"
import { AppLink } from "@/components/ui/app-link"
import { BrandName } from "@/components/ui/brand/brand-name"
import { AnimatePresence, motion } from "framer-motion"
import { useTranslations } from "next-intl"

export default function WorkspaceHeader({collapsed}: {collapsed: boolean}) {

  const t = useTranslations("Brand")

  return (
    <div
      className={cn(
        "flex h-16 shrink-0 items-center border-b border-border",
        collapsed
          ? "justify-center"
          : "justify-start px-4",
      )}
    >
      <AppLink
        href="/dashboard"
        mutedOnHover={false}
      >
        <AnimatePresence mode="wait" initial={false}>
          {collapsed ? (
            <motion.span
              key="collapsed-brand"
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.8 }}
              transition={{ duration: 0.15 }}
              className="
                flex
                size-8
                items-center
                justify-center
                rounded-full
                bg-primary/10
                text-sm
                font-semibold
                text-primary
              "
              aria-label={t("Name")}
            >
              M
            </motion.span>
          ) : (
            <motion.div
              key="expanded-brand"
              initial={{ opacity: 0, x: -8 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -8 }}
              transition={{ duration: 0.15 }}
            >
              <BrandName size="sm" />
            </motion.div>
          )}
        </AnimatePresence>
      </AppLink>
    </div>
  )
  }