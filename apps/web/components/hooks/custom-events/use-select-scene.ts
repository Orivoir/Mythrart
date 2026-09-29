import useCustomEventListener from "../useCustomEventListener"
import { EVENT_NAME_SELECT_SCENE } from "@/lib/constants/custom-events"

export default function useSelectScene(callback: EventListener) {

  const {removeListener} = useCustomEventListener(EVENT_NAME_SELECT_SCENE, callback)
  
  return {
    removeListener
  }
}