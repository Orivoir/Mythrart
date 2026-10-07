import { FileText } from "lucide-react"

interface MetadataItemProps {
  icon: typeof FileText
  children: React.ReactNode
}

export default function MetadataItem({
  icon: Icon,
  children,
}: MetadataItemProps) {
  return (
    <div className="flex items-center gap-1.5">
      <Icon
        className="size-3.5 shrink-0 text-muted-foreground"
        strokeWidth={1.8}
      />

      <span className="text-[11px] leading-none text-muted-foreground">
        {children}
      </span>
    </div>
  )
}
