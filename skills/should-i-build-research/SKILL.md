---
name: should-i-build-research
description: Internal candidate-research step for Should I Build. Given a functional fingerprint, discover and verify existing products, repositories, packages, models, plugins, templates, and components, then return a structured result. Use only when invoked by a Should I Build workflow.
---

# Research Existing Solutions

Find what already solves the user's problem. This skill is read-only: never create, edit, or delete files.

Read all of `references/research-method.md` from this package before searching.

## Workflow

1. Derive or accept a functional fingerprint. If the core task or must-have capability is too unclear to search accurately, ask one plain question and wait.
2. Detect available web search, browser, CLI, platform-specific skill, plugin, MCP, and local code-discovery capabilities. Prefer a reliable platform-specific capability when available. Never require one.
3. Run at least a basic live web search. If live search is unavailable, stop and explain that a reliable current comparison cannot be completed.
4. Use the adaptive funnel and platform routes in the reference. Search both Chinese and English when the market is Chinese or unknown.
5. Build four pools: ready-to-use products, adaptable projects, reusable components, and the current no-build workaround.
6. Deeply verify the strongest candidates with primary sources. Do not infer functionality from a name, snippet, topic tag, directory name, Stars, or download count.
7. Compare candidates against the fingerprint. Label each important capability as `native`, `partial`, `extensible`, `unsupported`, or `unverified`.
8. Return the structured result below. Do not save a report; the calling workflow owns persistence.

## Return shape

- **Functional fingerprint**: user, situation, core task, input/output, operating mode, must-have capability, acceptable and unacceptable substitutes.
- **Search coverage**: date, languages, platforms, tools used, unavailable channels, and search-depth limits.
- **Candidates**: category, official identity, short fit explanation, adoption cost, maintenance evidence, license/price, and primary sources.
- **Key comparison**: only decision-changing capabilities, using the five support labels.
- **Reusable parts**: products, repositories, packages, models, templates, or design ideas that avoid rebuilding.
- **Recommendation**: one of `Build`, `Adapt`, `Use existing`, or `Stop`, plus the decisive evidence.
- **Unknowns**: facts that could materially change the result.

Keep cells and explanations compact. Link to primary sources, never search-result pages.
