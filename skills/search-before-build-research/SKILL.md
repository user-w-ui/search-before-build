---
name: search-before-build-research
description: Research and GitHub-search enhancement for Search Before Build. Given a functional fingerprint, discover and verify existing products, repositories, packages, models, plugins, templates, and components. Also use when the user asks to enable GitHub deep search, configure GitHub MCP, or add GitHub search enhancement for Search Before Build.
---

# Research Existing Solutions

Find what already solves the user's problem. Normal research is read-only: never create, edit, or delete files. The only exception is the bundled GitHub MCP setup flow, which may download the official binary and update the current Agent's MCP configuration after explicit user approval.

Read all of `references/research-method.md` and `references/search-sources.md` from this package before searching. Select only relevant sources. Before GitHub research or when the user requests GitHub enhancement, also read `references/github-retrieval.md`.

## Workflow

1. Derive or accept a functional fingerprint. If the core task or must-have capability is too unclear to search accurately, ask one plain question and wait.
2. Detect available web search, browser, CLI, platform-specific skill, plugin, MCP, and local code-discovery capabilities. For GitHub, follow the dedicated order: first use suitable GitHub tools already exposed by an MCP, plugin, connector, or equivalent integration; only if none are exposed, check for an available and authenticated `gh` CLI; only if both routes are unavailable, offer the optional MCP setup. Never install or change configuration without explicit user approval.
3. If the user explicitly requested GitHub enhancement, first complete the GitHub capability check above. When an exposed GitHub tool or authenticated `gh` CLI is already usable, use it and report that enhancement is already available. Only when neither route is usable, run the bundled one-time setup script as directed by `references/github-retrieval.md`, report the result, and stop. Do not return a manual installation tutorial.
4. Run at least a basic live web search. If live search is unavailable, stop and use the exact no-network statement from the GitHub reference; never claim that no similar project exists.
5. Use the adaptive funnel and platform routes in the reference. Search both Chinese and English when the market is Chinese or unknown.
6. Build four pools: ready-to-use products, adaptable projects, reusable components, and the current no-build workaround.
7. Deeply verify the strongest candidates with primary sources. Do not infer functionality from a name, snippet, topic tag, directory name, Stars, or download count.
8. Compare candidates against the fingerprint. Label each important capability as `native`, `partial`, `extensible`, `unsupported`, or `unverified`.
9. Return the structured result below. Do not save a report; the calling workflow owns persistence.

## Return shape

- **Functional fingerprint**: user, situation, core task, input/output, operating mode, must-have capability, acceptable and unacceptable substitutes.
- **Search coverage**: date, languages, platforms, tools used, unavailable channels, and search-depth limits.
- **Candidates**: category, official identity, short fit explanation, adoption cost, maintenance evidence, license/price, and primary sources.
- **Key comparison**: only decision-changing capabilities, using the five support labels.
- **Reusable parts**: products, repositories, packages, models, templates, or design ideas that avoid rebuilding.
- **Recommendation**: one of `Build`, `Adapt`, `Use existing`, or `Stop`, plus the decisive evidence.
- **Unknowns**: facts that could materially change the result.

Keep cells and explanations compact. Link to primary sources, never search-result pages.
