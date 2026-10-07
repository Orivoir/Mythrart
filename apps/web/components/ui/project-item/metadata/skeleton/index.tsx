import { Skeleton } from "@radix-ui/themes"

function MetadataItemSkeleton({
  width,
}: {
  width: string
}) {
  return (
    <div className="flex items-center gap-1.5">
      <Skeleton width="14px" height="14px" />
      <Skeleton width={width} height="11px" />
    </div>
  )
}

export function ProjectItemMetadataSkeleton() {
  return (
    <div className="mt-2.5 flex flex-wrap items-center gap-x-3 gap-y-2">
      <MetadataItemSkeleton width="24px" />
      <MetadataItemSkeleton width="42px" />
      <MetadataItemSkeleton width="52px" />
      <MetadataItemSkeleton width="38px" />
    </div>
  )
}