export const DEFAULT_PAGE = 1
export const DEFAULT_PAGE_SIZE = 10
export const MAX_PAGE_SIZE = 100

export interface PaginationParams {
    page: number;
    pageSize: number;
}

function parsePositiveInteger(value: string | null, fallback: number): number {
    if (!value) {
        return fallback
    }

    const parsedValue = Number.parseInt(value, 10)

    if (!Number.isFinite(parsedValue) || parsedValue < 1) {
        return fallback
    }

    return parsedValue
}

export function parsePaginationParams(searchParams: URLSearchParams): PaginationParams {
    const page = parsePositiveInteger(searchParams.get("page"), DEFAULT_PAGE)
    const pageSize = Math.min(
        parsePositiveInteger(searchParams.get("pageSize"), DEFAULT_PAGE_SIZE),
        MAX_PAGE_SIZE,
    )

    return {
        page,
        pageSize,
    }
}

export function withPagination<T>(items: T[], page: number, pageSize: number, totalItems: number)  {
    const totalPages = Math.max(1, Math.ceil(totalItems / pageSize))

    return {
        items,
        page,
        pageSize,
        totalPages,
        totalItems,
    }
}