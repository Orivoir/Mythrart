"use client"

import * as Accordion from "@radix-ui/react-accordion"
import { ChevronDown } from "lucide-react"
import { cn } from "@/lib/utils"

type AccordionItemProps = Accordion.AccordionItemProps & {
  icon?: React.ReactNode
  title: string
}

export default function AccordionItem({
  icon,
  title,
  value,
  children,
  className,
  ...props
}: AccordionItemProps) {
  return (
    <Accordion.Item
      value={value}
      className={cn(
        "rounded-lg border border-border bg-background",
        className,
      )}
      {...props}
    >
      <Accordion.Header>
        <Accordion.Trigger
          className="
            group
            flex w-full items-center justify-between
            px-4 py-3
            text-left
          "
        >
          <span className="flex items-center gap-3">
            {icon}

            <span className="font-medium">
              {title}
            </span>
          </span>

          <ChevronDown
            className="
              size-4
              shrink-0
              transition-transform
              duration-200
              group-data-[state=open]:rotate-180
            "
          />
        </Accordion.Trigger>
      </Accordion.Header>

      <Accordion.Content
        className="
          overflow-hidden
          data-[state=closed]:animate-accordion-up
          data-[state=open]:animate-accordion-down
        "
      >
        <div className="px-4 pb-4">
          {children}
        </div>
      </Accordion.Content>
    </Accordion.Item>
  )
}