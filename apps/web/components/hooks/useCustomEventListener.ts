import { useEffect } from "react"

export default function useCustomEventListener(eventName: string, callback: EventListener) {

  const removeListener = () => {
    window.removeEventListener(eventName, callback)
  }

  useEffect(() => {
    window.addEventListener(eventName, callback)
    
    return () => {
      removeListener()
    }
  }, [eventName, callback])


  return {
    removeListener
  }

}
