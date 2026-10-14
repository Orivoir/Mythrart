import { prisma } from "@mythrart/database";

export default async function createUser(id: string) {
  return prisma.user.create({
    data: {
      email: `bridge-owner-${id}@example.test`,
      firstName: "Arthur",
      lastName: "Conan Doyle",
      username: `arthur_${id}`,
      emailVerified: new Date(),
      termsAcceptedAt: new Date(),
    },
  });
}
