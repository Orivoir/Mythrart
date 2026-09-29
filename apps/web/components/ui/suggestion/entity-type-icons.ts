import {
  CalendarDays,
  CircleHelp,
  MapPin,
  Package,
  UserRound,
  UsersRound,
  type LucideIcon,
} from "lucide-react"

export type EbookEntityType = 
  | "CHARACTER"
  | "LOCATION"
  | "ORGANIZATION"
  | "OBJECT"
  | "EVENT"
  | "OTHER"

export const ebookEntityTypeIcons: Record<EbookEntityType, LucideIcon> = {
  "CHARACTER": UserRound,
  "LOCATION": MapPin,
  "ORGANIZATION": UsersRound,
  "OBJECT": Package,
  "EVENT": CalendarDays,
  "OTHER": CircleHelp,
}