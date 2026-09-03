# Case 11 · 深度研究 Agent 仓库对比（compare，已有仓库）

| 项 | 值 |
| --- | --- |
| 技能（B 臂） | `search-before-build-compare` |
| 模拟用户语言 | English |
| 补充材料 | `D:\Learning\Agent\Auto\_ML\_Agent\build-with-ag2\deep-research-agent`（直接把该路径交给 agent；不要预先复制或改写仓库） |
| 对比焦点 | 研究工作流基线、引用与事实核验、开源/商业 research agent 竞品、可复用检索组件 |

## Background and assessment focus

This case supplies a working deep-research-agent repository without declaring what it actually implements. The agent must inspect the code and distinguish browsing, source selection, note taking, citation, synthesis, and orchestration that are present from items that are only aspirational. It then compares at the same product layer with open-source research agents and hosted research products.

The test is especially useful for citation quality: a candidate that can generate prose is not automatically a research alternative. The comparison should check source traceability, handling of conflicting evidence, recency, paywalls/authenticated sources, and whether the project can run with the user's privacy and cost constraints.

## User prompt (use verbatim for both arms)

```text
Please inspect this existing repository before advising me:
D:\Learning\Agent\Auto\_ML\_Agent\build-with-ag2\deep-research-agent

I want to know whether it is worth continuing development or whether I should adapt an existing research-agent project. Compare the implemented workflow with current open-source and hosted alternatives, especially around web search, source reading, citations, fact checking, and long-running multi-step research. Identify concrete improvements and reusable components.
```

(B-arm invocation: `/search-before-build:search-before-build-compare D:\Learning\Agent\Auto\_ML\_Agent\build-with-ag2\deep-research-agent`; A arm pastes the prompt directly.)

## Clarification script (answer only if asked)

1. Alignment choice (compare must ask once) → **“Align the real need first.”**
2. Research task → `I use it for technical landscape reviews and investment memos. Each claim should link to the original page or paper, include the publication date, and show disagreement when sources conflict.`
3. Environment and data boundary → `It can use public web sources and public APIs. Private company documents may be added later, but they must stay on our network. We care more about traceable evidence than a polished chat UI.`
4. Operational constraints → `A single research run may take 10–30 minutes. I want resumability, a bounded budget, and a Markdown/HTML report that a human can review before sharing.`
5. Pre-research confirmation (B arm) → `Confirmed.`

## B-arm routing observation table

| Source | Strength | Trigger |
| --- | --- | --- |
| GitHub | must | Baseline repository and open-source research-agent implementations |
| web (host/DDG fallback) | must | Hosted research products and official capability/pricing/privacy pages |
| arXiv / Papers with Code | should | Research on retrieval, citation attribution, and agent planning |
| npm / PyPI | should | Search, crawling, extraction, and report-generation components actually used by candidates |
| Official API documentation | must | Verify tool limits, source access, citations, and resumability claims |

## Evidence to record

- [ ] Baseline matrix: implemented, planned, and unknown behavior for search, browser/fetch, extraction, citation storage, synthesis, retries, persistence, and export.
- [ ] Candidate list at the same layer; do not compare a generic chat model or a search API alone with a full research workflow.
- [ ] Evidence for citations and fact checking from original docs or code, including how conflicts and stale pages are handled.
- [ ] Privacy, cost, rate limits, authenticated/private sources, and run duration in the recommendation.
- [ ] B-arm coverage ledger: GitHub, web, papers and package registries actually queried; A-arm behavior recorded without assumptions.
- [ ] B-arm kernel: merge aliases for the same project across GitHub and product pages, and preserve warnings when a candidate only claims “deep research” in marketing copy.
- [ ] Final recommendation and exact excerpts from both arms.

## Comparison focus

1. Which arm establishes a code-backed baseline before discussing competitors?
2. Which arm verifies citation/fact-checking behavior rather than treating generated prose as research quality?
3. Does the recommendation identify a thin, reusable seam—retrieval, browser extraction, evidence store, planner, or renderer—where Adapt is practical?
4. Are hosted alternatives correctly separated from the private-document and bounded-budget requirements?

