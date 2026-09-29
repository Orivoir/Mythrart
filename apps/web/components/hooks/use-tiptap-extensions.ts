"use client"

import { useMemo, useState } from "react"
import { ReactRenderer } from "@tiptap/react"
import {
  addExtensions,
  EntityMention,
  extensions,
} from "@mythrart/editor-extensions"

import type {
  EbookEntityWithRelationsResponseAPI,
} from "@/app/types/api/ebook-entity"
import { Suggestion } from "@/components/ui/suggestion"
import useSelectScene from "@/components/hooks/custom-events/use-select-scene"
import { fetchEbookEntities } from "@/components/hooks/queries/use-entities"

export default function useTiptapExtensions(projectId: string) {
  const [sceneId, setSceneId] = useState<string | undefined>()

  useSelectScene((event) => {
    const customEvent = event as CustomEvent<{ sceneId: string }>

    setSceneId(customEvent.detail.sceneId)
  })

  const customExtensions = useMemo(
    () => [
      EntityMention.configure({
        suggestion: {
          items: async ({ query }): Promise<EbookEntityWithRelationsResponseAPI[]> => {

            const data = await fetchEbookEntities(
              projectId,
              1,
              sceneId,
              query,
            )

            return data.items
          },

          render: () => {
            let component: ReactRenderer | null = null
            let unmount: (() => void) | null = null

            return {
              onStart: (props) => {

                component = new ReactRenderer(Suggestion, {
                  props,
                  editor: props.editor,
                })

                unmount = props.mount(component.element)
              },

              onUpdate: (props) => {

                component?.updateProps(props)
              },

              onExit: () => {
                unmount?.()
                component?.destroy()

                component = null
                unmount = null
              },
            }
          }
        },
      }),
    ],
    [projectId, sceneId],
  )

  return useMemo(
    () => addExtensions(extensions, ...customExtensions),
    [customExtensions],
  )
}