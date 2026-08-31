import { Feature, type FeatureType } from "@/components/ui/feature-cta"
import { getTranslations } from "next-intl/server"

export async function FeaturesList() {

  const t = await getTranslations("CTA.FeaturesList")

  const featuresData = [
      {
        title: t("EditorTitle"),
        description:  t("EditorDescribe"),
        type: "pencil" as FeatureType
      },
      {
        title: t("CollaborationTitle"),
        description: t("CollaborationDescribe"),
        type: "users" as FeatureType
      },
      {
        title: t("VersionningTitle"),
        description: t("VersionningDescribe"),
        type: "history" as FeatureType
      },
      {
        title: t("TranslationTitle"),
        description: t("TranslationDescribe"),
        type: "globe" as FeatureType
      },
      {
        title: t("OfflineTitle"),
        description: t("OfflineDescribe"),
        type: "globe-off" as FeatureType 
      },
      {
        title: t("SilentAITitle"),
        description: t("SilentAIDescribe"),
        type: "wand-sparkles" as FeatureType
      }
  ]

  return (
    <div  className="
      grid
      gap-6
      grid-cols-1
      md:grid-cols-2
      lg:grid-cols-3
      xl:grid-cols-6
      w-full
    ">
    {featuresData.map(feature => (
        <Feature key={feature.title} {...feature} />
      ))}
    </div>
  )
}