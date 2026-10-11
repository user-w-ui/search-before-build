---
name: assess
description: Calmly decide whether a digital product or coding idea, or an existing plan, prototype, or repository, is worth building or continuing by reading any supplied material, clarifying only the gaps, checking necessity, researching existing solutions, and recommending Build, Adapt, Use existing, or Stop. Use when the user explicitly requests an assessment before starting or continuing a project. Also use for a standalone request to enable, configure, or improve GitHub deep search.
---

# Assess Whether to Build

Help a non-expert slow down before spending time and tokens. Be candid, practical, and easy to understand. The user may bring only an idea, or material about an existing project: a plan, prototype, repository, documentation, or promotional images.

Paths to package files in this skill are relative to the directory containing this `SKILL.md`; resolve them to absolute paths before reading or running them. Paths described as being in the user's current project are relative to that project instead.

Read `../../references/conversation-and-decision.md` before starting. It defines the intent model, how to ask through the question channel, research readiness, the pre-research confirmation, the necessity gates, and the recommendation meanings.

## Rules

- Read the request, the conversation, and any supplied material before asking anything. For code, prefer codebase knowledge-graph tools for code discovery when available; fall back to read-only file inspection.
- Describe an existing project from current evidence, not aspirations: mark each capability implemented, planned, or unknown. Do not use project names, README claims, promotional images, Stars, or popularity as proof of functional similarity.
- Ask one question per turn, and only when the answer could materially change the understanding, necessity check, fingerprint, research direction, or recommendation. Never ask about what the supplied material already answers, and never ask the user to repeat information already supplied or safely inferred.
- Ask at most five information-seeking questions total. Five is a ceiling, not a target: do not stop merely because the surface function and delivery form are known while a material, user-answerable unknown still blocks a reliable fingerprint or comparison.
- During clarification, do not narrate the workflow or use headings.
- Match the user's language and demonstrated level of expertise. Explain an unavoidable technical term in one short phrase.
- Separate facts, inferences, and unknowns. Never fill a gap with enthusiasm or guesswork.
- Do not create files during clarification or the necessity check. Do not modify source code, plans, or unrelated documentation.

If the user expresses GitHub deep-search enhancement intent, read and follow the enhancement flow in `../../references/github-retrieval.md`. If enhancement is the entire request, report the capability or setup result and stop without starting an assessment.

## Workflow

1. Read the supplied material and build the prioritized intent brief from the intent model, marking each item as fact, inference, or unknown. For an existing project, also establish its baseline: intended user, problem, main workflow, inputs and outputs, operating environment, must-have capability, current maturity, and hard constraints.
2. Ask only about the gaps the material leaves, highest-information gap first, and update the whole brief after each answer. Skip questions when the research-readiness conditions are already met. After five questions, continue from the best current understanding with explicit unknowns.
3. Before the necessity check or any external research, present the concise pre-research understanding summary, including the project's current state when material was supplied, and ask the user to verify it. This confirmation does not count toward the five-question limit. Stop the turn and wait; do not research until the user confirms. Reconfirm when a correction materially changes the understanding.
4. Give a short necessity check in the conversation against the necessity gates. For an existing project, frame it as whether continuing on the current path is still worth the investment. If the case is weak, say so directly, but let the user choose to continue.
5. Convert the confirmed understanding into a functional fingerprint. Do not add assumptions absent from the confirmation.
6. Read and execute all of `../../references/research-method.md` and `../../references/decision-kernel.md` to build the evidence package.
7. Consume the evidence package and its key comparison at the same product or technical layer. Do not relabel capabilities independently.
8. Act as the sole final decision-maker for the assessment: combine the necessity check and the evidence into exactly one of `Build`, `Adapt`, `Use existing`, or `Stop`, using the recommendation meanings. Keep the decision and the necessity discussion in the conversation, never in competitor reports.
9. Read `../../references/report-template.md` and `../../references/report-viewer.md`. Render the result to the shared temporary HTML viewer. Do not write competitor reports into the user's project unless the user explicitly asks to persist selected competitors after seeing the result; then follow the persistence boundary in `report-template.md` and return the file paths.
10. Return the recommendation, the main reason, the most reusable option or pieces, the temporary viewer path, and the biggest remaining unknown. Do not begin implementation.

The user may override the recommendation. Record that choice without weakening or rewriting the evidence.
