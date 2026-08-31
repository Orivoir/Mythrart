import {TitleHome as CTATitle} from "@/components/ui/cta/title-home"
import {SubtitleHome as CTASubtitle} from "@/components/ui/cta/subtitle-home"
import { ChipNoInstall as CTANoInstallChip } from "@/components/ui/cta/chip-no-install"
import { ActionButtonHome as CTAActionButton } from "@/components/ui/cta/actions-button-home"
import { ListMarketing as CTAListMarketing } from "@/components/ui/cta/list-marketing"

export function LeftSide() {
  return (
    <div className="
      flex
      flex-col
      gap-8
      xl:flex-1
      w-full
    ">  
      <CTANoInstallChip />
      <CTATitle />
      <CTASubtitle />
      <CTAActionButton />
      <CTAListMarketing />
    </div>
  )
}