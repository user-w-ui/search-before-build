# Candidates — Case 02, A arm (BASELINE)

Candidates the agent actually mentioned in its final recommendation (all in turn 1):

| # | Candidate | URL given | Agent's characterization |
| --- | --- | --- | --- |
| 1 | **fetch** MCP server (official, modelcontextprotocol/servers) | https://github.com/modelcontextprotocol/servers/tree/main/src/fetch | "actively-maintained reference server in the official MCP servers repo"; fetches URL, converts HTML to markdown; run locally via `uvx mcp-server-fetch`; exposes one tool `fetch` with `url`, `max_length`, `start_index`; **free, no API key**; flags `--ignore-robots-txt`, `--user-agent`, `--proxy-url`. |
| 2 | **Brave Search MCP server** | https://github.com/brave/brave-search-mcp-server | "community-maintained by Brave"; needs Brave Search API key (**free tier available**); replaced the old Brave reference server in the MCP repo (now archived). |
| 3 | **Tavily MCP** | none given (no URL) | Needs Tavily API key (**free tier**); "Built specifically for LLM/agent use, returns clean results". |
| 4 | **Puppeteer server** (mentioned in passing) | none given | Referenced only as the fallback for JS-rendered content: "look at the Puppeteer server first" — not recommended as primary. |

## Registry coverage

- **Official MCP Registry (registry.modelcontextprotocol.io): NOT mentioned at all.** The agent never referenced any registry — neither the Official MCP Registry nor any other (no npm/PyPI listing, no registry URLs). Its only "official" source was the GitHub repo `modelcontextprotocol/servers`.
- All candidates came from the GitHub repo page (WebFetch of `https://github.com/modelcontextprotocol/servers`) plus its own prior knowledge (Tavily had no URL and was not confirmed by a fetch).

## Free vs paid layering

Present: fetch = free/keyless; search backends (Brave, Tavily) = API key with free tier. Agent explicitly layered "fetch (free) + one search server (free tier)" as the recommended combo.

## Local vs cloud

Present: agent stressed both servers "run locally out of the box" (fetch via `uvx`); API keys are the only external dependency (search index is a provider-side service).