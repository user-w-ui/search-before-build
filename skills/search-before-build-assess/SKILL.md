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
- Ask only a question whose answer could materially change the problem understanding, necessity check, functional fingerprint, research direction, or recommendation. Ask one question per turn.
- Build the intent model defined in `references/conversation-and-decision.md` before research. Infer details when the meaning is clear; never ask the user to repeat information already supplied or safely inferred.
- Ask at most five information-seeking questions total. Five is a ceiling, not a target, but do not stop merely because the surface function and delivery form are known. Use the available budget while a material, user-answerable unknown still blocks a reliable fingerprint or comparison.
- During clarification, do not narrate the workflow or use headings. Use at most one sentence to confirm the idea, optionally one sentence for the decisive unknown, then ask the single question.
- Match the user's language and demonstrated level of expertise. When useful, use a few familiar alternatives from general knowledge as contrast prompts, not as verified research findings.
- Separate facts, inferences, and unknowns. Never fill a gap with enthusiasm or guesswork.
- Do not create files during clarification or the necessity check.

Read `references/conversation-and-decision.md` from this package before starting.

If the user expresses GitHub deep-search enhancement intent, read and follow the enhancement flow in `references/github-retrieval.md`. If enhancement is the entire request, report the capability or setup result and stop without starting an assessment.

## Workflow

1. Build the prioritized intent brief defined in the reference, marking each item as fact, inference, or unknown.
2. Resolve the highest-information missing dimension first. After each answer, update the whole brief and choose the next question from the remaining material unknowns. After five information-seeking questions, stop asking and continue from the best current understanding with explicit unknowns.
3. Before the necessity check or any external research, present the concise pre-research understanding summary defined in the reference and ask the user to verify it. This confirmation does not count toward the five-question limit. Stop the turn and wait; do not research until the user confirms. Incorporate corrections and reconfirm when they materially change the understanding.
4. Give a short necessity check in the conversation. State what is fact, inference, and unknown. If the case is weak, say so directly, but let the user choose to continue.
5. Convert the confirmed understanding into a functional fingerprint. Do not silently add assumptions that were absent from the confirmation.
6. Read and execute all of `references/research-method.md` to build the evidence package before making a final recommendation.
7. Act as the sole final decision-maker for idea assessment. Using the recommendation meanings in `references/conversation-and-decision.md`, combine the necessity check and research evidence into exactly one recommendation: `Build`, `Adapt`, `Use existing`, or `Stop`. Keep this decision in the conversation; do not put it in competitor reports.
8. Once research has run, read `references/report-template.md` and `references/report-viewer.md` from this package. Render the result to the shared temporary HTML viewer. Do not write competitor reports into the user's project unless the user explicitly asks to persist selected competitors after seeing the result.
9. Return the recommendation, the main reason, the most reusable option, the temporary viewer path, and the biggest remaining unknown. Do not begin implementation.

If the user later asks to persist one or more competitors, write only those reports to `docs/search-before-build/<topic-slug>/<competitor-slug>.md` under the contract in `references/report-template.md`. Update canonical files and return their paths.

The user may override the recommendation. Record that choice without weakening or rewriting the evidence.
