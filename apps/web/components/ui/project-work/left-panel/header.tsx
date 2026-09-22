import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";
import { Title } from "@/components/ui/Typography";

export default function ProjectLeftPanelHeader({type}: {type: "chapters" | "scenes"}) {

  return (
    <div
      className="
        flex
        h-[62px]
        shrink-0
        items-center
        justify-between
        border-b
        border-border
        px-5
      "
    >
      <Title>
        {type === "chapters" ? "Chapitres" : "Scènes"}
      </Title>

      <Button
        type="button"
        variant="ghost"
        size="icon"
        aria-label="Nouveau chapitre"
      >
        <Plus className="size-5 text-accent" />
      </Button>
    </div>
  )
}