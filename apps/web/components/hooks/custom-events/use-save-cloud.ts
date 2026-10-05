import useCustomEventListener from "../useCustomEventListener"
import {
  EVENT_NAME_CLOUD_SAVE_FINISH,
  EVENT_NAME_WORK_MODE_START
} from "@/lib/constants/custom-events"

export interface UseSaveCloudOptions {
  callback: EventListener
  type: "start" | "finish"
}

export default function useSaveCloud(
  { callback, type }: UseSaveCloudOptions
) {

  const eventName =
    type === "start" ? EVENT_NAME_WORK_MODE_START : EVENT_NAME_CLOUD_SAVE_FINISH

  const {removeListener} = useCustomEventListener(eventName, callback)
  
  return {
    removeListener
  }
}