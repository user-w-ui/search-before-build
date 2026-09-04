# Case 08 · 家庭日程与任务的 AI 摘要助手（assess，隐私敏感）

| 项 | 值 |
| --- | --- |
| 技能（B 臂） | `search-before-build-assess` |
| 模拟用户语言 | English |
| 补充材料 | 无 |
| 真实需求来源 | [HouseholdTracker issue #15：AI-native features](https://github.com/jceddy/HouseholdTracker/issues/15)（公开 research/scoping issue） |
| 对比焦点 | Agent 需求是否真实、定时任务与工具调用、家庭数据隐私、现有日历/任务产品的边界 |

## Source and assessment focus

The source issue asks what an LLM layer should do beyond a generic chat box: a daily briefing from calendar events and chores, a weekly household report combining tasks, budget, maintenance, and meeting notes, natural-language task entry, meeting-notes-to-tasks extraction, and proactive nudges. It explicitly calls out missing scheduled jobs, missing data tools, notification delivery, per-user visibility rules, and the risk of sending private household data to a third-party model.

The case keeps the request concrete enough to compare against existing products and open-source agents. It tests whether the agent treats scheduling, read/write permissions, opt-in disclosure, and failure handling as first-class requirements instead of assuming that adding an LLM chat box creates value.

## User prompt (use verbatim for both arms)

```text
I want a small assistant for my household of four. Every morning it should read today's shared calendar events and chores, then send a short briefing with what needs attention. Once a week it should summarize overdue tasks, household budget status, maintenance items, and action points from our meeting notes. We should also be able to type “remind me to book the dentist next Thursday” and get a real task or calendar event. Some notes and calendar details are private, so the assistant must respect per-person visibility and ask before sending anything outside the household. Is this worth building on top of our existing calendar and task tools?
```

## Clarification script (answer only if asked)

1. Current tools → `We use Google Calendar plus a shared task list and a private notes area. There is no reliable morning digest today; people check several places manually.`
2. Delivery and scheduling → `A digest at 7:30 on weekdays and a Sunday evening weekly report are enough. Email or a private Discord channel is acceptable, but a dashboard-only result is also fine for a first version.`
3. Privacy and model hosting → `Private notes must never be included in a household-wide report. We can use a hosted model only if each run shows what data leaves the home and everyone opts in; a self-hosted model is preferred if quality is usable.`
4. Write actions and failure handling → `Natural-language input may create a draft task or event, but it must show the parsed date, owner, and visibility before saving. Never silently change or send calendar data.`
5. Pre-research confirmation (B arm) → `Confirmed.`

## B-arm routing observation table

| Source | Strength | Trigger |
| --- | --- | --- |
| GitHub | must | Open-source household assistants, agent schedulers, calendar/task integrations |
| web (host/DDG fallback) | must | Existing family organizer products and official privacy/automation documentation |
| Hacker News / community discussions | should | Evidence that the digest and natural-language-entry pain is recurring rather than hypothetical |
| Official API docs | must | Google Calendar/task/Discord permission and webhook behavior |
| arXiv / papers | optional | Scheduling, summarization, and privacy-preserving agent techniques when directly relevant |

## Evidence to record

- [ ] Candidate list: family organizers, calendar/task automation tools, open-source agent frameworks, and reusable scheduling components.
- [ ] Whether each candidate supports scheduled jobs, natural-language parsing, read/write tools, per-user visibility, and approval before writes.
- [ ] Evidence for actual user need: issue/discussion signals versus a product's marketing claims.
- [ ] Whether “weekly household report” is a distinct unmet need or a thin summary layer already covered by existing dashboards.
- [ ] Source coverage and query terms in both arms; note whether A arm checks official API and privacy documentation.
- [ ] B-arm kernel: identity deduplication for the same calendar/task product across GitHub and web, plus warnings for candidates that only provide chat without scheduling.
- [ ] Final recommendation and exact supporting excerpts.

## Comparison focus

1. Which arm tests necessity with real demand signals instead of assuming that an LLM feature is valuable?
2. Do the recommendations account for scheduled execution, data permissions, opt-in disclosure, and draft-before-write behavior?
3. Which existing products or components can be adopted, and what remains genuinely custom for this household?
4. Does either arm propose sending private data to a hosted model without a concrete consent and visibility design?

