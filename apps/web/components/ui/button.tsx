import * as React from "react"
import { Slot } from "@radix-ui/react-slot"
import { cn } from "@/lib/utils"


type ButtonVariant =
  | "default"
  | "outline"
  | "ghost"
  | "accent"
  | "accent-outline"
  |  "primary"
  |  "primary-outline"

type ButtonSize =
  | "default"
  | "sm"
  | "lg"
  | "full"


interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: ButtonVariant
  size?: ButtonSize
  asChild?: boolean
}


const variantStyles: Record<ButtonVariant, string> = {
  default:
    [
      "bg-primary text-primary-foreground",
      "hover:bg-primary/90",
    ].join(" "),

  outline:
    [
      "border border-primary/20",
      "text-primary",
      "bg-transparent",
      "hover:bg-primary/5",
    ].join(" "),

    primary:
    [
      "bg-primary text-surface",
      "hover:bg-primary/90",
    ].join(" "),

    "primary-outline":
    [
      "border border-primary-variant/20",
      "text-primary-variant",
      "bg-transparent",
      "hover:bg-primary-variant/5",
    ].join(" "),

  accent:
    [
      "bg-accent text-accent-foreground",
      "hover:bg-accent/95",
    ].join(" "),

  "accent-outline":
    [
      "border border-accent/20",
      "text-accent",
      "bg-transparent",
      "hover:bg-accent/7",
    ].join(" "),

  ghost:
    [
      "text-foreground",
      "hover:bg-muted/5",
    ].join(" "),
}

const sizeStyles: Record<ButtonSize, string> = {
  default:
    "h-10 px-4 py-2 rounded-sm",

  sm:
    "h-9 rounded-sm px-3 text-sm",

  lg:
    "h-12 rounded-sm px-8 text-base",

  full:
    "h-12 w-full rounded-sm px-8 text-base",
}


export function Button({
  className,
  variant = "default",
  size = "default",
  asChild = false,
  ...props
}: ButtonProps) {

  const Comp = asChild ? Slot : "button"

  return (
    <Comp
        className={cn(
        "inline-flex items-center justify-center",
        "whitespace-nowrap",
        "rounded-lg",
        "font-medium",
        "cursor-pointer",
        "transition-colors duration-150",
        "focus-visible:outline-none",
        "focus-visible:ring-2 focus-visible:ring-primary/30",
        "disabled:pointer-events-none disabled:opacity-50",
        variantStyles[variant],
        sizeStyles[size],
        className
        )}
      {...props}
    />
  )
}