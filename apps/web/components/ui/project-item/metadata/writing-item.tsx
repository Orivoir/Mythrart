import { HelperText } from "@/components/ui/Typography"

export default function WritingItem({text}: {text: string}) {

  return (
    <HelperText className="text-[12px] leading-none text-muted-foreground">
      {text}
    </HelperText>
  )
}