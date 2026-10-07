"use client"

import { useState } from "react"
import { AnimatePresence, motion } from "framer-motion"
import { cn } from "@/lib/utils"
import { Title, HelperText } from "@/components/ui/Typography"

import PromoBannerActions, {
  type PromoBannerAction,
} from "./actions"
import PromoBannerHeader from "./header"
import PromoBannerLayout from "./layout"
import { PROMO_BANNER_THEMES } from "./theme"

export type PromoBannerVariant =
  | "guide"
  | "relations-entities"

export interface PromoBannerProps {
  canDismiss?: boolean
  label: string
  title: string
  describe: string

  actions: {
    main: PromoBannerAction
    second?: PromoBannerAction
  }

  variant?: PromoBannerVariant
  widthFull?: boolean
  classNameRoot?: string
}

export default function PromoBanner({
  canDismiss = false,
  label,
  title,
  describe,
  actions,
  variant = "guide",
  widthFull = false,
  classNameRoot,
}: PromoBannerProps) {
  const [visible, setVisible] = useState(true)

  const theme = PROMO_BANNER_THEMES[variant]

  return (
    <AnimatePresence initial={false}>
      {visible && (
        <motion.div
          initial={{
            opacity: 1,
            y: 0,
            scale: 1,
          }}
          exit={{
            opacity: 0,
            y: -6,
            scale: 0.98,
          }}
          transition={{
            duration: 0.2,
            ease: "easeOut",
          }}
          className={cn(
            "h-full",
            !widthFull && "w-fit",
            classNameRoot,
          )}
        >
          <PromoBannerLayout
            theme={theme}
            header={
              <PromoBannerHeader
                label={label}
                labelClassName={theme.label}
                canDismiss={canDismiss}
                onDismiss={() => setVisible(false)}
              />
            }
          >
            <div className="flex flex-col items-start">
              <div className="max-w-[430px]">
                <Title className="text-base leading-tight sm:text-[26px] font-bold mb-4">
                  {title}
                </Title>

                <HelperText className="mt-1.5 max-w-[250px] text-[14px] leading-[1.6]">
                  {describe}
                </HelperText>
              </div>

            </div>

            <div className="mt-18">
              <PromoBannerActions
                main={actions.main}
                second={actions.second}
                mainClassName={theme.mainAction}
                secondClassName={theme.secondAction}
              />
            </div>
          </PromoBannerLayout>
        </motion.div>
      )}
    </AnimatePresence>
  )
}