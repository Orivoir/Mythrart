import { CollaborationPermission, CollaborationRole } from "@mythrart/database"
import { collaboratorCanAccessChapter, collaboratorHasPermission } from "@/lib/authorization/collaboration-permissions"
import { describe, expect, test } from "vitest"

function collaboratorFixture(overrides: Record<string, unknown> = {}) {
    return {
        id: "col_1",
        ebookId: "ebook_1",
        userId: "user_1",
        role: CollaborationRole.AUTHOR,
        customRoleId: null,
        allChaptersAccess: true,
        createdAt: new Date(),
        updatedAt: new Date(),
        customRole: null,
        chapterAccess: [],
        ...overrides,
    } as Parameters<typeof collaboratorHasPermission>[0]
}

describe("collaboratorHasPermission", () => {
    test("returns true when built-in role grants permission", () => {
        const collaborator = collaboratorFixture({ role: CollaborationRole.AUTHOR })

        expect(collaboratorHasPermission(collaborator, CollaborationPermission.CHAPTER_UPDATE)).toBe(true)
    })

    test("returns false when built-in role does not grant permission", () => {
        const collaborator = collaboratorFixture({ role: CollaborationRole.PROOFREADER })

        expect(collaboratorHasPermission(collaborator, CollaborationPermission.CHAPTER_UPDATE)).toBe(false)
    })

    test("uses custom role permissions when custom role is assigned", () => {
        const collaborator = collaboratorFixture({
            role: null,
            customRoleId: "role_custom",
            customRole: {
                permissions: [
                    CollaborationPermission.CHAPTER_READ,
                    CollaborationPermission.CHAPTER_UPDATE,
                ],
            },
        })

        expect(collaboratorHasPermission(collaborator, CollaborationPermission.CHAPTER_UPDATE)).toBe(true)
        expect(collaboratorHasPermission(collaborator, CollaborationPermission.CHAPTER_DELETE)).toBe(false)
    })
})

describe("collaboratorCanAccessChapter", () => {
    test("returns true when collaborator has all chapters access", () => {
        const collaborator = collaboratorFixture({
            allChaptersAccess: true,
            chapterAccess: [],
        })

        expect(collaboratorCanAccessChapter(collaborator, "chapter_1")).toBe(true)
    })

    test("returns true only for listed chapter ids when all chapters access is disabled", () => {
        const collaborator = collaboratorFixture({
            allChaptersAccess: false,
            chapterAccess: [{ chapterId: "chapter_allowed" }],
        })

        expect(collaboratorCanAccessChapter(collaborator, "chapter_allowed")).toBe(true)
        expect(collaboratorCanAccessChapter(collaborator, "chapter_denied")).toBe(false)
    })
})
