"use client"

import { Input } from "@/components/ui/input"
import { HelperText } from "@/components/ui/Typography"
import {useScenesList} from "@/components/hooks/queries/use-scenes-list"
import { useProjectContext } from "@/components/hooks/use-project-context"
import { useTranslations } from "next-intl"
import type { SyntheticEvent } from "react"
import { useRef, useEffect } from "react"

export interface FormPositionProps {
  position: number
}

export default function FormPosition({position}: FormPositionProps) {

  const inputRef = useRef<HTMLInputElement>(null)

  const {currentChapterEdition} = useProjectContext()
  const {data: scenes} = useScenesList(currentChapterEdition?.chapterId ?? null)
  const t = useTranslations("Workspace.RightPanel.Context.Scene.Form")

  useEffect(() => {
    if (inputRef.current) {
      inputRef.current.value = String(position + 1)
    }
  }, [position])

  const totalItems = scenes?.totalItems ?? -1

  const onBlur = (event: SyntheticEvent<HTMLInputElement>) => {
    const value = parseInt(event.currentTarget.value, 10)

    if(position !== value && value > 0 && value <= totalItems) {
      // should allow update position here
      // hooks/queries/use-mutation-scene-position {from, to}
      console.log(`Updating scene position from ${position} to ${value}`)
    }

  }

  const order = position + 1

  return (
    <div className="mb-4 flex flex-col gap-1">
      <label htmlFor="scene-order">
          {t("PositionLabel")}
      </label>
      <div className="flex flex-row items-center gap-4">
          <Input
              ref={inputRef}
              onBlur={onBlur}
              compact
              min={1}
              max={totalItems}
              className="w-12"
              withFit
              name="scene-order"
              defaultValue={order}
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