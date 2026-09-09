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
    <div className="mt-0 pl-10">
      <Text className="text-xs" variant="muted">
        {description}
      </Text>
    </div>
  )
}