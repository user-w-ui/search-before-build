---
name: compare
description: Compare an existing plan, prototype, repository, or half-built digital product with current alternatives, identify reusable work, and recommend Build, Adapt, Use existing, or Stop. Use only when the user explicitly invokes this skill for a project that already has concrete material.
disable-model-invocation: true
argument-hint: "[plan, repository, prototype, or path]"
---

# Compare an Existing Project

Research alternatives to an existing plan or implementation without changing product code.

## Rules

- Read `$ARGUMENTS`, supplied files, and the current repository before asking questions.
- Prefer codebase knowledge-graph tools for code discovery when available; fall back to read-only file inspection when needed.
- Describe the project from current evidence, not aspirations. Distinguish implemented, planned, and unknown capabilities.
- Speak plainly. Use professional names for technologies, but avoid product-management jargon.
- Ask at most one clarifying question at a time, only when ambiguity would materially change the search.
- Do not use project names, README claims, Stars, or popularity as proof of functional similarity.
- Do not modify source code, plans, or unrelated documentation.

## Workflow

1. Establish the project baseline: intended user, problem, main workflow, inputs and outputs, operating environment, must-have capability, current maturity, and hard constraints.
2. Turn the baseline into the functional fingerprint defined in the research method at `${CLAUDE_PLUGIN_ROOT}/references/research-method.md`.
3. Invoke `should-i-build:research` with that fingerprint and instruct it not to write files. If the Skill tool cannot invoke it, read and follow `${CLAUDE_PLUGIN_ROOT}/skills/research/SKILL.md` inline.
4. Compare verified behavior at the same product or technical layer. Mark every material capability as native, partial, extensible, unsupported, or unverified.
5. Recommend exactly one of `Build`, `Adapt`, `Use existing`, or `Stop` in the conversation. Do not place this verdict or a necessity discussion in competitor reports.
6. Read the report template at `${CLAUDE_PLUGIN_ROOT}/references/report-template.md`. Write one report per strong competitor to `docs/should-i-build/<topic-slug>/<competitor-slug>.md`. Update each canonical file; do not create timestamped variants or combine several competitors into one comparison table.
7. Return the recommendation, strongest alternatives, reusable pieces, all report paths, and material evidence gaps.
