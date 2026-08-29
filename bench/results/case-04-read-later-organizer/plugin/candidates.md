# Candidates

Source: final conversation answer (2026-08-29) + decoded brief payload (`artifacts/brief.html.decoded.json`).

## Final recommendation: **Adapt** — don't build from scratch.

Most reusable option: **Raindrop.io** (backbone: AI-suggested tags/collections, reminders, native phone+laptop sync) + thin no-code scheduled digest for the daily "pick 3 to read" nudge.

## Candidate table (from final answer)

| App | Auto-categorize | Daily unread digest | Phone+laptop sync | Price |
|---|---|---|---|---|
| **Raindrop.io** | Partial (Pro AI suggestions, approve-first) | No (per-bookmark reminders only) | Native | Free; Pro ~$3.54/mo |
| **Readwise Reader** | No (manual tags) | No (resurfaces *highlights*, not unread) | Native | $9.99–12.99/mo |
| **Instapaper** | No (folders only) | No | Native | Free sync; $5.99/mo premium |
| **Omnivore** | No (manual labels) | No | Hosted service **shut down** Nov 2024 | Self-host only |
| **Pocket** | — | — | — | **Being phased out by Mozilla (2026)** |

## Kernel-output ranked candidates (artifacts/kernel-output.json)

1. getpocket.com (Pocket) — rank 1, kind discussion, matchedCapabilities [sync]
2. instapaper.com/premium — rank 2, kind web, matchedCapabilities [all 3 lexical]
3. medium.com "The Secret Power of Read It Later Apps" — rank 3, discussion
4. omnivore.app — rank 4, discussion
5. github:ncarlier/readflow — rank 5, repo

## Pocket / Omnivore defunct-status handling (observed, not disclosed to agent)

- **Pocket**: treated as dead — "shut down / phased out by Mozilla 2026; web/Android/iOS/macOS apps and extensions discontinued". Excluded from serious consideration; listed in unknowns as non-viable. Correct: Pocket defunct July 2025.
- **Omnivore**: treated as defunct-hosted — "hosted cloud service deprecated Nov 2024; self-host only now". Kept as adaptable open-source project (16k+ stars) but ruled not viable for a non-programmer. Correct: Omnivore hosted service ended Nov 2024 (acquired by ElevenLabs).
- Agent's own language: "Pocket shut down by Mozilla (2026)" / "cloud app deprecated Nov 2024, self-host only now" — accurate defunct handling on both.

## Others considered and excluded

- wallabag, readflow, Readeck, DoubleMemory, closetab.email — self-host oriented or niche; no daily digest; not viable for non-programmer convenience user.
- Known verified facts: Raindrop Pro ~$3.54/mo (Stella AI Pro-only, beta; interactive suggestions, not silent auto-tag); Readwise Reader daily review resurfaces highlights not unread; Instapaper folders only.