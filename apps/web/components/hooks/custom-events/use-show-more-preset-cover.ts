import useCustomEventListener from "../useCustomEventListener"
import { EVENT_NAME_SHOW_MORE_PRESET_COVER } from "@/lib/constants/custom-events"

export default function useShowMorePresetCover(callback: EventListener) {

  const {removeListener} = useCustomEventListener(EVENT_NAME_SHOW_MORE_PRESET_COVER, callback)
  
  return {
    removeListener
  }
}