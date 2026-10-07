"use client"

import type { LucideIcon } from "lucide-react"
import { ChevronRightIcon } from "lucide-react"
import { motion } from "framer-motion"

import { Title, HelperText } from "@/components/ui/Typography"
import { AppLink } from "@/components/ui/app-link"

export interface CardArticleProps {
  title: string
  description: string
  color: "accent" | "primary" | "success" | "warning"
  icon: LucideIcon
  href: string
  linkTitle?: string
}

const colorStyles = {
  accent: {
    background: "bg-accent/10",
    icon: "text-accent",
    hoverBackground: "bg-accent/10",
    hoverBorder: "border-accent/40",
    color: "var(--accent)",
  },
  primary: {
    background: "bg-primary/10",
    icon: "text-primary",
    hoverBackground: "bg-primary/10",
    hoverBorder: "border-primary/40",
    color: "var(--primary)",
  },
  success: {
    background: "bg-success/10",
    icon: "text-success",
    hoverBackground: "bg-success/10",
    hoverBorder: "border-success/40",
    color: "var(--success)",
  },
  warning: {
    background: "bg-warning/10",
    icon: "text-warning",
    hoverBackground: "bg-warning/10",
    hoverBorder: "border-warning/40",
    color: "var(--warning)",
  },
} satisfies Record<
  CardArticleProps["color"],
  {
    background: string
    icon: string
    hoverBackground: string
    hoverBorder: string
    color: string
  }
>

function getColorStyle(color: CardArticleProps["color"]) {
  return colorStyles[color]
}

const cardVariants = {
  initial: {
    backgroundColor: "var(--background)",
    borderColor: "var(--border)",
  },
  hover: {
    backgroundColor:
      "color-mix(in srgb, var(--card-color) 10%, var(--background))",
    borderColor:
      "color-mix(in srgb, var(--card-color) 30%, var(--border))",
  },
}

const chevronVariants = {
  initial: {
    opacity: 0,
    x: -5,
  },
  hover: {
    opacity: 1,
    x: 0,
  },
}

export default function CardArticle({
  title,
  description,
  color,
  icon: Icon,
  href,
  linkTitle = "You do not leave Mythrart",
}: CardArticleProps) {
  const styles = getColorStyle(color)

  return (
    <AppLink title={linkTitle} href={href} className="block">
      <motion.div
        initial="initial"
        whileHover="hover"
        variants={cardVariants}
        transition={{
          duration: 0.2,
          ease: "easeOut",
        }}
        style={{
          "--card-color": styles.color,
        } as React.CSSProperties}
        className="
          group flex min-h-[110px] w-full items-center gap-3
          rounded-lg border
          p-6
        "
      >
        <div className="flex min-w-0 max-w-[320px] flex-1 items-start gap-3">
          <div
            className={`
              flex size-10 shrink-0 items-center justify-center
              rounded-md
              ${styles.background}
            `}
          >
            <Icon
              className={`size-5 ${styles.icon}`}
              strokeWidth={2}
            />
          </div>

          <div className="flex min-w-0 flex-col gap-3 pt-0.5">
            <Title className="truncate font-semibold">
              {title}
            </Title>

            <HelperText className="mt-1 line-clamp-2 leading-[1.35]">
              {description}
            </HelperText>
          </div>
        </div>

        <motion.div
          variants={chevronVariants}
          transition={{
            duration: 0.2,
            ease: "easeOut",
          }}
          className="ml-auto shrink-0"
        >
          <ChevronRightIcon
            className={`size-4 ${styles.icon}`}
            strokeWidth={2}
          />
        </motion.div>
      </motion.div>
    </AppLink>
  )
}