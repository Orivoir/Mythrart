import type { SynopsisAnalysis } from "../validations/analysis-synopsis.job.js"

export function validateSynopsisAnalysis(
  analysis: SynopsisAnalysis,
): SynopsisAnalysis {
  validateUniqueEntityIds(analysis)
  validateUniqueEventIds(analysis)
  validateRelations(analysis)
  validateEventParticipants(analysis)

  return analysis
}

function validateUniqueEntityIds(
  analysis: SynopsisAnalysis,
): void {
  const ids = new Set<string>()

  for (const entity of analysis.entities) {
    if (!entity.id.trim()) {
      throw new Error("Synopsis analysis contains an entity with an empty ID")
    }

    if (ids.has(entity.id)) {
      throw new Error(
        `Synopsis analysis contains duplicate entity ID: ${entity.id}`,
      )
    }

    ids.add(entity.id)
  }
}

function validateUniqueEventIds(
  analysis: SynopsisAnalysis,
): void {
  const ids = new Set<string>()

  for (const event of analysis.events) {
    if (!event.id.trim()) {
      throw new Error("Synopsis analysis contains an event with an empty ID")
    }

    if (ids.has(event.id)) {
      throw new Error(
        `Synopsis analysis contains duplicate event ID: ${event.id}`,
      )
    }

    ids.add(event.id)
  }
}

function validateRelations(
  analysis: SynopsisAnalysis,
): void {
  const entityIds = new Set(
    analysis.entities.map((entity) => entity.id),
  )

  for (const relation of analysis.relations) {
    if (!entityIds.has(relation.from)) {
      throw new Error(
        `Synopsis analysis relation references unknown entity: ${relation.from}`,
      )
    }

    if (!entityIds.has(relation.to)) {
      throw new Error(
        `Synopsis analysis relation references unknown entity: ${relation.to}`,
      )
    }

    if (relation.from === relation.to) {
      throw new Error(
        `Synopsis analysis relation cannot reference the same entity: ${relation.from}`,
      )
    }
  }
}

function validateEventParticipants(
  analysis: SynopsisAnalysis,
): void {
  const entityIds = new Set(
    analysis.entities.map((entity) => entity.id),
  )

  for (const event of analysis.events) {
    for (const participantId of event.participants) {
      if (!entityIds.has(participantId)) {
        throw new Error(
          `Synopsis analysis event ${event.id} references unknown entity: ${participantId}`,
        )
      }
    }
  }
}