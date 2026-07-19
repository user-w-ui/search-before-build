# Research workflow and evidence contract

This is an internal workflow for `search-before-build-assess` and `search-before-build-compare`. The calling Skill owns clarification, the final recommendation, temporary presentation, and any explicitly requested report persistence.

## Boundaries

Normal research is read-only: do not create, edit, or delete files. The only exception is the GitHub MCP setup flow in `github-retrieval.md`, which may download the official binary and update the current Agent's MCP configuration only after explicit user approval.

Research must produce an evidence package before the caller makes a final recommendation. Do not put a Build, Adapt, Use existing, or Stop verdict in the evidence package. Do not save competitor reports or render the viewer; the calling Skill owns presentation and optional persistence.

## Functional fingerprint

Start from a fingerprint containing:

- intended user and concrete situation
- core task or job to complete
- inputs and expected outputs
- local, hosted, mobile, browser, CLI, API, plugin, or other operating mode
- single must-have capability
- acceptable substitutes and deal-breakers
- personal use or public product
- target market and language

Search for the problem, workflow, inputs/outputs, and technical category—not only the proposed product name. If the core task or must-have capability is still too unclear for accurate research, let the calling Skill resolve it under that Skill's existing question budget. Do not create another clarification loop here.

## Source coverage ledger

Before the first external call, build an internal source coverage ledger for the ready-to-use, adaptable, reusable, and no-build paths. For each path, record the evidence needed, the routes selected from `search-sources.md`, and any route deliberately skipped:

| Path | Evidence to seek | Typical routes |
| --- | --- | --- |
| Ready-to-use product | A product that solves the user's workflow directly | Web search, official product pages, app stores |
| Adaptable project | An implementation that can be modified instead of rebuilt | GitHub and its primary project documentation |
| Reusable component | A package, model, dataset, paper, server, or SDK that removes material implementation work | The matching language registry, Hugging Face, arXiv, or MCP Registry |
| No-build workaround | A simpler existing workflow or combination of tools | Web search and official documentation |

For every catalog route whose routing trigger matches the fingerprint, either query it or record a concrete fingerprint-based reason why its contents cannot affect the comparison. A bare `not necessary` or `irrelevant` is not a sufficient reason. GitHub does not substitute for package registries, model catalogs, paper indexes, app stores, or product Web research.

Treat these fingerprint signals as strong route triggers:

| Fingerprint signal | Route to query or specifically exclude |
| --- | --- |
| JavaScript, Node.js, npm package, CLI, or plugin | npm |
| JVM, Java, Kotlin, or Android | Maven Central |
| Rust implementation or dependency | crates.io |
| Agent tool, connector, or MCP server | Official MCP Registry |
| ML model, OCR, embeddings, training data, or local inference | Hugging Face Hub |
| algorithm, academic evidence, benchmark, or literature workflow | arXiv |
| cross-ecosystem identity, dependencies, adoption, or maintenance | Ecosyste.ms Packages |

When a ready-made SaaS, commercial tool, mobile or desktop app, app-store listing, or official service could satisfy the need, ordinary Web search is required unless unavailable. Use it alongside, not instead of, the matching specialized routes.

Keep the ledger internal during research, then copy the attempted, successful, unavailable, and materially skipped routes with their reasons into the evidence package's search coverage.

## Workflow

1. Read all of `search-sources.md`, then select only sources relevant to the fingerprint. Do not query every registry by default.
2. Inspect the external routes available in the current session: live Web search, interactive browser, tools exposed by Skills/plugins, MCP services, CLIs, public APIs, and registries. Prefer specialized access when it provides deeper or more reliable evidence. Generic Web search is not a prerequisite.
3. For every GitHub-related search, read and follow all of `github-retrieval.md` for capability checks, fallback order, optional setup, consent rules, and coverage wording. Do not install or change configuration without explicit user approval.
4. Discover the category by searching the problem, workflow, category terms, and synonyms. Search in Chinese and English when the target market is Chinese or unknown.
5. Build four pools: ready-to-use products, adaptable projects, reusable components, and the current no-build workaround. Keep weak candidates only long enough to explain exclusion.
6. Narrow by functional fit: prioritize the same user, situation, core task, operating mode, and must-have capability. Popularity is only a maturity signal and tie-breaker.
7. Deeply verify the strongest candidates using primary project pages and implementation evidence. Do not infer functionality from a name, snippet, topic tag, directory name, Stars, or download count.
8. Compare verified behavior at the same product or technical layer using the stable support enums below.
9. Stop expanding when the ready-made, adaptable, reusable, and no-build paths have representative evidence for the caller and further candidates are near-duplicates. Record coverage limits.

If generic Web search is unavailable but one or more specialized routes work, continue. In the search coverage, state that generic Web search was unavailable, name the specialized routes used, and explain the resulting coverage limits.

Stop only when every external route is unavailable, then say exactly:

```text
当前环境无法完成外部检索，因此不能确认是否已经存在类似方案。
```

Never claim that no similar project exists without external search evidence. Do not claim to have searched a platform that was reached only through third-party mentions. Do not recommend installing or configuring a dependency unless it would materially improve the current search and the host permits asking the user.

## Evidence package

Build this complete package before returning to the calling Skill:

- **Functional fingerprint**: user, situation, core task, input/output, operating mode, must-have capability, acceptable and unacceptable substitutes.
- **Search coverage**: date, languages, platforms, tools used, unavailable channels, and search-depth limits.
- **Candidates**: category, official identity, short fit explanation, adoption cost, maintenance evidence, license/price, and primary sources.
- **Key comparison**: only material capabilities, using the five stable support enums without translating them.
- **Reusable parts**: products, repositories, packages, models, templates, or design ideas that avoid rebuilding.
- **Unknowns**: facts that could materially change the caller's decision.

Keep cells and explanations compact. Link to primary sources, never search-result pages.

## Stable support enums

For every material capability use exactly one value:

- **`native`**: directly supported in the normal product flow.
- **`partial`**: covers only part of the requirement or has a material limitation.
- **`extensible`**: a documented extension path exists; name the required work.
- **`unsupported`**: reliable evidence shows the capability is absent or incompatible.
- **`unverified`**: evidence is insufficient. Never silently convert this to `unsupported`.

Use these exact lowercase values in the internal evidence package. Do not translate them there; `report-template.md` owns localized display labels.

Also compare adoption effort, operating mode, maintenance, license/price, data or deployment constraints, and migration cost. Date time-sensitive facts. Separate verified facts from inference.

## Evidence rules

Prefer primary sources. Cite the exact official page supporting each important claim. Search-result pages and generated summaries are discovery aids, not evidence. Use secondary sources only when primary evidence cannot answer a material question, and label the limitation.
