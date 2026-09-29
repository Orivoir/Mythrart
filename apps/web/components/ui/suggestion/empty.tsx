import { HelperText } from "../Typography"
import { ButtonWithIcon } from "@/components/ui/button-with-icon"
import { Plus } from "lucide-react"

export default function EmptySuggestion() {

  return (
    <div className="flex flex-col gap-4 bg-soft-blue/40 p-4 rounded">
      <HelperText>
        You're a not entities for now.
      </HelperText>
      <ButtonWithIcon icon={Plus} iconSize="md" variant="primary" size="sm">
        Add New
      </ButtonWithIcon>
    </div>
  )
}