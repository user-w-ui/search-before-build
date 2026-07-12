---
name: research
description: Research existing products, repositories, packages, models, plugins, templates, and components that may solve a proposed digital-product or coding need. Use for competitor discovery, build-versus-buy research, reusable-solution searches, and evidence-backed functional comparison. Match actual capabilities rather than similar names.
---

# Research Existing Solutions

Find what already solves the user's problem. This skill is read-only: never create, edit, or delete files.

Read all of [the research method](../../references/research-method.md) before searching.

## Workflow

1. Derive or accept a functional fingerprint. If the core task or must-have capability is too unclear to search accurately, ask one plain question and wait.
2. Detect available Web search, browser, CLI, platform-specific Skill, plugin, MCP, and local code-discovery capabilities. Prefer a reliable platform-specific capability when available. Never require one.
3. Run at least a basic live Web search. If live search is unavailable, stop and explain that a reliable current comparison cannot be completed.
4. Use the adaptive funnel and platform routes in the reference. Search both Chinese and English when the market is Chinese or unknown.
5. Build four pools: ready-to-use products, adaptable projects, reusable components, and the current no-build workaround.
6. Deeply verify the strongest candidates with primary sources. Do not infer functionality from a name, snippet, topic tag, directory name, Stars, or download count.
7. Compare candidates against the fingerprint. Label each important capability as `原生支持`, `部分支持`, `可通过扩展实现`, `不支持`, or `尚未验证`.
8. Return the structured result below. Do not save a report; the calling workflow owns persistence.

## Return shape

- **功能指纹**: user, situation, core task, input/output, operating mode, must-have capability, acceptable and unacceptable substitutes.
- **检索覆盖**: date, languages, platforms, tools used, unavailable channels, and search-depth limits.
- **候选清单**: category, official identity, short fit explanation, adoption cost, maintenance evidence, license/price, and primary sources.
- **重点对照**: only decision-changing capabilities, using the five support labels.
- **可复用部分**: products, repositories, packages, models, templates, or design ideas that avoid rebuilding.
- **建议裁决**: one of `Build`, `Adapt`, `Use existing`, or `Stop`, plus the decisive evidence.
- **未知信息**: facts that could materially change the result.

Keep cells and explanations compact. Link to primary sources, never search-result pages.
