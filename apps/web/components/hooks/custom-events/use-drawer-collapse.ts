import useCustomEventListener from "../useCustomEventListener"
import { EVENT_NAME_DRAWER_COLLAPSE_CHANGE } from "@/lib/constants/custom-events"

export default function useDrawerCollapseChange(callback: (event: CustomEvent<{ status: boolean }>) => void) {

  const {removeListener} = useCustomEventListener(
    EVENT_NAME_DRAWER_COLLAPSE_CHANGE,
    callback as EventListener
  )

  return {
    removeListener
  }
}