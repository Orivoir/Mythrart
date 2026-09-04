export type AvatarSize = "xs" | "sm" | "md" | "lg" | "xl" | "2xl"

export const sizeClasses: Record<AvatarSize, string> = {
  xs: "size-5 text-[10px]",
  sm: "size-6 text-xs",
  md: "size-8 text-sm",
  lg: "size-10 text-base",
  xl: "size-12 text-lg",
  "2xl": "size-16 text-xl",
}