import { getTranslations } from "next-intl/server"
import { Text } from "../Typography/text"
import { Star, StarHalf } from "lucide-react"

export async function RankingUsers() {

  const factoryRank = 3.5
  const factoryUsersCount = 450

  const t = await getTranslations("CTA.RankingUsers")

  return (
    <div className="
      flex
      flex-col
      gap-6
    ">
      <div>
        <Text variant="default" className="whitespace-nowrap">
          {t("Describe")}
        </Text>
      </div>

      <div className="flex gap-4 items-center">
        <div style={{ position: "relative" }}>
          <div className="flex gap-1">
          {[...Array(5)].map((_, index) => (
            <span key={index} className="inline-block">
              <Star fill="currentColor" className="w-5 h-5 text-muted" />
            </span>
          ))}
          </div>

          <div className="flex gap-1" style={{ position: "absolute", top: 0 }}>
            {[...Array(5)].map((_, index) => {
              const starValue = index + 1
              const isFullStar = starValue <= Math.floor(factoryRank)
              const isHalfStar = starValue === Math.ceil(factoryRank) && !isFullStar

              return (
                <span key={index} className="inline-block">
                  {isFullStar ? (
                    <Star fill="currentColor" className="w-5 h-5 text-accent" />
                  ) : isHalfStar ? (
                    <StarHalf fill="currentColor" className="w-5 h-5 text-accent" />
                  ) : (
                    <Star fill="currentColor" className="w-5 h-5 text-muted" />
                  )}
                </span>
              )
            })}
          </div>

        </div>

        <div>
          <Text variant="muted" className="whitespace-nowrap">
            {t("Label", { rank: factoryRank, count: factoryUsersCount })}
          </Text>
        </div>
      </div>

    </div>
  )
}