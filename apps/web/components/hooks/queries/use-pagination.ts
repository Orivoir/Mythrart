import { useCallback, useState } from "react"

interface UsePaginationOptions {
    initialPage?: number
}

export function usePagination({
    initialPage = 1,
}: UsePaginationOptions = {}) {
    const [currentPage, setCurrentPage] = useState(initialPage)

    const next = useCallback(() => {
        setCurrentPage((page) => page + 1)
    }, [])

    const previous = useCallback(() => {
        setCurrentPage((page) => Math.max(1, page - 1))
    }, [])

    const goTo = useCallback((page: number) => {
        setCurrentPage(Math.max(1, page))
    }, [])

    const reset = useCallback(() => {
        setCurrentPage(initialPage)
    }, [initialPage])

    return {
        currentPage,
        next,
        previous,
        goTo,
        reset
    }
}