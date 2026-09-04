# Search coverage

Research date: 2026-09-04 UTC. Discovery used English and Chinese queries.

| Route | Status | Evidence and limit |
| --- | --- | --- |
| Host Web | used | Product discovery and official pages for Fami, Plamily, Cozi, Nestify, Yuvora, Google Calendar, Gmail, and Apps Script. |
| GitHub structured connector | used | Repository search, metadata, and README reads for paperr and Family Organizer. Code search returned no indexed matches for paperr feature terms. |
| Official MCP Registry | used | Calendar, Google Tasks, and local notes searches succeeded; results included Google Calendar and Google Tasks servers plus a local notes server. |
| Hugging Face Hub | used | Official REST search found Microsoft Phi-3 mini instruct options as a local-model component. |
| Hacker News Algolia | used | One relevant Ask HN discussion supplied public demand evidence about high-friction family calendar and chore workflows. |
| Google Tasks direct discovery | limited | curl failed before HTTP response with Schannel SEC_E_NO_CREDENTIALS; this was not interpreted as feature absence. |
| Anonymous Web fallback | skipped | Host Web returned usable discovery results, so the catalog rule did not require DuckDuckGo fallback. |
| npm, Maven, crates.io, arXiv | skipped with reason | No implementation language/package, JVM/Rust dependency, or algorithm/literature requirement was established; their catalogs would not materially change this product comparison. |

Representative evidence covers ready-to-use products, adaptable repositories, reusable APIs/MCP/model components, and a no-build Apps Script/API route. Further candidates were near-duplicates or lacked primary evidence.

The required anonymous GitHub limitation does not apply because this run used the exposed structured GitHub connector.
