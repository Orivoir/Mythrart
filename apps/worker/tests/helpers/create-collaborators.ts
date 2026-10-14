import { type CollaborationRole, prisma, type User } from "@mythrart/database";

export interface CreateCollaboratorOptions {
  id: string;
  ebookId: string;
  beforeCreate?: (user: User) => void;
}

export default async function createCollaborators({
  id,
  ebookId,
  beforeCreate,
}: CreateCollaboratorOptions) {
  const collaboratorConfigs: Array<{
    firstName: string;
    lastName: string;
    username: string;
    role: CollaborationRole;
  }> = [
    {
      firstName: "Jane",
      lastName: "Austen",
      username: `editor_${id}`,
      role: "EDITOR",
    },
    {
      firstName: "Jorge",
      lastName: "Borges",
      username: `translator_${id}`,
      role: "TRANSLATOR",
    },
    {
      firstName: "Mary",
      lastName: "Shelley",
      username: `proofreader_${id}`,
      role: "PROOFREADER",
    },
    {
      firstName: "Edgar",
      lastName: "Poe",
      username: `author_${id}`,
      role: "AUTHOR",
    },
  ];

  for (const config of collaboratorConfigs) {
    const user = await prisma.user.create({
      data: {
        email: `${config.username}@example.test`,
        firstName: config.firstName,
        lastName: config.lastName,
        username: config.username,
        emailVerified: new Date(),
        termsAcceptedAt: new Date(),
      },
    });
    // createdUserIds.add(user.id)
    beforeCreate?.(user);

    await prisma.ebookCollaborator.create({
      data: {
        ebookId: ebookId,
        userId: user.id,
        role: config.role,
      },
    });
  }
}
