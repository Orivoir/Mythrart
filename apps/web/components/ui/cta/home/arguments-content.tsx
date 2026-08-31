import { FeaturesList as CTAFeaturesList } from "@/components/ui/cta/list-features"
import { RankingUsers as CTARankingUsers } from "@/components/ui/cta/ranking-users"
import { AvatarsUsedUsers as CTAAvatarsUsedUsers } from "@/components/ui/cta/avatars-used-users"
import { ListReassurings as CTAListReassurings } from "@/components/ui/cta/list-reassurings"

export function ArgumentsContent() {

  return (
    <section>
      <CTAFeaturesList />

      <div className="
        flex
        flex-1
        flex-col
        md:flex-row
        gap-12
        my-24
      ">
        <div className="
          flex
          flex-1
          flex-col
          md:flex-row
          gap-12
        ">
          <CTARankingUsers />
          <CTAAvatarsUsedUsers />
        </div>
        <CTAListReassurings />
      </div>
    </section>
  )
}