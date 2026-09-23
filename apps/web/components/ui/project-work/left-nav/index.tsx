"use client"
import Link from "next/link"
import NavItem from "./item"
import { cn } from "@/lib/utils"
import {navigation} from "./navigation"
import { HelpCircle } from "lucide-react"

export type ProjectLeftNavProps = {
  className?: string
}

export default function ProjectLeftNav({
  className,
}: ProjectLeftNavProps) {

  return (
    <nav
      aria-label="Navigation du projet"
      className={cn(
        "flex h-[calc(100vh-64px)] w-[70px] shrink-0 flex-col",
        "border-r border-border bg-background",
        className,
      )}
    >
      <div className="flex flex-col items-center gap-2 py-5">
        {navigation.map((props, index) => (
          <NavItem key={index} {...props} />
        ))}
      </div>

      <div className="mt-auto flex justify-center pb-5">
        <Link
          href="#"
          aria-label="Aide"
          title="Aide"
          className="
            flex size-10 items-center justify-center rounded-lg
            text-foreground/70 transition-colors
            hover:bg-primary/10 hover:text-primary
          "
        >
          <HelpCircle className="size-5" />
        </Link>
      </div>
    </nav>
  )
}