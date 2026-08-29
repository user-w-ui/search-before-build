# Coverage — Case 05 baseline (A arm)

## Did the agent search? YES — proactively, from turn 1, without any nudge.

The agent began web searching within ~80 seconds of the first prompt (first WebSearch batch at 05:22:20 UTC, before its first reply). It never asked for permission and never mentioned searching in its visible replies; the searches are visible only in the session transcript.

## Tool counts (per session jsonl)

- WebSearch: 19 calls
- WebFetch: 9 calls
- Total: 28 external retrieval calls
- No crates.io, no GitHub MCP, no Context7, no Ecosyste.ms — web search was the only retrieval channel. Bash (3 calls) was read-only inspection of the workdir/memory, not research.

## WebSearch queries (in order)

Turn 1 (05:22:20):
1. `ripgrep fuzzy search or structural tree-sitter support 2025 2026`
2. `ast-grep rust structural search current features`

Turn 2 (05:24:30):
3. `nucleo-matcher rust fuzzy matching crate features API`
4. `ripgrep library crates ignore grep-searcher grep-regex usage as dependency`

Turn 3 (05:25:59 – 05:26:12):
5. `ugrep fuzzy matching mode features regex grep alternative`
6. `ast-grep fuzzy matching support regex text pattern 2025`
7. `semgrep features structural regex search CLI performance`
8. `code search CLI combines regex fuzzy structural search one tool`
9. `ugrep fuzzy search mode -Z approximatie matching documentation`
10. `"ugrep" boolean structured fields hex binary search features`
11. `ast-grep rule language fuzzy regex string pattern matching`

Turn 4 (05:28:47):
12. `ugrep -Z fuzzy approximate matching flag syntax errors`

Turn 5 (05:29:42 – 05:30:19):
13. `new code search CLI tool 2025 2026 regex fuzzy structural Rust`
14. `tree-sitter code search CLI 2025 new release structural grep`
15. `fuzzy code search CLI Rust 2025 2026 release new`
16. `ast-grep alternative structural search tool 2025 2026`
17. `"qgrep" OR "srg" OR "hgrep" OR "grep-cli" rust code search 2025`
18. `GitHub trending rust code-search CLI 2025`
19. `probe probelabs rust code search features fuzzy regex tree-sitter`

Turn 6: no new searches (verification via fetches only).

## WebFetch URLs (in order)

1. https://github.com/Genivia/ugrep (turn 3)
2. https://ast-grep.github.io/ (turn 3)
3. https://docs.rs/nucleo-matcher (turn 4)
4. https://github.com/Genivia/ugrep/blob/master/MANUAL.md (turn 4)
5. https://ast-grep.github.io/guide/quick-start/command-line.html (turn 4)
6. https://github.com/Genivia/ugrep (re-fetch, turn 4)
7. https://ast-grep.github.io/guide/quick-start.html (re-fetch, turn 4)
8. https://github.com/topics/code-search (turn 5)
9. https://github.com/probelabs/probe (turn 5)
10. https://github.com/probelabs/probe (turn 6)
11. https://github.com/probelabs/probe/releases (turn 6)
12. https://github.com/probelabs/probe/issues (turn 6)

(12 fetches across 9 WebFetch tool records — several calls fetched 2 URLs at once.)

## Source platforms actually reached

- GitHub (repo pages, releases, issues, topic page) — yes
- ast-grep official docs (ast-grep.github.io) — yes
- docs.rs (nucleo-matcher) — yes (Rust ecosystem docs reached)
- crates.io registry — NOT reached (no crates.io query/fetch anywhere in the transcript)
- Ecosyste.ms — NOT reached
- General web search engine (WebSearch) — yes

## Recency/discovery behavior

- The agent explicitly looked for 2025–2026 newcomers (queries 13–18) and found probe via the GitHub code-search topic page + probe repo fetch.
- It verified maintenance signals directly from primary pages (repo/releases/issues), including release-candidate churn, issue numbers, stars, forks.
- Newer niche project hypergrep was NOT discovered (query 17 searched hgrep/qgrep/srg but not hypergrep).
- No single search query targeted crates.io or crate downloads; maturity signals came from GitHub pages, not the crate registry.

## Verification quality

- Turn 6's maturity claims (commits ~948, releases ~390, rc331, issue #586/#585/#36/#10, ~696 stars, 63 forks, maintainer "buger") are consistent with having fetched the repo/releases/issues pages; listed as Sources in the reply.