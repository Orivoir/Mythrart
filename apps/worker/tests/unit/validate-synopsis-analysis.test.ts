import { describe, expect, it } from "vitest"

import { validateSynopsisAnalysis } from "./../../src/utils/validate-synopsis-analysis.js"
import type { SynopsisAnalysis } from "./../../src/validations/analysis-synopsis.job.js"

const validAnalysis: SynopsisAnalysis = {
  entities: [
    {
      id: "e1",
      name: "Jean Morel",
      type: "CHARACTER",
      description: "Personnage principal",
    },
    {
      id: "e2",
      name: "Paris",
      type: "LOCATION",
      description: "Ville où se déroule l'histoire",
    },
  ],
  relations: [
    {
      from: "e1",
      to: "e2",
      type: "LOCATION",
    },
  ],
  events: [
    {
      id: "event-1",
      description: "Jean arrive à Paris",
      participants: ["e1"],
      temporalExpression: "Le lendemain",
    },
  ],
}

describe("validateSynopsisAnalysis", () => {
  it("returns the analysis when it is valid", () => {
    const result = validateSynopsisAnalysis(validAnalysis)

    expect(result).toBe(validAnalysis)
  })

  it("throws when an entity has an empty ID", () => {
    const analysis: SynopsisAnalysis = {
      ...validAnalysis,
      entities: [
        ...validAnalysis.entities,
        {
          id: "   ",
          name: "Claire",
          type: "CHARACTER",
          description: null,
        },
      ],
    }

    expect(() => validateSynopsisAnalysis(analysis)).toThrow(
      "Synopsis analysis contains an entity with an empty ID",
    )
  })

  it("throws when entity IDs are duplicated", () => {
    const analysis: SynopsisAnalysis = {
      ...validAnalysis,
      entities: [
        ...validAnalysis.entities,
        {
          id: "e1",
          name: "Claire",
          type: "CHARACTER",
          description: null,
        },
      ],
    }

    expect(() => validateSynopsisAnalysis(analysis)).toThrow(
      "Synopsis analysis contains duplicate entity ID: e1",
    )
  })

  it("throws when an event has an empty ID", () => {
    const analysis: SynopsisAnalysis = {
      ...validAnalysis,
      events: [
        ...validAnalysis.events,
        {
          id: "   ",
          description: "Un événement",
          participants: [],
          temporalExpression: null,
        },
      ],
    }

    expect(() => validateSynopsisAnalysis(analysis)).toThrow(
      "Synopsis analysis contains an event with an empty ID",
    )
  })

  it("throws when event IDs are duplicated", () => {
    const analysis: SynopsisAnalysis = {
      ...validAnalysis,
      events: [
        ...validAnalysis.events,
        {
          id: "event-1",
          description: "Un autre événement",
          participants: [],
          temporalExpression: null,
        },
      ],
    }

    expect(() => validateSynopsisAnalysis(analysis)).toThrow(
      "Synopsis analysis contains duplicate event ID: event-1",
    )
  })

  it("throws when a relation references an unknown source entity", () => {
    const analysis: SynopsisAnalysis = {
      ...validAnalysis,
      relations: [
        {
          from: "unknown",
          to: "e2",
          type: "LOCATION",
        },
      ],
    }

    expect(() => validateSynopsisAnalysis(analysis)).toThrow(
      "Synopsis analysis relation references unknown entity: unknown",
    )
  })

  it("throws when a relation references an unknown target entity", () => {
    const analysis: SynopsisAnalysis = {
      ...validAnalysis,
      relations: [
        {
          from: "e1",
          to: "unknown",
          type: "LOCATION",
        },
      ],
    }

    expect(() => validateSynopsisAnalysis(analysis)).toThrow(
      "Synopsis analysis relation references unknown entity: unknown",
    )
  })

  it("throws when a relation references the same entity", () => {
    const analysis: SynopsisAnalysis = {
      ...validAnalysis,
      relations: [
        {
          from: "e1",
          to: "e1",
          type: "LOCATION",
        },
      ],
    }

    expect(() => validateSynopsisAnalysis(analysis)).toThrow(
      "Synopsis analysis relation cannot reference the same entity: e1",
    )
  })

  it("throws when an event references an unknown participant", () => {
    const analysis: SynopsisAnalysis = {
      ...validAnalysis,
      events: [
        {
          id: "event-1",
          description: "Jean rencontre quelqu'un",
          participants: ["e1", "unknown"],
          temporalExpression: null,
        },
      ],
    }

    expect(() => validateSynopsisAnalysis(analysis)).toThrow(
      "Synopsis analysis event event-1 references unknown entity: unknown",
    )
  })
})