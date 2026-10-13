import type { CollaborationRole } from "@mythrart/database"
import type { EpubContributorRole } from "@mythrart/epub"

const CONTRIBUTOR_ROLE_MAP: Record<
  CollaborationRole,
  EpubContributorRole
> = {
  OWNER: "aut",
  AUTHOR: "aut",
  TRANSLATOR: "trl",
  PROOFREADER: "rev",
  EDITOR: "edt",
}

export function mapRoleContributor(
  role: CollaborationRole | null,
): EpubContributorRole {
  if (role === null) {
    return "oth"
  }

  return CONTRIBUTOR_ROLE_MAP[role]
}
