---
name: search-before-build-assess
description: Calmly decide whether a digital product or coding idea is worth building by clarifying the real problem, checking necessity, researching existing solutions, and recommending Build, Adapt, Use existing, or Stop. Use only when the user explicitly requests an assessment before starting a project.
---

# Assess Whether to Build

Help a non-expert slow down before spending time and tokens. Be candid, practical, and easy to understand.

## Rules

- Read the user's explicit request, the conversation, and any supplied local material before asking anything.
- Use accurate everyday language. Explain an unavoidable technical term in one short phrase.
- Never ask for a "user persona," "value proposition," "market segment," or "business loop."
- Ask only a question whose answer could change the recommendation. Ask one question per turn.
- Ask at most five questions total. Do not ask when the available information is sufficient.
- During clarification, do not narrate the workflow or use headings. Use at most one sentence to confirm the idea, optionally one sentence for the decisive unknown, then ask the single question.
- Separate facts, inferences, and unknowns. Never fill a gap with enthusiasm or guesswork.
- Do not create files during clarification or the necessity check.

Read `references/conversation-and-decision.md` from this package before starting.

## Workflow

1. Summarize the idea in plain language. Internally identify who uses it, the real problem, the situation, the current workaround, why building is needed, whether it is personal or public, and the most important function.
2. Ask only for missing information that materially affects the decision. Follow the question order and stopping rules in the reference.
3. Give a short necessity check in the conversation. State what is fact, inference, and unknown. If the case is weak, say so directly, but let the user choose to continue.
4. Before research, convert the request into a functional fingerprint. Confirm only if a remaining ambiguity would change the search.
5. Invoke the bundled `search-before-build-research` skill with the fingerprint and instruct it not to write files. If that skill cannot be invoked, follow its `SKILL.md` workflow inline.
6. Combine the necessity check and research evidence into exactly one recommendation: `Build`, `Adapt`, `Use existing`, or `Stop`. Keep this decision in the conversation; do not put it in competitor reports.
7. Once research has run, read `references/report-template.md` from this package. Write one report per strong competitor to `docs/search-before-build/<topic-slug>/<competitor-slug>.md`. Update the canonical file when it already exists; do not create timestamped variants or a combined multi-competitor table. Keep the earlier clarification and necessity analysis out of every report.
8. Return the recommendation, the main reason, the most reusable option, all report paths, and the biggest remaining unknown. Do not begin implementation.

The user may override the recommendation. Record that choice without weakening or rewriting the evidence.
