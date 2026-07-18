---
name: search-before-build-assess
description: Calmly decide whether a digital product or coding idea is worth building by clarifying the real problem, checking necessity, researching existing solutions, and recommending Build, Adapt, Use existing, or Stop. Use when the user explicitly requests an assessment before starting a project. Also use for a standalone request to enable, configure, or improve GitHub deep search when no existing project material is supplied.
---

# Assess Whether to Build

Help a non-expert slow down before spending time and tokens. Be candid, practical, and easy to understand.

## Rules

- Read the user's explicit request, the conversation, and any supplied local material before asking anything.
- Use accurate everyday language. Explain an unavoidable technical term in one short phrase.
- Never ask for a "user persona," "value proposition," "market segment," or "business loop."
- Ask only a question whose answer could change the recommendation. Ask one question per turn.
- Prioritize the three essential facts defined in `references/conversation-and-decision.md` before research. Infer them from the user's description when the meaning is clear; never ask the user to repeat or confirm information already supplied or safely inferred. If an essential remains unclear after five questions, continue from the best current understanding and mark the gap as unknown.
- Ask at most five questions total. Five is a ceiling, not a target. After the essentials are clear, ask a secondary question only when it would materially sharpen the recommendation or search.
- During clarification, do not narrate the workflow or use headings. Use at most one sentence to confirm the idea, optionally one sentence for the decisive unknown, then ask the single question.
- Separate facts, inferences, and unknowns. Never fill a gap with enthusiasm or guesswork.
- Do not create files during clarification or the necessity check.

Read `references/conversation-and-decision.md` from this package before starting.

If the user expresses GitHub deep-search enhancement intent, read and follow the enhancement flow in `references/github-retrieval.md`. If enhancement is the entire request, report the capability or setup result and stop without starting an assessment.

## Workflow

1. Summarize the idea in plain language and build the prioritized clarification brief defined in the reference, marking each item as fact, inference, or unknown.
2. Resolve missing essentials in priority order. Once they are clear, stop or use the remaining question budget sparingly for decision-changing secondary questions. After five questions, stop asking and continue with explicit unknowns. Follow the reference's question and stopping rules.
3. Give a short necessity check in the conversation. State what is fact, inference, and unknown. If the case is weak, say so directly, but let the user choose to continue.
4. Before research, convert the request into a functional fingerprint. Confirm only if a remaining ambiguity would change the search.
5. Read and execute all of `references/research-method.md` to build the evidence package before making a final recommendation.
6. Act as the sole final decision-maker for idea assessment. Using the recommendation meanings in `references/conversation-and-decision.md`, combine the necessity check and research evidence into exactly one recommendation: `Build`, `Adapt`, `Use existing`, or `Stop`. Keep this decision in the conversation; do not put it in competitor reports.
7. Once research has run, read `references/report-template.md` and `references/report-viewer.md` from this package. Render the result to the shared temporary HTML viewer. Do not write competitor reports into the user's project unless the user explicitly asks to persist selected competitors after seeing the result.
8. Return the recommendation, the main reason, the most reusable option, the temporary viewer path, and the biggest remaining unknown. Do not begin implementation.

If the user later asks to persist one or more competitors, write only those reports to `docs/search-before-build/<topic-slug>/<competitor-slug>.md` under the contract in `references/report-template.md`. Update canonical files and return their paths.

The user may override the recommendation. Record that choice without weakening or rewriting the evidence.
