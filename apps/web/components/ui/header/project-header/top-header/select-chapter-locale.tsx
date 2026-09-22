"use client"
import { Button } from "@/components/ui/button"
import { ChevronDown, Globe2 } from "lucide-react"
import {Chip} from "@/components/ui/chip"

export default function SelectChapterLocale() {

  const onLocaleMenuClick = () => {
    // fired custom event here:
    // see @/lib/constant/custom-events.ts
  }

  
  return (
      <Button
        type="button"
        onClick={onLocaleMenuClick}
        variant="ghost"
      >
        <Chip>
          <div className="flex items-center gap-2">
            <Globe2 className="size-4" />

            <span>FR</span>
            <ChevronDown className="size-4 shrink-0" />
          </div>
        </Chip>
      </Button>
  )

}