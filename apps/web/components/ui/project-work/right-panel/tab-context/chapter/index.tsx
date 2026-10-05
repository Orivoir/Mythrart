import { useProjectContext } from "@/components/hooks/use-project-context"
import { useChapter } from "@/components/hooks/queries/use-chapter"
import FormPosition from "./form-position"
import FormTitle from "./form-title"
import EmptyChapter from "./empty"
import LoadingChapter from "./loading"
import { Chip } from "@/components/ui/chip"
import UpdateDate from "./update-date"

export default function ChapterTabContent() {
    const {
        currentChapterEdition,
        currentLocale
    } = useProjectContext()

    const chapterId = currentChapterEdition?.chapterId ?? null

    const {
        data: chapter,
        isPending,
        isError,
    } = useChapter(chapterId, currentLocale)

    if (!chapterId) {
        return <EmptyChapter />
    }

    if (isPending) {
        return <LoadingChapter />
    }

    if (isError || !chapter) {
        return <>Unable to load chapter</>
    }

    const onUpdateChapter = (event: React.SyntheticEvent<HTMLFormElement>) => {
        event.preventDefault()
        console.log("Chapter update submitted")
    }

    const { title, locale, position } = chapter

    return (
    <div>
        <div className="flex justify-end my-2">
            <Chip>
                {locale.toUpperCase()}
            </Chip>
        </div>
        <form action="#" method="post" className="mb-4" onSubmit={onUpdateChapter}>
            <FormTitle title={title} />
            <FormPosition position={position} />
        </form>

        <UpdateDate updatedAt={chapter?.updatedAt ?? 0} />
    </div>
    )
}