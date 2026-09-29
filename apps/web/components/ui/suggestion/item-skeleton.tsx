import { Skeleton } from "@radix-ui/themes"

export default function ItemSkeleton() {

  return (
      <div className="flex flex-row gap-2 items-center">
          <Skeleton width="24px" height="24px" />
          <div className="flex flex-1 flex-col gap-1">
            <Skeleton width="80%" height="12px" />
            <Skeleton width="60%" height="12px" />
          </div>
      </div>
    )
}