import { UnderlineBox } from "@/components/ui/layout/underline-box"
import PreviousButton from "./previous-button"
import Title from "./title"

export default function ChapterHeader({position}  : {position: number}) { 
  return (
    <UnderlineBox underline={{
      color: "var(--accent)",
      stroke: 3,
      gap: .5,
      width: 6 + String(position).length * 0.5,
      position: "start",
      offset: {
        left: 1
      }
    }}
    className="flex flex-row gap-1 items-center"
    >
      <PreviousButton position={position - 1} />
      <Title position={position} />
    </UnderlineBox>
  )
}