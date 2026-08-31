import { LeftSide as CTALeftSide } from "@/components/ui/cta/home/left-side"
import { RightSide as CTARightSide } from "@/components/ui/cta/home/right-side"
import { SplitLayout } from "@/components/ui/layout/split"

export function HeroContent() {

  return (
    <SplitLayout>
      <CTALeftSide />
      <CTARightSide />
    </SplitLayout>
  )
}