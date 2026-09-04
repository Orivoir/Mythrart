import type { LucideIcon } from "lucide-react"
import {
  BookOpen,
  FileText,
  Image,
  Search,
  Users,
} from "lucide-react"
import type { SuggestionResource } from "./types"

export const suggestionResourceIcons: Record<
  SuggestionResource,
  LucideIcon
> = {
  authors: Users,
  ebooks: BookOpen,
  chapters: FileText,
  "recent-searches": Search,
  assets: Image,
}