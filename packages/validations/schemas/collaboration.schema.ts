import { z } from "zod"

import {
    CollaborationPermission,
    CollaborationRole,
} from "@mythrart/constants"

const CollaboratorRoleSchema = z.enum(CollaborationRole).refine((value) => value !== CollaborationRole.OWNER, {
    message: "COLLABORATOR_ROLE_INVALID",
})

const CollaborationPermissionSchema = z.enum(CollaborationPermission)

export const CollaboratorCreateSchema = z.object({
    collaboratorUserId: z.string().min(1, { message: "COLLABORATOR_USER_ID_REQUIRED" }),
    role: CollaboratorRoleSchema.optional(),
    customRoleId: z.string().min(1, { message: "CUSTOM_ROLE_ID_REQUIRED" }).optional(),
    allChaptersAccess: z.boolean().optional(),
    chapterIds: z.array(z.string().min(1)).optional(),
}).superRefine((value, context) => {
    const hasRole = typeof value.role === "string"
    const hasCustomRole = typeof value.customRoleId === "string"

    if (hasRole === hasCustomRole) {
        context.addIssue({
            code: "custom",
            path: ["role"],
            message: "ROLE_OR_CUSTOM_ROLE_REQUIRED",
        })
    }
})

export const CollaboratorUpdateSchema = z.object({
    collaboratorUserId: z.string().min(1, { message: "COLLABORATOR_USER_ID_REQUIRED" }),
    role: CollaboratorRoleSchema.optional(),
    customRoleId: z.string().min(1, { message: "CUSTOM_ROLE_ID_REQUIRED" }).optional(),
    allChaptersAccess: z.boolean().optional(),
    chapterIds: z.array(z.string().min(1)).optional(),
}).superRefine((value, context) => {
    const hasRole = typeof value.role === "string"
    const hasCustomRole = typeof value.customRoleId === "string"

    if (hasRole && hasCustomRole) {
        context.addIssue({
            code: "custom",
            path: ["role"],
            message: "ROLE_AND_CUSTOM_ROLE_MUTUALLY_EXCLUSIVE",
        })
    }

    if (
        value.role === undefined
        && value.customRoleId === undefined
        && value.allChaptersAccess === undefined
        && value.chapterIds === undefined
    ) {
        context.addIssue({
            code: "custom",
            path: ["root"],
            message: "NO_UPDATE_FIELDS",
        })
    }
})

export const CollaboratorDeleteSchema = z.object({
    collaboratorUserId: z.string().min(1, { message: "COLLABORATOR_USER_ID_REQUIRED" }),
})

export const CustomRoleCreateSchema = z.object({
    name: z.string().min(2, { message: "CUSTOM_ROLE_NAME_TOO_SHORT" }).max(60, { message: "CUSTOM_ROLE_NAME_TOO_LONG" }),
    permissions: z.array(CollaborationPermissionSchema).min(1, { message: "CUSTOM_ROLE_PERMISSIONS_REQUIRED" }),
})

export const CustomRoleUpdateSchema = z.object({
    roleId: z.string().min(1, { message: "CUSTOM_ROLE_ID_REQUIRED" }),
    name: z.string().min(2, { message: "CUSTOM_ROLE_NAME_TOO_SHORT" }).max(60, { message: "CUSTOM_ROLE_NAME_TOO_LONG" }).optional(),
    permissions: z.array(CollaborationPermissionSchema).min(1, { message: "CUSTOM_ROLE_PERMISSIONS_REQUIRED" }).optional(),
}).superRefine((value, context) => {
    if (value.name === undefined && value.permissions === undefined) {
        context.addIssue({
            code: "custom",
            path: ["root"],
            message: "NO_UPDATE_FIELDS",
        })
    }
})

export const CustomRoleDeleteSchema = z.object({
    roleId: z.string().min(1, { message: "CUSTOM_ROLE_ID_REQUIRED" }),
})