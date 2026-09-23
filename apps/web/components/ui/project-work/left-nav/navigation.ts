import {
  BarChart3,
  FileImage,
  FolderKanban,
  Globe2,
  PenLine,
  Settings,
  Users,
  HatGlasses
} from "lucide-react"
import { ProjectNavItemProps} from "./item"


export const navigation: ProjectNavItemProps[] = [
  { label: "Edit", icon: PenLine },
  { label: "Scenes", icon: FolderKanban },
  { label: "Assets", icon: FileImage },
  { label: "Entities", icon: HatGlasses },
  { label: "Collaborations", icon: Users },
  { label: "Internationalization", icon: Globe2 },
  { label: "Writing Report & Statistics", icon: BarChart3 },
  { label: "Settings", icon: Settings }
]
