# Coverage — Case 04 baseline arm

## Did the agent search at all?

**No.** The baseline agent performed zero retrieval of any kind during the
entire session.

## Evidence from the transcript (session.jsonl)

- Client-side `tool_use` blocks: **0** (no WebSearch, no WebFetch, no other
  tools in any assistant message)
- Server-side tool usage (`usage.server_tool_use` on every assistant message):
  - `web_search_requests: 0`
  - `web_fetch_requests: 0`
  - All four assistant turns report this same zero pair.
- Queries run: none
- Sources/pages opened: none
- HN Algolia, GitHub, product homepages, Wikipedia: none touched

## What the agent did instead

Answered entirely from parametric/memory knowledge:

- Turn 1: split the idea into organization vs. habit; named Readwise Reader,
  Raindrop.io, Instapaper from memory.
- Turn 2: detailed Readwise Reader feature claims (AI tagging, daily review
  email behavior) from memory.
- Turn 3: step-by-step setup guide (tags, Smart Folders, HTML bookmark import,
  Ghostreader) from memory.
- Turn 4: recap and close.

## Demand-side signal

- No demand signal of any kind: no HN Algolia query, no "has anyone built
  this" check, no market-size argument. The agent's "is it worth building"
  reasoning was purely first-principles (habit vs. software problem), not
  evidence-based.

## Source coverage matrix (vs. case's expected sources)

| Source | Expected (case 04) | Baseline arm |
| --- | --- | --- |
| Web search | must | 0 requests |
| Hacker News Algolia (necessity check) | must | not touched |
| Product homepage verification | must | not touched |
| Wikipedia (optional) | optional | not touched |
| Bilingual search (market unknown) | must | not applicable (no search at all) |