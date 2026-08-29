# Coverage

Date: 2026-08-29. Target market/language: UNKNOWN (user: "Not sure, just for me for now") — bilingual rule should have applied.

## Routes used (from session jsonl tool audit)

| Route | Queried | Evidence |
|---|---|---|
| Host WebSearch | YES x4, ALL EMPTY (query echo + reminder only, no results) | best read it later app...; daily digest resurface...; Omnivore acquired shutdown...; Raindrop.io Stella price... |
| Anonymous Web fallback (html.duckduckgo.com) | YES x5 | read later auto tagging; daily digest resurface; Omnivore status; Raindrop Stella price; "read it later" daily digest |
| Anonymous Web fallback (lite.duckduckgo.com) | YES x3 | Readwise Reader auto tagging; Raindrop auto tagging AI; Raindrop Pro price |
| GitHub public REST API | YES x2 | repos q=read it later (per_page 15); omnivore-app/omnivore repo meta |
| Hacker News Algolia | YES x2, both with hits | q="read later never read" (hitsPerPage=10); q="read later" (hitsPerPage=8) |
| WebFetch primary pages | YES x27 | raindrop.io, readwise.io/read, getpocket.com, omnivore.app + README, instapaper premium, readeck, help.raindrop.io (stella/premium-features), wallabag README, readflow README, etc. |

## Hacker News demand evidence (fix-verification #1)

- Q "read later never read": returned hits (title/points list).
- Q "read later": 309pts Omnivore; 204pts Show HN "read later folder into physical book"; 162pts Show HN DoubleMemory; 153pts "The Secret Power of Read It Later Apps"; 142pts "Pocket Released (Formerly Read It Later)". Demand/pain-point evidence captured in kernel-input retrievals (hn-1).

## Bilingual rule (fix-verification #2) — FAILED

- Market/language left unknown by user. research-method.md rule 4 + rule 10 require Chinese + English queries when market is unknown.
- **NO Chinese queries attempted.** All 4 WebSearch, 8 DDG, 2 GitHub, 2 HN queries are English. No zh terms at all (checked for CJK in all tool inputs — only reference-file content and agent thinking used Chinese kernel labels 事实/推断/未知, no search query did).
- kernel-input.json capabilityAliases are English-only (decision-kernel.md explicitly says "Include Chinese and English forms when the search is bilingual").
- report-input.json language = "en" (agent inferred English from user's English conversation; no language question was asked).
- No closing route-and-language audit step was visible before stopping.

## DDG fallback (fix-verification #3) — PASSED

Host WebSearch returned empty payloads (LEN 216–321, just the echo + REMINDER). Agent explicitly noted "The host web search returned empty" and invoked the Anonymous Web fallback (html.duckduckgo.com then lite.duckduckgo.com) per research-method rule 10 / search-sources.md. DDG HTML results were partially junk (link extraction poor on first attempts) but lite.duckduckgo.com worked; product pages verified via WebFetch.

## GitHub

Public REST API used anonymously (gh CLI not authenticated; no MCP offer made — constraint 4 moot). Repos: omnivore-app/omnivore (16k stars), ncarlier/readflow, wallabag/wallabag, DominikPieper/obsidian-ReadItLater.

## Closing route-and-language audit (fix-verification #5) — NOT VISIBLE

No explicit audit step found in assistant thinking/text before the final answer (3 "audit" mentions in session are: research-method rule text, and Instapaper coverageNote "not an exhaustive feature audit" x2). Coverage section of report-input.json does list routes (Web limited/DDG, GitHub used, HN used) but no language audit.

## Coverage limits stated by agent

- Host Web search empty → DDG fallback; exact Raindrop Pro buy-page dollar figure is an image, not text (~$3.54/mo via trackers); Readwise Daily Review unread-vs-highlight is inferred from docs, not verbatim; user has never tried existing apps (unverified gap).