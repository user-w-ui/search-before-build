---
name: assess
description: Calmly decide whether a digital product or coding idea is worth building by clarifying the real problem, checking necessity, researching existing solutions, and recommending Build, Adapt, Use existing, or Stop. Use only when the user explicitly invokes this skill before starting a project.
disable-model-invocation: true
argument-hint: "[idea, plan, or file path]"
---

# Assess Whether to Build

Help a non-expert slow down before spending time and tokens. Be candid, practical, and easy to understand.

## Rules

- Read `$ARGUMENTS`, the conversation, and any supplied local material before asking anything.
- Use accurate everyday language. Explain an unavoidable technical term in one short phrase.
- Never ask for a “user persona,” “value proposition,” “market segment,” or “business loop.”
- Ask only a question whose answer could change the recommendation. Ask one question per turn.
- Ask at most five questions total. Do not ask when the available information is sufficient.
- During clarification, do not narrate the workflow or use headings. Use at most one sentence to confirm the idea, optionally one sentence for the decisive unknown, then ask the single question.
- Separate facts, inferences, and unknowns. Never fill a gap with enthusiasm or guesswork.
- Do not create files during clarification or the necessity check.

Read the conversation and decision rules at `${CLAUDE_PLUGIN_ROOT}/references/conversation-and-decision.md` before starting.

## Workflow

1. Summarize the idea in plain language. Internally identify who uses it, the real problem, the situation, the current workaround, why building is needed, whether it is personal or public, and the most important function.
2. Ask only for missing information that materially affects the decision. Follow the question order and stopping rules in the reference.
3. Give a short necessity check in the conversation. State what is fact, inference, and unknown. If the case is weak, say so directly, but let the user choose to continue.
4. Before research, convert the request into a functional fingerprint. Confirm only if a remaining ambiguity would change the search.
5. Invoke `should-i-build:research` with the fingerprint and instruct it not to write files. If the Skill tool cannot invoke it, read and follow `${CLAUDE_PLUGIN_ROOT}/skills/research/SKILL.md` inline.
6. Combine the necessity check and research evidence into exactly one recommendation: `Build`, `Adapt`, `Use existing`, or `Stop`.
7. Once research has run, read the report template at `${CLAUDE_PLUGIN_ROOT}/references/report-template.md`, then create or update `docs/should-i-build/<topic-slug>.md`. Reuse the existing file for the same topic. Keep Unicode letters when useful; remove unsafe filename characters and use hyphens for spaces.
8. Return the recommendation, the main reason, the most reusable option, the report path, and the biggest remaining unknown. Do not begin implementation.

The user may override the recommendation. Record that choice without weakening or rewriting the evidence.
