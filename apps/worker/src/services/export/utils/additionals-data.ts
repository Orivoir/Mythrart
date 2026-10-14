import { prisma, type Prisma } from "@mythrart/database";

export interface EbookAdditionalDataOptions {
  withTheme?: boolean;
  withCollaborators?: boolean;
  withGenres?: boolean;
  withEbookType?: boolean;
  withOwner?: boolean;
}

export function withTheme() {
  return {
    ebookTheme: true,
  } as const;
}

export function withCollaborators() {
  return {
    collaborators: {
      include: {
        user: true,
        customRole: true,
      },
    },
  } as const;
}

export function withOwner() {
  return {
    owner: true,
  } as const;
}

export function withGenres() {
  return {
    genres: {
      include: {
        genre: true,
      },
    },
  } as const;
}

export function withEbookType() {
  return {
    ebookType: true,
  } as const;
}

type EbookAdditionalDataInclude<Options extends EbookAdditionalDataOptions> =
  (Options["withTheme"] extends true ? ReturnType<typeof withTheme> : {}) &
    (Options["withCollaborators"] extends true
      ? ReturnType<typeof withCollaborators>
      : {}) &
    (Options["withGenres"] extends true ? ReturnType<typeof withGenres> : {}) &
    (Options["withEbookType"] extends true
      ? ReturnType<typeof withEbookType>
      : {}) &
    (Options["withOwner"] extends true ? ReturnType<typeof withOwner> : {});

export type EbookAdditionalData<Options extends EbookAdditionalDataOptions> =
  Prisma.EbookGetPayload<{
    include: EbookAdditionalDataInclude<Options>;
  }>;

export async function loadEbookAdditionalData<
  const Options extends EbookAdditionalDataOptions = {},
>(
  ebookId: string,
  options: Options = {} as Options,
): Promise<EbookAdditionalData<Options> | null> {
  const {
    withTheme: includeTheme = false,
    withCollaborators: includeCollaborators = false,
    withGenres: includeGenres = false,
    withEbookType: includeEbookType = false,
    withOwner: includeOwner = false,
  } = options;

  const include = {
    ...(includeTheme ? withTheme() : {}),
    ...(includeCollaborators ? withCollaborators() : {}),
    ...(includeGenres ? withGenres() : {}),
    ...(includeEbookType ? withEbookType() : {}),
    ...(includeOwner ? withOwner() : {}),
  };

  return prisma.ebook.findUnique({
    where: {
      id: ebookId,
    },
    include,
  }) as Promise<EbookAdditionalData<Options> | null>;
}
