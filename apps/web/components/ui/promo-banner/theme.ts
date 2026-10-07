import type { PromoBannerVariant } from "./index"

export interface PromoBannerTheme {
  root: string
  gradient: string
  label: string
  mainAction: string
  secondAction: string
  image: string
  imagePosition: string
  imageSize: string
}

export const PROMO_BANNER_THEMES: Record<
  PromoBannerVariant,
  PromoBannerTheme
> = {
  guide: {
    root: "text-foreground",

    gradient:
      "linear-gradient(135deg, #eef0ff 0%, #e9e5ff 45%, #f1e2f2 100%)",

    label: "bg-violet-200 text-violet-700",

    mainAction:
      "border border-violet-600 bg-violet-600 text-white hover:border-violet-700 hover:bg-violet-700",

    secondAction:
      "border border-violet-400 bg-white/70 text-violet-700 hover:bg-white",

    image: "/cta/graph-guide.png",
    imagePosition: "right 8px center",
    imageSize: "235px auto",
  },

  "relations-entities": {
    root: "text-foreground",

    gradient:
      "linear-gradient(135deg, #fff0f2 0%, #f4eaff 48%, #e8efff 100%)",

    label: "bg-orange-50 text-orange-600",

    mainAction:
      "border border-violet-600 bg-violet-600 text-white hover:border-violet-700 hover:bg-violet-700",

    secondAction:
      "border border-violet-400 bg-white/70 text-violet-700 hover:bg-white",

    image: "/cta/graph-relations-entities.png",
    imagePosition: "right -5px center",
    imageSize: "230px auto",
  },
}