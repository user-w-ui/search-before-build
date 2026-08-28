---
name: search-before-build-compare
description: Compare an existing plan, prototype, repository, or half-built digital product with current alternatives, identify reusable work, and recommend Build, Adapt, Use existing, or Stop. After entering, it lets the user choose whether to align the real need before searching, then researches alternatives. Use when the user explicitly requests comparison of a project with concrete material. Also use when a GitHub deep-search enhancement request includes an existing plan, prototype, repository, or other concrete project material.
---

# Compare an Existing Project

Research alternatives to an existing plan or implementation without changing product code.

## Rules

- Read the user's explicit request, supplied files, and the current repository before asking questions.
- Prefer codebase knowledge-graph tools for code discovery when available; fall back to read-only file inspection when needed.
- Describe the project from current evidence, not aspirations. Distinguish implemented, planned, and unknown capabilities.
- Speak plainly. Use professional names for technologies, but avoid product-management jargon.
- Separate two things: what is already built or written (read it from the supplied material; never re-ask it) and the real need the project is meant to serve (often vague in an early plan). Both shape the search.
- After establishing the baseline, let the user decide whether to align the real need before searching; do not judge this yourself from how vague or complete the material looks. Offer one clear choice—align first, or compare directly—and briefly say what alignment covers.
- If the user chooses to align, clarify only the real need behind the project: ask one focused question per turn, at most five information-seeking questions total, and only about gaps that would change the candidate set or comparison. Do not re-ask what the material already supplies. Clarify only to the depth that makes retrieval accurate; do not redesign or complete the plan. If the user declines, build the fingerprint from the baseline and search directly.
- Do not use project names, README claims, Stars, or popularity as proof of functional similarity.
- Do not modify source code, plans, or unrelated documentation.

When the user chooses to align the real need, read and follow the intent-model, `How to ask`, and `Pre-research confirmation` sections of `references/conversation-and-decision.md` from this package to clarify just enough for accurate retrieval. Read the `Recommendation meanings` section of the same reference before making the final decision.

If the user expresses GitHub deep-search enhancement intent, read and follow the enhancement flow in `references/github-retrieval.md`. If enhancement is the entire request, report the capability or setup result and stop without starting a comparison.

## Workflow

1. Establish the project baseline from the supplied material and repository: intended user, problem, main workflow, inputs and outputs, operating environment, must-have capability, current maturity, and hard constraints. Distinguish what is implemented, what is only planned, and what is still unknown.
2. Right after the baseline, ask the user once whether to align the real need before searching, or compare directly. Present it as a single clear choice and briefly name what alignment covers (the core problem, must-have capability, intended user, and why existing alternatives fall short). Do not decide this yourself from how vague or complete the material looks. Stop the turn and wait for the user's choice.
3. If the user chooses to align, clarify the real need using the intent model and clarification rules in `references/conversation-and-decision.md`: one focused question per turn, at most five information-seeking questions, only about gaps that would change the candidate set or comparison. Do not re-ask for anything the material already supplies or that can be safely inferred. Then present a concise pre-research summary of the confirmed real need, the project's current state, and the must-have capability, and ask the user to confirm or correct it; this confirmation does not count toward the five-question limit. Stop the turn and wait; do not research until the user confirms. If the user declines alignment, proceed directly from the baseline.
4. Turn the baseline into the functional fingerprint defined in `references/research-method.md` from this package.
5. Read and execute all of `references/research-method.md` and `references/decision-kernel.md` to build the evidence package before making a final recommendation. Use the packaged kernel when available, but never treat its lexical `candidate_mention` as verified capability support.
6. Consume the research evidence package and its key comparison at the same product or technical layer. Do not relabel capabilities independently.
7. Act as the sole final decision-maker for an existing-project comparison. Recommend exactly one of `Build`, `Adapt`, `Use existing`, or `Stop` in the conversation. Do not place this verdict or a necessity discussion in competitor reports.
8. Read `references/report-template.md` and `references/report-viewer.md` from this package. Render the result to the shared temporary HTML viewer. Do not write competitor reports into the user's project unless the user explicitly asks to persist selected competitors after seeing the result.
9. Return the recommendation, strongest alternatives, reusable pieces, the temporary viewer path, and material evidence gaps.

If the user later asks to persist one or more competitors, write only those reports to `docs/search-before-build/<topic-slug>/<competitor-slug>.md` under the contract in `references/report-template.md`. Update canonical files and return their paths.
