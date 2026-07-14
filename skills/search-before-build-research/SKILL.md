---
name: search-before-build-research
description: Research and GitHub-search enhancement for Search Before Build. Given a functional fingerprint, discover and verify existing products, repositories, packages, models, plugins, templates, and components. Also use when the user asks to enable GitHub deep search, configure GitHub MCP, or add GitHub search enhancement for Search Before Build.
---

# Research Existing Solutions

Find what already solves the user's problem. Normal research is read-only: never create, edit, or delete files. The only exception is the bundled GitHub MCP setup flow, which may download the official binary and update the current Agent's MCP configuration after explicit user approval.

Read all of `references/research-method.md` and `references/search-sources.md` from this package before searching. Select only relevant sources. Before GitHub research or when the user requests GitHub enhancement, also read `references/github-retrieval.md`.

## Workflow

1. Derive or accept a functional fingerprint. If the core task or must-have capability is too unclear to search accurately, ask one plain question and wait.
2. Detect and use external research routes under `references/research-method.md`. For every GitHub task, follow the capability check, fallback order, consent rules, and coverage wording in `references/github-retrieval.md`; do not install or change configuration without explicit user approval.
3. If the user explicitly requested GitHub enhancement, complete that referenced capability check first. Use an existing route when one works; otherwise obtain explicit installation consent before running the bundled setup script, report the result, and stop. Do not return a manual installation tutorial.
4. Continue with any relevant external route that works. Stop only when all external routes are unavailable, using the exact statement in `references/research-method.md`.
5. Use the adaptive funnel and platform routes in the reference. Search both Chinese and English when the market is Chinese or unknown.
6. Build four pools: ready-to-use products, adaptable projects, reusable components, and the current no-build workaround.
7. Deeply verify the strongest candidates with primary sources. Do not infer functionality from a name, snippet, topic tag, directory name, Stars, or download count.
8. Compare candidates against the fingerprint. Label each important capability as `原生支持`, `部分支持`, `可通过扩展实现`, `不支持`, or `尚未验证`.
9. Return the structured result below. Do not save a report; the calling workflow owns persistence.

## Return shape

- **Functional fingerprint**: user, situation, core task, input/output, operating mode, must-have capability, acceptable and unacceptable substitutes.
- **Search coverage**: date, languages, platforms, tools used, unavailable channels, and search-depth limits.
- **Candidates**: category, official identity, short fit explanation, adoption cost, maintenance evidence, license/price, and primary sources.
- **Key comparison**: only material capabilities, using the five support labels.
- **Reusable parts**: products, repositories, packages, models, templates, or design ideas that avoid rebuilding.
- **Unknowns**: facts that could materially change the result.

Return an evidence package only. Do not make or imply a final build, adoption, or stop recommendation; the calling assessment or comparison workflow owns that decision. Keep cells and explanations compact. Link to primary sources, never search-result pages.
