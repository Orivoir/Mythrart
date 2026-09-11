const promptAnalysisSynopsis = `
Analyze the provided synopsis.

Identify:
- entities
- semantic relationships between entities
- significant events
- temporal expressions associated with events

Entity IDs must be unique temporary identifiers such as "e1", "e2", "e3".
Event IDs must be unique temporary identifiers such as "ev1", "ev2", "ev3".

Use entity IDs when referencing entities in relations and events.

Only create a relation when it is explicitly stated or strongly supported by the synopsis.
Do not infer relationships from general world knowledge.

Do not duplicate entities. If the same entity appears multiple times, represent it once and reuse its ID.

Do not duplicate events that describe the same occurrence.

Return only the requested structured data.
            `.trim()

export default promptAnalysisSynopsis