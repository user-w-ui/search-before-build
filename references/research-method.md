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

Inspect what the host can use: live Web search, interactive browser, CLI, installed Skills/plugins, MCP services, and local repository tools. Prefer specialized access when it provides deeper or more reliable evidence. Fall back to basic Web search. Record what was and was not available.

Do not claim to have searched a platform that was only reached through third-party mentions. Do not recommend installing or configuring a dependency unless it would materially improve the current search and the host permits asking the user.

For every GitHub-related search, read and follow [the GitHub retrieval rules](github-retrieval.md). A configured GitHub MCP or equivalent structured connector is optional enhancement, never a prerequisite.

## Adaptive search funnel

1. **Discover the category**: search the problem, workflow, category terms, and synonyms. For a Chinese or unknown market, query in Chinese and English.
2. **Build candidate pools**: ready-made product, adaptable project, reusable component, and no-build workaround. Keep weak candidates only long enough to explain exclusion.
3. **Narrow by functional fit**: prioritize the same user, situation, core task, operating mode, and must-have capability. Popularity is only a maturity signal and tie-breaker.
4. **Verify strong candidates**: open official pages, repositories, documentation, manifests/model cards, releases, pricing, licenses, and representative implementation where relevant.
5. **Stop when decision-ready**: stop expanding when each plausible decision has representative evidence and further candidates are near-duplicates. State coverage limits.

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

Compare actual behavior at the same layer. For every decision-changing capability use exactly one label:

- **原生支持**: directly supported in the normal product flow.
- **部分支持**: covers only part of the requirement or has a material limitation.
- **可通过扩展实现**: a documented extension path exists; name the required work.
- **不支持**: reliable evidence shows the capability is absent or incompatible.
- **尚未验证**: evidence is insufficient. Never silently convert this to “不支持”.

Also compare adoption effort, operating mode, maintenance, license/price, data or deployment constraints, and migration cost. Date time-sensitive facts. Separate verified facts from inference.

Reject surface matches: similar names, descriptions, tags, Stars, downloads, or shared technologies do not establish that two products solve the same problem.

## Evidence rules

Prefer primary sources. Cite the exact official page supporting each important claim. Search-result pages and generated summaries are discovery aids, not evidence. Use secondary sources only when primary evidence cannot answer a material question, and label the limitation.
