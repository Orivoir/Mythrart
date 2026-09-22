import { BookOpen, Plus } from "lucide-react"
import { ButtonWithIcon } from "@/components/ui/button-with-icon"
import { HelperText, Title } from "@/components/ui/Typography"

export default function ProjectLeftPanelEmpty() {

  return (
    <div
      className="
        flex
        min-h-0
        flex-1
        flex-col
        items-center
        justify-center
        mt-24
        px-5
        text-center
      "
    >
      <div className="mb-5">
        <BookOpen className="size-9 stroke-[1.5]" />
      </div>

      <Title>
        Votre histoire commence ici
      </Title>

      <HelperText className="mt-2 max-w-[210px] leading-5">
        Ajoutez des chapitres pour structurer votre récit.
      </HelperText>

      <ButtonWithIcon
        type="button"
        variant="accent"
        icon={Plus}
        iconSize="lg"
        className="mt-5"
      >
        Nouveau chapitre
      </ButtonWithIcon>
    </div>
  )
}