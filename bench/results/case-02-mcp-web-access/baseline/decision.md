# Decision — Case 02, A arm (BASELINE)

## Final recommendation (verbatim from transcript)

> "It already exists — don't build this. There are well-maintained, official MCP servers covering exactly the two capabilities you want, and they run locally out of the box."

> "Add **`fetch`** (official, free) plus **one search server** (Tavily if you want agent-optimized results, Brave if you want a generous free tier). That gives your agent: *search to find URLs — fetch to read them* — which is the exact loop you described."

> "Wiring it into Claude Code is a one-liner per server via `claude mcp add`, or an entry in your MCP config — no custom code needed."

## Reasoning chain (as given by the agent)

1. The request decomposes into two capabilities with different answers: page reading (fetch) and web search (search backend).
2. Reading = official `fetch` server: "actively-maintained reference server in the official MCP servers repo", free, no API key, runs locally via `uvx mcp-server-fetch`.
3. Search = "the one part that isn't free-and-keyless": a search index requires a provider → Brave Search MCP (API key, free tier) or Tavily MCP (API key, free tier). This is "the real reason *not* to hand-roll it".
4. Therefore building your own adds nothing over assembling existing servers; wiring is trivial (`claude mcp add` / MCP config).

## Conditions under which building would be worth it (agent's own caveats)

> "Only if you hit a specific gap the existing servers don't cover, e.g.: authenticated fetch (pages behind a login you control); a private/internal knowledge base not on the public web; specialized parsing (specific site structure, PDF extraction, JS-rendered content — in which case look at the Puppeteer server first)."

## Verdict

- **Build? No.** Reuse `mcp-server-fetch` (official) + one of Brave/Tavily search MCP.
- **Actionable?** Yes — concrete installable server names and run commands (`uvx mcp-server-fetch`, `claude mcp add`), free vs paid layering explicit, local-run constraint respected.
- **Notable caveat:** the "official" characterization rests on the GitHub repo; the agent never consulted the Official MCP Registry, so "official" here means "in the modelcontextprotocol GitHub org", not "listed in the registry". Tavily's claim ("clean results, free tier") was asserted from prior knowledge with no source; no URL was given for it.