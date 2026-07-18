# Temporary report viewer

Use the shared viewer to present completed assessments and comparisons without writing persistent reports into the user's project.

## Lifecycle

1. Read `report-template.md` and prepare the report payload below after the final recommendation exists.
2. Resolve the OS temp directory, create `<temp>/search-before-build/`, and write the payload to `report-input.json` there.
3. Run `node <package-root>/scripts/render-report.mjs --input <payload-path> --consume-input`. Use the package root that contains `scripts/`; do not assume the user's current project contains the renderer. The script validates the payload and atomically overwrites `<temp>/search-before-build/latest.html`.
4. Open the returned HTML path when the host supports opening local files. Otherwise return its absolute path so the user can open it.
5. Keep the recommendation in the conversation as well. The viewer supplements the answer; it must not be the only place where the final decision appears.

Never write a competitor Markdown report into the current project during this workflow. Persistence is optional and happens only when the user explicitly asks for it after seeing the result. A download or copy action inside the viewer is already an explicit user choice and needs no earlier confirmation.

If Node.js is unavailable or rendering fails, return the same information in the conversation and explain that the temporary viewer could not be generated. Do not fall back to creating reports in the project.

## Payload contract

Write UTF-8 JSON with this shape. Use the target display language for every free-text field.

```json
{
  "schemaVersion": 1,
  "language": "zh-CN",
  "mode": "assess",
  "topic": "A short report title",
  "projectName": "Current project or idea",
  "generatedAt": "2026-07-18T10:00:00Z",
  "recommendation": {
    "value": "Adapt",
    "reason": "The main reason for the decision.",
    "reusableOption": "The strongest product, project, or component to reuse.",
    "biggestUnknown": "The most important unresolved fact."
  },
  "fingerprint": [
    { "label": "Primary task", "value": "What the user needs to accomplish" }
  ],
  "coverage": [
    { "label": "GitHub", "status": "used", "detail": "Repositories and source inspected" }
  ],
  "capabilities": [
    {
      "name": "A material capability",
      "current": { "status": "native", "note": "Verified current behavior" },
      "candidates": {
        "candidate-id": { "status": "partial", "note": "Material limitation" }
      }
    }
  ],
  "competitors": [
    {
      "id": "candidate-id",
      "name": "Candidate name",
      "url": "https://example.com",
      "category": "Ready-to-use product",
      "overview": "Positioning, primary users, and operating model.",
      "comparison": [
        { "dimension": "Core workflow", "candidate": "Verified behavior", "current": "Current behavior" }
      ],
      "notableDesigns": [
        { "title": "Design or mechanism", "detail": "Verified behavior and why it matters" }
      ],
      "reusableLessons": [
        "A specific behavior that can be adopted, tested, or learned from"
      ],
      "summary": "The most important difference.",
      "coverageNote": "Any candidate-specific evidence limitation.",
      "sources": [
        { "label": "Primary source", "url": "https://example.com/docs" }
      ]
    }
  ],
  "unknowns": ["A material evidence gap"],
  "labels": {}
}
```

Use exactly `assess` or `compare` for `mode`. Use exactly `Build`, `Adapt`, `Use existing`, or `Stop` for `recommendation.value`. Use exactly `used`, `limited`, or `unavailable` for coverage status. Use the stable support enums from `research-method.md` in every capability cell.

Candidate IDs must be unique and must match the keys used under `capabilities[].candidates`. Omit a candidate entry when that capability was not compared; do not invent evidence to fill the matrix.

Keep stable support enums inside capability cells only. When a detailed `comparison` row discusses a support level, use the localized display label from `report-template.md` in its prose; never place a raw enum in those strings. The viewer exports each candidate's `comparison` rows verbatim to Markdown.

## Language

The viewer has built-in Chinese and English interface text. Use a language tag beginning with `zh` for Chinese or `en` for English.

For every other target language, translate the free text and provide localized interface strings in `labels`. Supply every key reported by the renderer's `REQUIRED_CUSTOM_LABELS` contract; the key names describe their UI purpose. Support-enum labels still fall back to English, as required by `report-template.md`.

## Visual behavior

The viewer is a self-contained, responsive HTML page with no CDN or runtime network dependency. It presents:

1. the final recommendation and its reasoning
2. the functional fingerprint and search coverage
3. the material capability matrix
4. one detailed card per strong competitor
5. material unknowns and source links

Each competitor card owns its own **Save Markdown** and **Copy Markdown** actions. Those exports follow `report-template.md` and exclude the necessity check and final recommendation. Do not add a silent auto-save action or an action that claims to write directly into the user's repository.
