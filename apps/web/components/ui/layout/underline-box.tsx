import {withUnderline} from "@/components/ui/Typography/with-underline"

function _UnderlineBox({children, className}: {children: React.ReactNode, className?: string}) {
  return (
    <div className={className}>
      {children}
    </div>
  )
}

export const UnderlineBox = withUnderline(_UnderlineBox)

