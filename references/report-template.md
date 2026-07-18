# Competitor report contract

Use this semantic contract for each competitor card in the temporary viewer and for every Markdown report the user explicitly chooses to export or persist. Keep the competitor content strictly about the competitor and its comparison with the current project. Do not include need clarification, necessity gates, Build/Stop decisions, MVP advice, or the earlier conversation.

## Persistence boundary

Do not write competitor reports into the current project by default. After the user has seen the result, persist only the competitors they explicitly request to `docs/search-before-build/<topic-slug>/<competitor-slug>.md`. Update the canonical file when it already exists; do not create timestamped variants or a combined multi-competitor report.

The temporary viewer may offer a user-initiated download or copy action for each competitor. Those actions are optional exports, not project writes, and must produce this same Markdown structure.

## Output language

Choose one target language for the entire report:

1. Use the language explicitly requested by the user.
2. Otherwise use the language of the user's current request.
3. Never switch because a source, competitor, repository, or existing project uses another language.

Write headings, table dimensions, explanations, coverage notes, and summaries in the target language. Preserve proper names, code, identifiers, direct quotations, and URLs as needed.

For Chinese reports, render support enums with the Chinese labels below. For English reports, use the English labels. For every other target language, write the report in that language but fall back to the English support labels; do not invent another translation of the enums.

## Support-label localization

Research evidence uses stable enums. Never expose a raw enum in the report when a display label is available.

| Stable enum | 中文 | English |
| --- | --- | --- |
| `native` | 原生支持 | Native |
| `partial` | 部分支持 | Partial |
| `extensible` | 可通过扩展实现 | Extensible |
| `unsupported` | 不支持 | Unsupported |
| `unverified` | 尚未验证 | Unverified |

## Semantic report structure

Render these semantic sections in this exact order, translating their headings into the target language. Do not print the semantic identifiers themselves:

1. `overview`
2. `comparison`
3. `notable_designs`
4. `reusable_lessons`
5. `summary`
6. `sources`

Use this structure:

```markdown
# <competitor name>

<localized official-address label>: [<project or product name>](<primary URL>)

## <localized overview heading>

<one short paragraph describing positioning, primary users, and operating model>

## <localized comparison-with-current-project heading>

| <localized dimension label> | <competitor name> | <current project name> |
| --- | --- | --- |
| <localized material dimension> | ... | ... |

## <localized notable-designs heading>

1. **<design or mechanism>**: <verified behavior and why it matters>

## <localized reusable-lessons heading>

- <specific behavior that can be adopted, tested, or learned from>
- <what requires adaptation or should not be copied>

## <localized summary heading>

> <the most important difference between the competitor and current project>

## <localized sources heading>

<localized search-coverage label>: <GitHub route used and unavailable or degraded channels>

- [<primary source>](<URL>)
```

Choose only material comparison dimensions. Common semantic dimensions include `positioning`, `primary_users`, `core_workflow`, `operating_mode`, `must_have_capability`, `extension_and_integration`, `data_and_deployment_constraints`, `maintenance_and_maturity`, `license_or_price`, `main_strengths`, and `main_limits`. Translate dimension labels into the target language; do not print these identifiers.

## Format rules

- Preserve the semantic section order. Do not add a need-clarification section, necessity-gate section, verdict section, or MVP section.
- Add or remove comparison rows only when a row materially affects the comparison. Keep the three columns and compact cells.
- Convert every support enum through the localization table. Do not translate enum meanings ad hoc.
- Describe verified current behavior. Distinguish released, planned, inferred, and unverified capabilities.
- Use primary sources and date time-sensitive facts in the relevant cell or source note. Never cite a search-result page.
- When neither a structured GitHub tool nor an authenticated `gh` CLI was used, include the exact anonymous-search limitation statement from `github-retrieval.md` under the localized `sources` heading. When generic Web search was unavailable but specialized routes worked, include the three coverage items required by `research-method.md`.
- Explain unavoidable technical terms briefly. Do not use product-management jargon.
- When the user exports or persists several competitors, keep a separate report for each competitor. Do not combine competitors into extra table columns.
