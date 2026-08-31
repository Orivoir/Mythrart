import type { JsonValue } from "@mythrart/database"

export interface PaginatedChaptersAPI {
    items: ChapterResponseAPI[];
    page: number;
    pageSize: number;
    totalPages: number;
    totalItems: number;
}

export interface ChapterResponseAPI {
    id: string;
    ebookId: string;
    locale: string;
    title: string;
    position: number;
    createdAt:number;
    updatedAt: number;
}

export interface ChapterContentResponseAPI extends ChapterResponseAPI {
    content: JsonValue;
}

export interface CreateChapterRequestAPI {
    title: string;
    locale?: string;
    content?: JsonValue;
}

export interface CreateChapterResponseAPI {
    id: string;
    ebookId: string;
    locale: string;
    title: string;
    content: JsonValue;
    position: number;
    createdAt: number;
    updatedAt: number;
}

export interface DeleteChapterResponseAPI {
    success: boolean;
}

export interface UpdateChapterRequestAPI extends Partial<CreateChapterRequestAPI> {}

export interface UpdateChapterResponseAPI extends ChapterContentResponseAPI {}