import useCustomEventListener from "../useCustomEventListener"
import { EVENT_NAME_WORK_MODE_START } from "@/lib/constants/custom-events"
import type { CreateEbookResponseAPI } from "@/app/types/api/ebook"

export default function useWorkMode(callback: (event: CustomEvent<CreateEbookResponseAPI>) => void) {
 
  const {removeListener} = useCustomEventListener(EVENT_NAME_WORK_MODE_START, callback as EventListener)

  return removeListener
}