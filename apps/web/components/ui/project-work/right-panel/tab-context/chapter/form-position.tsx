"use client"

import { Input } from "@/components/ui/input"
import { HelperText } from "@/components/ui/Typography"
import {useChaptersList} from "@/components/hooks/queries/use-chapters-list"
import { useProjectContext } from "@/components/hooks/use-project-context"
import { useTranslations } from "next-intl"
import type { SyntheticEvent } from "react"
import { useRef, useEffect } from "react"

export interface FormPositionProps {
  position: number
}

export default function FormPosition({position}: FormPositionProps) {

  const inputRef = useRef<HTMLInputElement>(null)
  const {project: {id}, currentLocale} = useProjectContext()
  const {data: chapters} = useChaptersList(id, currentLocale)
  const t = useTranslations("Workspace.RightPanel.Context.Chapter.Form")

  const totalItems = chapters?.totalItems ?? -1

  const onBlur = (event: SyntheticEvent<HTMLInputElement>) => {
    const value = parseInt(event.currentTarget.value, 10)

    if(position !== value && value > 0 && value <= totalItems) {
      // should allow update position here
      // hooks/queries/use-mutation-chapter-position {from, to}
      console.log(`Updating chapter position from ${position} to ${value}`)
    }

  }

  useEffect(() => {
    if (inputRef.current) {
      inputRef.current.value = String(position)
    }
  }, [position])

  return (
    <div className="mb-4 flex flex-col gap-1">
      <label htmlFor="chapter-order">
          {t("PositionLabel")}
      </label>
      <div className="flex flex-row items-center gap-4">
          <Input
              onBlur={onBlur}
              compact
              min={1}
              max={totalItems}
              className="w-12"
              withFit
              name="chapter-order"
              ref={inputRef}
              defaultValue={position}
              type="number"
              disabled={totalItems == -1}
          />
          <HelperText>
              {t(
                "PositionHelperText",
                { totalItems: totalItems != -1 ? totalItems : ".." }
              )}
          </HelperText>
      </div>
  </div>
  )
}