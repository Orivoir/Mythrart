import { Mail, Smartphone } from "lucide-react"
import { IconSurface } from "../../ui/icon-surface"

export function FormHeaderIcon({type}: {type: "email" | "phone"}) {

  return (
    <IconSurface>
      {type === "email" ? (
        <Mail className="text-accent" size={24} />
      ) : (
        <Smartphone className="text-accent" size={24} />
      )}
    </IconSurface>
  )
}