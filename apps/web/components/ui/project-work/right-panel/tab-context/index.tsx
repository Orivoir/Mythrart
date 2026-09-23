import LayoutTab from "@/components/ui/project-work/layout/tab"
import * as Accordion from "@radix-ui/react-accordion"
import AccordionItem from "@/components/ui/accordion-item"
import { BookOpen, FileText, BarChart3, Sparkles } from "lucide-react"
import ChapterTabContent from "@/components/ui/project-work/right-panel/tab-context/chapter"

export default function ProjectWorkRightPanelTabContext() {

  return (
    <LayoutTab>
      <Accordion.Root
        type="multiple"
        defaultValue={["chapter", "scene"]}
        className="flex flex-col gap-3"
      >
        <AccordionItem
          value="chapter"
          title="Chapitre en cours"
          icon={<BookOpen className="size-5 text-primary" />}
        >
          <ChapterTabContent />
        </AccordionItem>

        <AccordionItem
          value="scene"
          title="Scène en cours"
          icon={<FileText className="size-5 text-primary" />}
        >
          <>Scene content</>
        </AccordionItem>

        <AccordionItem
          value="statistics"
          title="Statistiques d'écriture"
          icon={<BarChart3 className="size-5 text-primary" />}
        >
          <>Statistics content</>
        </AccordionItem>

        <AccordionItem
          value="realtime-analysis"
          title="Analyse en temps réel"
          icon={<Sparkles className="size-5 text-primary" />}
        >
          <>Realtime analysis content</>
        </AccordionItem>
      </Accordion.Root>
    </LayoutTab>
  )
}