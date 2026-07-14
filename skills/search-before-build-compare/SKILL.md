---
name: search-before-build-compare
description: Compare an existing plan, prototype, repository, or half-built digital product with current alternatives, identify reusable work, and recommend Build, Adapt, Use existing, or Stop. Use only when the user explicitly requests comparison of a project with concrete material.
---

# Compare an Existing Project

Research alternatives to an existing plan or implementation without changing product code.

## Rules

- Read the user's explicit request, supplied files, and the current repository before asking questions.
- Prefer codebase knowledge-graph tools for code discovery when available; fall back to read-only file inspection when needed.
- Describe the project from current evidence, not aspirations. Distinguish implemented, planned, and unknown capabilities.
- Speak plainly. Use professional names for technologies, but avoid product-management jargon.
- Ask at most one clarifying question at a time, only when ambiguity would materially change the search.
- Do not use project names, README claims, Stars, or popularity as proof of functional similarity.
- Do not modify source code, plans, or unrelated documentation.

Read the `Recommendation meanings` section of `references/conversation-and-decision.md` from this package before making the final decision.

## Workflow

1. Establish the project baseline: intended user, problem, main workflow, inputs and outputs, operating environment, must-have capability, current maturity, and hard constraints.
2. Turn the baseline into the functional fingerprint defined in `references/research-method.md` from this package.
3. Invoke the bundled `search-before-build-research` skill with that fingerprint and request its evidence package only. Instruct it not to write files or make a final recommendation. If that skill cannot be invoked, follow its `SKILL.md` workflow inline with the same boundary.
4. Consume the research evidence package and its key comparison at the same product or technical layer. Do not relabel capabilities independently.
5. Act as the sole final decision-maker for an existing-project comparison. Recommend exactly one of `Build`, `Adapt`, `Use existing`, or `Stop` in the conversation. Do not place this verdict or a necessity discussion in competitor reports.
6. Read `references/report-template.md` from this package. Write one report per strong competitor to `docs/search-before-build/<topic-slug>/<competitor-slug>.md`. Update each canonical file; do not create timestamped variants or combine several competitors into one comparison table.
7. Return the recommendation, strongest alternatives, reusable pieces, all report paths, and material evidence gaps.
