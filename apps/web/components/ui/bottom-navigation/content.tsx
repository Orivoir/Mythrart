import type { LucideIcon } from "lucide-react"
import Active from "./active"
import { Text } from "@/components/ui/Typography"

export default function Content({active, label, icon: Icon}: {active: boolean, label: string, icon: LucideIcon}) {

  return (
    <>
      <Icon
        className="size-5 shrink-0"
        strokeWidth={active ? 2.2 : 1.8}
        aria-hidden="true"
      />

      <Text
        variant={active ? "default" : "muted"}
        className="text-xs font-medium"
      >
        {label}
      </Text>

      <Active visible={active} />
    </>
  )
}