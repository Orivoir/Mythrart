import {
  EbookEntityRelationType,
  EbookEntityType,
} from "@mythrart/database"

const entityTypes = Object.values(EbookEntityType)
const relationTypes = Object.values(EbookEntityRelationType)

const schema = {
  type: "object",
  additionalProperties: false,

  properties: {
    entities: {
      type: "array",
      items: {
        type: "object",
        additionalProperties: false,

        properties: {
          id: {
            type: "string",
          },

          name: {
            type: "string",
          },

          type: {
            type: "string",
            enum: entityTypes,
          },

          description: {
            type: ["string", "null"],
          },
        },

        required: [
          "id",
          "name",
          "type",
          "description",
        ],
      },
    },

    relations: {
      type: "array",
      items: {
        type: "object",
        additionalProperties: false,

        properties: {
          from: {
            type: "string",
          },

          to: {
            type: "string",
          },

          type: {
            type: "string",
            enum: relationTypes,
          },
        },

        required: [
          "from",
          "to",
          "type",
        ],
      },
    },

    events: {
      type: "array",
      items: {
        type: "object",
        additionalProperties: false,

        properties: {
          id: {
            type: "string",
          },

          description: {
            type: "string",
          },

          participants: {
            type: "array",
            items: {
              type: "string",
            },
          },

          temporalExpression: {
            type: ["string", "null"],
          },
        },

        required: [
          "id",
          "description",
          "participants",
          "temporalExpression",
        ],
      },
    },
  },

  required: [
    "entities",
    "relations",
    "events",
  ],
}

export default schema