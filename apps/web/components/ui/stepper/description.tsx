import { Text } from "@/components/ui/Typography"

export type StepDescriptionProps = {
  description?: string
}

export function StepDescription({
  description,
}: StepDescriptionProps) {
  if (!description) {
    return null
  }

  return (
    <div className="mt-2 pl-11">
      <Text variant="muted">
        {description}
      </Text>
    </div>
  )
}