import useDrawerCollapseChange from "./custom-events/use-drawer-collapse";
import { useState } from "react"

export default function useDrawerCollapse() {

  const [isDrawerCollapsed, setIsDrawerCollapsed] = useState(false)

  const onDrawerCollapseChange = (event: CustomEvent<{status: boolean}>) => {
    setIsDrawerCollapsed(event.detail.status)
  }

  useDrawerCollapseChange(onDrawerCollapseChange)
  
  return isDrawerCollapsed
}