# Research method

## Functional fingerprint

Describe the need before searching:

- intended user and concrete situation
- core task or job to complete
- inputs and expected outputs
- local, hosted, mobile, browser, CLI, API, plugin, or other operating mode
- single must-have capability
- acceptable substitutes and deal-breakers
- personal use or public product
- target market and language

Search for the problem, workflow, inputs/outputs, and technical category—not only the proposed product name.

## Capability detection

Inspect the external routes available in the current session: live Web search, interactive browser, tools exposed by Skills/plugins, MCP services, CLIs, public APIs, and registries. Use whichever relevant routes work, preferring specialized access when it provides deeper or more reliable evidence. Generic Web search is not a prerequisite.

If generic Web search is unavailable but one or more specialized routes work, continue the research. In the final search coverage, state that generic Web search was unavailable, name the specialized routes used, and explain the resulting coverage limits. Stop only when every external route is unavailable, then say exactly:

```text
当前环境无法完成外部检索，因此不能确认是否已经存在类似方案。
```

Record every route used, unavailable channels, and material depth limits. Never claim that no similar project exists without external search evidence.

Read [the maintained search source catalog](search-sources.md), then select only sources relevant to the functional fingerprint. Do not query every registry for every task. The user may request an additional source; add it to the catalog only after official-document review and live command verification.

Do not claim to have searched a platform that was only reached through third-party mentions. Do not recommend installing or configuring a dependency unless it would materially improve the current search and the host permits asking the user.

For every GitHub-related search, follow [the GitHub retrieval rules](github-retrieval.md) for capability checks, fallback order, optional setup, and coverage wording.

## Adaptive search funnel

1. **Discover the category**: search the problem, workflow, category terms, and synonyms. For a Chinese or unknown market, query in Chinese and English.
2. **Build candidate pools**: ready-made product, adaptable project, reusable component, and no-build workaround. Keep weak candidates only long enough to explain exclusion.
3. **Narrow by functional fit**: prioritize the same user, situation, core task, operating mode, and must-have capability. Popularity is only a maturity signal and tie-breaker.
4. **Verify strong candidates**: open official pages, repositories, documentation, manifests/model cards, releases, pricing, licenses, and representative implementation where relevant.
5. **Stop when caller-ready**: stop expanding when the ready-made, adaptable, reusable, and no-build paths have representative evidence for the calling workflow and further candidates are near-duplicates. State coverage limits.

## Platform routes

Choose only relevant routes:

- **GitHub**: repository identity, README/docs, manifests, releases, recent commits, issues, license, and representative source. Verify claimed behavior in code when it is central to the match.
- **Hugging Face**: Models, Datasets, and Spaces; inspect model/dataset cards, files, license, task, dependencies, demos, and update activity.
- **ModelScope**: models, datasets, Studios/创空间, documentation, license, usage examples, files, and update activity. Use Chinese query variants.
- **Package registries**: npm, PyPI, crates.io, Maven, NuGet, or the relevant ecosystem; inspect official package metadata, linked source, current version, dependencies, license, and update history.
- **Products and SaaS**: official features, pricing, documentation, integrations, deployment/data handling, and limits. Treat marketing claims as claims until docs or product evidence supports them.
- **App/plugin/template markets**: official listing, publisher identity, supported host, permissions, pricing, update date, reviews only as secondary evidence, and linked documentation.
- **Launch/discovery sites**: use Product Hunt and similar sites to discover names, then verify on primary sources.

## Deep matching

Compare actual behavior at the same layer. For every material capability use exactly one stable enum:

- **`native`**: directly supported in the normal product flow.
- **`partial`**: covers only part of the requirement or has a material limitation.
- **`extensible`**: a documented extension path exists; name the required work.
- **`unsupported`**: reliable evidence shows the capability is absent or incompatible.
- **`unverified`**: evidence is insufficient. Never silently convert this to `unsupported`.

Use these exact lowercase values in the internal research evidence package. Do not translate them there; the report template owns localized display labels.

Also compare adoption effort, operating mode, maintenance, license/price, data or deployment constraints, and migration cost. Date time-sensitive facts. Separate verified facts from inference.

Reject surface matches: similar names, descriptions, tags, Stars, downloads, or shared technologies do not establish that two products solve the same problem.

## Evidence rules

Prefer primary sources. Cite the exact official page supporting each important claim. Search-result pages and generated summaries are discovery aids, not evidence. Use secondary sources only when primary evidence cannot answer a material question, and label the limitation.
