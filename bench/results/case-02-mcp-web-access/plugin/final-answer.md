Rendered. Here's the assessment.

## Recommendation: **Use existing** — don't build it.

### Main reason
Several **official, mature, locally-runnable stdio MCP servers** already expose exactly your two must-have capabilities (web search + web page fetch) to Claude Code, with your own or a free-tier API key. Your real driver — *control, your own key, predictable behavior* — is fully satisfied by these without writing any server code. And Claude Code itself ships built-in web search and web-fetch tools, so there's no capability gap that building from scratch would close. Building would duplicate work that's already shipped and maintained by official teams.

### The strongest options (verified from primary sources, 2026-08-29)

| Server | Search | Page fetch | Key / cost | Notes |
|---|---|---|---|---|
| **Tavily MCP** (`tavily-ai/tavily-mcp`) | ✅ native | ✅ extract | Own key; **free 1000 credits/mo**, no card | Official; explicit `claude mcp add`; also map + crawl |
| **Brave Search MCP** (`brave/brave-search-mcp-server`) | ✅ native | ❌ none | Own key; ~1000 free searches/mo via $5 credit | Official; pair with Fetch server for reading |
| **@zhafron/mcp-web-search** (`tickernelz/mcp-web-search`) | ✅ native | ✅ fetch_url | **No key at all** | DuckDuckGo/Bing/SearXNG fallback + SSRF protection |
| **duckduckgo-mcp-server** (`nickclyde/duckduckgo-mcp-server`) | ✅ native | ✅ fetch | **No key** | Python via uvx; built-in rate limiting |
| **Fetch** (official reference) (`modelcontextprotocol/servers`) | ❌ none | ✅ native | No key | Official baseline for page reading only |

### Most reusable option
**Tavily MCP** — official, Claude Code-native (one `claude mcp add` command), free tier with your own key, and the broadest toolset (search/extract/map/crawl) so it covers both capabilities in a single server.

If you'd rather have **zero cost and no API key at all**, use **@zhafron/mcp-web-search** instead — both capabilities, no registration, at the cost of scraping-based reliability.

### Biggest remaining unknown
**Zero-cost/no-key vs. higher-quality API-backed search.** You explicitly left this open ("I don't really know what's out there"). The choice is now:
- **No key / free** → `@zhafron/mcp-web-search` or `duckduckgo-mcp-server` (scraping DuckDuckGo/Bing; variable quality and rate limits).
- **Free-tier API key** → Tavily or Brave (higher-quality results; requires registering a key).

A secondary unknown: whether Claude Code's **built-in** web tools already cover your day-to-day needs well enough that even an MCP server is optional.

### Temporary viewer
`C:\Users\QC\AppData\Local\Temp\search-before-build\runs\20260829T153034-46fe\brief.html`

Open it for the full capability matrix and per-server cards (each has Save/Copy Markdown; the toolbar has Export PDF).

### Coverage caveats (so you can trust the call)
- **Host web search was unavailable** (returned empty for material queries), so discovery came from the **Anonymous DuckDuckGo fallback + specialized catalog routes** (Official MCP Registry, npm, GitHub REST) and primary-source pricing/README pages — not general web search.
- **GitHub was anonymous REST only** — no dedicated deep-retrieval tool and no authenticated `gh` CLI. This may miss newer, low-visibility, or code-internal-only projects.

I've stopped here as the workflow requires — no implementation started. If you'd like, I can help you pick between the no-key and API-key options, or walk through the one-command setup for whichever you choose.
