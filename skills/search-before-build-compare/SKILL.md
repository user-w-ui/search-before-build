---
name: search-before-build-compare
description: Compare an existing plan, prototype, repository, or half-built digital product with current alternatives, identify reusable work, and recommend Build, Adapt, Use existing, or Stop. Use when the user explicitly requests comparison of a project with concrete material. Also use when a GitHub deep-search enhancement request includes an existing plan, prototype, repository, or other concrete project material.
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

If the user expresses GitHub deep-search enhancement intent, read and follow the enhancement flow in `references/github-retrieval.md`. If enhancement is the entire request, report the capability or setup result and stop without starting a comparison.

## Workflow

1. Establish the project baseline: intended user, problem, main workflow, inputs and outputs, operating environment, must-have capability, current maturity, and hard constraints.
2. Turn the baseline into the functional fingerprint defined in `references/research-method.md` from this package.
3. Read and execute all of `references/research-method.md` to build the evidence package before making a final recommendation.
4. Consume the research evidence package and its key comparison at the same product or technical layer. Do not relabel capabilities independently.
5. Act as the sole final decision-maker for an existing-project comparison. Recommend exactly one of `Build`, `Adapt`, `Use existing`, or `Stop` in the conversation. Do not place this verdict or a necessity discussion in competitor reports.
6. Read `references/report-template.md` from this package. Write one report per strong competitor to `docs/search-before-build/<topic-slug>/<competitor-slug>.md`. Update each canonical file; do not create timestamped variants or combine several competitors into one comparison table.
7. Return the recommendation, strongest alternatives, reusable pieces, all report paths, and material evidence gaps.
