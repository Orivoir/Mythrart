import { beforeEach, describe, expect, it } from "vitest"

import {
  EbookEntityType,
  type EbookEntity,
} from "@mythrart/database"

import prisma from "./../helpers/prisma"
import "./../helpers/setup"

import { createEbooksFixture, createUserFixture } from "./../helpers/factories"

import {
  findEbookEntities,
  findSceneEntityIds,
  sortEbookEntitiesByScene,
} from "@/app/api/ebooks/[id]/entities/shared"

describe("ebook entities helpers", () => {
  let ebookId: string
  let scene1Id: string
  let scene2Id: string

  let alice: EbookEntity
  let bob: EbookEntity
  let paris: EbookEntity
  let narrator: EbookEntity

  beforeEach(async () => {
    const user = await createUserFixture()

    await createEbooksFixture(user.id, [
      {
        title: "Fixture Ebook",
        subtitle: "Awesome subtitle",
        shortDescription: "Fixture ebook for entity helpers",
      },
    ])

    const ebook = await prisma.ebook.findFirstOrThrow({
      where: {
        ownerId: user.id,
      },
    })

    ebookId = ebook.id

    ;[alice, bob, paris, narrator] = await Promise.all([
      prisma.ebookEntity.create({
        data: {
          ebookId,
          name: "Alice",
          slug: "alice",
          type: EbookEntityType.CHARACTER,
          description: "Alice fixture",
        },
      }),

      prisma.ebookEntity.create({
        data: {
          ebookId,
          name: "Bob",
          slug: "bob",
          type: EbookEntityType.CHARACTER,
          description: "Bob fixture",
        },
      }),

      prisma.ebookEntity.create({
        data: {
          ebookId,
          name: "Paris",
          slug: "paris",
          type: EbookEntityType.LOCATION,
          description: "Paris fixture",
        },
      }),

      prisma.ebookEntity.create({
        data: {
          ebookId,
          name: "Narrateur",
          slug: "narrateur",
          type: EbookEntityType.OTHER,
          description: "Narrator fixture",
        },
      }),
    ])

    const chapter = await prisma.chapter.create({
      data: {
        ebookId,
        title: "Chapitre 1",
        position: 1,
      },
    })

    const scene1 = await prisma.scene.create({
      data: {
        chapterId: chapter.id,
        title: "Rencontre à Paris",
        objective: "Alice rencontre Bob",
        order: 1,
      },
    })

    const scene2 = await prisma.scene.create({
      data: {
        chapterId: chapter.id,
        title: "Retour à Paris",
        objective: "Bob revient à Paris",
        order: 2,
      },
    })

    scene1Id = scene1.id
    scene2Id = scene2.id

    await prisma.sceneEntity.createMany({
      data: [
        {
          sceneId: scene1Id,
          entityId: alice.id,
        },
        {
          sceneId: scene1Id,
          entityId: paris.id,
        },
        {
          sceneId: scene2Id,
          entityId: bob.id,
        },
        {
          sceneId: scene2Id,
          entityId: paris.id,
        },
      ],
    })
  })

  describe("findEbookEntities", () => {
    it("returns all entities of the ebook", async () => {
      const result = await findEbookEntities({
        ebookId,
      })

      expect(result).toHaveLength(4)

      expect(result.map((entity) => entity.name)).toEqual(
        expect.arrayContaining([
          "Alice",
          "Bob",
          "Paris",
          "Narrateur",
        ]),
      )
    })

    it("does not return entities from another ebook", async () => {
      const otherUser = await createUserFixture()

      await createEbooksFixture(otherUser.id, [
        {
          title: "Other Ebook",
          subtitle: "awesome other subtitle",
          shortDescription: "Awesome other short description",
        },
      ])

      const otherEbook = await prisma.ebook.findFirstOrThrow({
        where: {
          ownerId: otherUser.id,
        },
      })

      await prisma.ebookEntity.create({
        data: {
          ebookId: otherEbook.id,
          name: "Other Alice",
          slug: "other-alice",
          type: EbookEntityType.CHARACTER,
        },
      })

      const result = await findEbookEntities({
        ebookId,
      })

      expect(result).toHaveLength(4)
      expect(
        result.some((entity) => entity.name === "Other Alice"),
      ).toBe(false)
    })

    it("filters entities by type", async () => {
      const result = await findEbookEntities({
        ebookId,
        type: EbookEntityType.CHARACTER,
      })

      expect(result).toHaveLength(2)

      expect(result.map((entity) => entity.name)).toEqual(
        expect.arrayContaining([
          "Alice",
          "Bob",
        ]),
      )
    })

    it("returns no entities for a type with no match", async () => {
      const result = await findEbookEntities({
        ebookId,
        type: EbookEntityType.ORGANIZATION,
      })

      expect(result).toHaveLength(0)
    })

    it("searches entities by name", async () => {
      const result = await findEbookEntities({
        ebookId,
        search: "ali",
      })

      expect(result).toHaveLength(1)
      expect(result[0].name).toBe("Alice")
    })

    it("searches entities by slug", async () => {
      await prisma.ebookEntity.update({
        where: {
          id: paris.id,
        },
        data: {
          slug: "capital-francaise",
        },
      })

      const result = await findEbookEntities({
        ebookId,
        search: "capitale",
      })

      expect(result).toHaveLength(0)

      const secondResult = await findEbookEntities({
        ebookId,
        search: "francaise",
      })

      expect(secondResult).toHaveLength(1)
      expect(secondResult[0].id).toBe(paris.id)
    })

    it("searches case-insensitively", async () => {
      const result = await findEbookEntities({
        ebookId,
        search: "ALICE",
      })

      expect(result).toHaveLength(1)
      expect(result[0].id).toBe(alice.id)
    })

    it("searches by name or slug", async () => {
      await prisma.ebookEntity.update({
        where: {
          id: narrator.id,
        },
        data: {
          slug: "voice-off",
        },
      })

      const result = await findEbookEntities({
        ebookId,
        search: "voice",
      })

      expect(result).toHaveLength(1)
      expect(result[0].id).toBe(narrator.id)
    })

    it("combines type and search filters", async () => {
      const result = await findEbookEntities({
        ebookId,
        type: EbookEntityType.CHARACTER,
        search: "ali",
      })

      expect(result).toHaveLength(1)
      expect(result[0].id).toBe(alice.id)
    })

    it("returns no result when type and search do not match the same entity", async () => {
      const result = await findEbookEntities({
        ebookId,
        type: EbookEntityType.LOCATION,
        search: "alice",
      })

      expect(result).toHaveLength(0)
    })

    it("orders entities by createdAt descending", async () => {
      const result = await findEbookEntities({
        ebookId,
      })

      for (let index = 1; index < result.length; index++) {
        expect(
          result[index - 1].createdAt.getTime(),
        ).toBeGreaterThanOrEqual(
          result[index].createdAt.getTime(),
        )
      }
    })
  })

  describe("findSceneEntityIds", () => {
    it("returns entity ids associated with a scene", async () => {
      const result = await findSceneEntityIds(scene1Id)

      expect(result).toHaveLength(2)

      expect(result).toEqual(
        expect.arrayContaining([
          alice.id,
          paris.id,
        ]),
      )
    })

    it("returns only entities associated with the requested scene", async () => {
      const result = await findSceneEntityIds(scene1Id)

      expect(result).not.toContain(bob.id)
      expect(result).not.toContain(narrator.id)
    })

    it("returns an empty array for a scene without entities", async () => {
      const emptyScene = await prisma.scene.create({
        data: {
          chapterId: (
            await prisma.scene.findUniqueOrThrow({
              where: {
                id: scene1Id,
              },
            })
          ).chapterId!,
          title: "Scene vide",
          order: 3,
        },
      })

      const result = await findSceneEntityIds(emptyScene.id)

      expect(result).toEqual([])
    })

    it("returns an empty array for an unknown scene", async () => {
      const result = await findSceneEntityIds("unknown-scene-id")

      expect(result).toEqual([])
    })
  })

  describe("sortEbookEntitiesByScene", () => {
    it("puts entities from the scene before other entities", async () => {
      const entities = await findEbookEntities({
        ebookId,
      })

      const sceneEntityIds = await findSceneEntityIds(scene1Id)

      const result = sortEbookEntitiesByScene(
        entities,
        sceneEntityIds,
      )

      const firstSceneEntityIndex = result.findIndex(
        (entity) => entity.id === alice.id,
      )

      const firstNonSceneEntityIndex = result.findIndex(
        (entity) =>
          entity.id !== alice.id &&
          entity.id !== paris.id,
      )

      expect(firstSceneEntityIndex).toBeLessThan(
        firstNonSceneEntityIndex,
      )
    })

    it("keeps all ebook entities", async () => {
      const entities = await findEbookEntities({
        ebookId,
      })

      const sceneEntityIds = await findSceneEntityIds(scene1Id)

      const result = sortEbookEntitiesByScene(
        entities,
        sceneEntityIds,
      )

      expect(result).toHaveLength(entities.length)

      expect(result.map((entity) => entity.id)).toEqual(
        expect.arrayContaining(
          entities.map((entity) => entity.id),
        ),
      )
    })

    it("prioritizes the entities of scene 2", async () => {
      const entities = await findEbookEntities({
        ebookId,
      })

      const sceneEntityIds = await findSceneEntityIds(scene2Id)

      const result = sortEbookEntitiesByScene(
        entities,
        sceneEntityIds,
      )

      const bobIndex = result.findIndex(
        (entity) => entity.id === bob.id,
      )

      const parisIndex = result.findIndex(
        (entity) => entity.id === paris.id,
      )

      const aliceIndex = result.findIndex(
        (entity) => entity.id === alice.id,
      )

      expect(bobIndex).toBeLessThan(aliceIndex)
      expect(parisIndex).toBeLessThan(aliceIndex)
    })

    it("keeps the normal order when no scene entities are provided", async () => {
      const entities = await findEbookEntities({
        ebookId,
      })

      const result = sortEbookEntitiesByScene(
        entities,
        [],
      )

      expect(result.map((entity) => entity.id)).toEqual(
        entities.map((entity) => entity.id),
      )
    })

    it("does not mutate the original array", async () => {
      const entities = await findEbookEntities({
        ebookId,
      })

      const originalIds = entities.map((entity) => entity.id)

      const sceneEntityIds = await findSceneEntityIds(scene1Id)

      sortEbookEntitiesByScene(
        entities,
        sceneEntityIds,
      )

      expect(entities.map((entity) => entity.id)).toEqual(
        originalIds,
      )
    })
  })
})