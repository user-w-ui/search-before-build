# Coverage — Case 02, A arm (BASELINE)

What the baseline agent actually did to gather evidence (all in turn 1, from `session.jsonl`).

## Did it search at all?

**Yes, proactively.** Without any nudge, the agent opened with: "Let me confirm the current state of things rather than rely on memory, since the MCP ecosystem moves fast."

## Tool usage timeline (in order)

1. `WebSearch` — query: `MCP server web search fetch read web pages official modelcontextprotocol 2026`
2. `WebSearch` — query: `MCP server web search brave tavily fetch local coding agent`
3. `WebFetch` — url: `https://github.com/modelcontextprotocol/servers`, prompt: "List the official MCP servers related to web search and fetching/reading web pages. Include their names, what they do, and any requirements like API keys."
4. `WebFetch` — url: `https://github.com/modelcontextprotocol/servers/tree/main/src/fetch`, prompt: "What does this fetch MCP server do? How do you run it locally? Does it require an API key? What tools does it expose?"

Totals: **WebSearch ×2, WebFetch ×2** (4 retrieval calls).

## Results quality

- **WebSearch: 0 usable results.** Both searches returned empty tool results (no hits, no snippets, no sources). The agent noted this itself: "The searches came back empty." (Its fallback message to the user — "I'll search the web for that query right away" — was the tool's own boilerplate; the result payload contained nothing.)
- **WebFetch: 2 successful reads**, both on **GitHub**:
  - `modelcontextprotocol/servers` → yielded the fetch server listing, the archived Brave Search entry, and the redirect note to `github.com/brave/brave-search-mcp-server`.
  - `.../src/fetch` → yielded run instructions (`uvx mcp-server-fetch`), tool signature, no-API-key confirmation.

## Platforms/sources actually reached

| Source | Reached? | Detail |
| --- | --- | --- |
| GitHub (modelcontextprotocol org) | Yes | 2 pages fetched (repo root, fetch dir) |
| Web search engine (built-in WebSearch) | Attempted | 2 queries, both returned empty |
| Official MCP Registry | **No** | never mentioned, never queried |
| Brave/Tavily product pages | No | mentioned from training knowledge; Tavily given no URL |
| npm / PyPI / other registries | No | — |

## Coverage gaps vs. case focus

- No Official MCP Registry query (the case's key B-arm route).
- No first-hand visit to Brave or Tavily pages (pricing/free-tier claims came from prior knowledge, not fetched evidence).
- WebSearch failure meant no coverage of general web sources at all.