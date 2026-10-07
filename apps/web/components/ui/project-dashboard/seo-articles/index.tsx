import CardArticle, {type  CardArticleProps } from "@/components/ui/cta/card-article"
import { color } from "framer-motion"
import {
  BrainCircuit,
  PencilSparkles,
  Clock9
} from "lucide-react"
import {useTranslations} from "next-intl"
import { useMemo } from "react"
import { Title } from "../../Typography"

export default function SeoArticles() {

  const t = useTranslations("Dashboard.SEO-Articles")

  const articles: CardArticleProps[] = useMemo(() => ([
    {
      icon: BrainCircuit,
      href: "#",
      title: t("AnalysisAI.Title"),
      description: t("AnalysisAI.Description"),
      linkTitle: t("AnalysisAI.LinkTitle"),
      color: "accent"
    },
    {
      icon: PencilSparkles,
      title: t("WritingReports.Title"),
      href: "#",
      description: t("WritingReports.Description"),
      linkTitle: t("WritingReports.LinkTitle"),
      color: "primary"
    },
    {
      icon: Clock9,
      href: "#",
      title: t("Relationship.Title"),
      description: t("Relationship.Description"),
      linkTitle: t("Relationship.LinkTitle"),
      color: "success"
    }
  ]), [t])

  return (
    <div>
      <Title className="uppercase mb-6 font-bold">
        {t("Title")}
      </Title>
      <div className="flex flex-row gap-6">
        {articles.map((props, index) => (
          <CardArticle {...props} key={index} />
        ))}
      </div>
    </div>
  )
}