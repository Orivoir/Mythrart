import { useProjectContext } from "@/components/hooks/use-project-context"
import { useChapter } from "@/components/hooks/queries/use-chapter"

export default function ChapterTabContent() {
    const {
        currentChapterEdition,
        currentLocale,
    } = useProjectContext()

    const chapterId = currentChapterEdition?.chapterId ?? null

    const {
        data: chapter,
        isPending,
        isError,
    } = useChapter(chapterId, currentLocale)

    if (!chapterId) {
        return <>No chapter is currently being edited</>
    }

    if (isPending) {
        return <>Loading chapter...</>
    }

    if (isError || !chapter) {
        return <>Unable to load chapter</>
    }

    const { title, locale, createdAt, position, updatedAt } = chapter

    return (
    <div>
        <h3>{title}</h3>

        <p>
            Locale: {locale}
        </p>
    </div>
    )
}