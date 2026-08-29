# Turn Log — Case 02, A arm (BASELINE, no plugin)

Arm: baseline (bare Claude Code, no `--plugin-dir`, no slash commands)
Workdir: `C:\Users\QC\AppData\Local\Temp\opencode\sbb-real\case-02-mcp-web-access\baseline`
Session: `6af9df1e-2e98-42c5-8a31-6c25e3291ba4`

## Turn 1 — initial prompt

Timestamp: 2026-08-29 13:20 (start); 2026-08-29 13:21:32 (last session write)
Sent: raw case prompt, verbatim:
> I want to build an MCP server that gives my coding agent the ability to search the web and read web pages, so it can look things up while helping me code. Something I can run locally. Is this worth building, or does it already exist?

Command: `claude --permission-mode auto -p "<prompt>"` (no plugin dir)
Elapsed: ~1.0 min. No clarifying questions were asked. Agent researched on its own (2 WebSearch, 2 WebFetch) and gave a final recommendation in the same turn. No monitoring notes needed (single call well under the 3-min check interval; no timeout).

### Full stdout (verbatim)

```
It already exists �?don't build this. There are well-maintained, official MCP servers covering exactly the two capabilities you want, and they run locally out of the box.

## The two pieces, separately

Your request is really two distinct tools, and they have different answers:

**1. Reading web pages �?use the official `fetch` server (free, no API key)**

This is the actively-maintained reference server in the official MCP servers repo. It fetches a URL and converts HTML to markdown for the agent. Run it locally with:

```
uvx mcp-server-fetch
```

It exposes one tool, `fetch`, with `url`, `max_length`, and `start_index` (for chunked reading of long pages). No API key, no credentials �?it hits public URLs directly. Flags like `--ignore-robots-txt`, `--user-agent`, and `--proxy-url` are available if you need them.

**2. Searching the web �?you need a search backend (API key required)**

This is the one part that isn't free-and-keyless, and that's the real reason *not* to hand-roll it: "search the web" requires a search index, which means a provider. The common MCP options:

- **Brave Search MCP** (`github.com/brave/brave-search-mcp-server`, community-maintained by Brave) �?needs a Brave Search API key (free tier available).
- **Tavily MCP** �?needs a Tavily API key (free tier). Built specifically for LLM/agent use, returns clean results.
- The old Brave reference server in the MCP repo is archived in favor of the Brave-maintained one above.

## My recommendation

Add **`fetch`** (official, free) plus **one search server** (Tavily if you want agent-optimized results, Brave if you want a generous free tier). That gives your agent: *search to find URLs �?fetch to read them* �?which is the exact loop you described.

Wiring it into Claude Code is a one-liner per server via `claude mcp add`, or an entry in your MCP config �?no custom code needed.

## When it *would* be worth building

Only if you hit a specific gap the existing servers don't cover, e.g.:
- You need authenticated fetch (reading pages behind a login you control).
- You want to read from a private/internal knowledge base that isn't on the public web.
- You need specialized parsing (a specific site's structure, PDF extraction, JS-rendered content that `fetch`'s static grab misses �?in which case look at the Puppeteer server first).

For plain "search the web + read pages while coding," the existing servers cover it well. Want me to show you the exact config to drop into Claude Code?

**Sources:**
- [Official MCP servers repo](https://github.com/modelcontextprotocol/servers)
- [Fetch server](https://github.com/modelcontextprotocol/servers/tree/main/src/fetch)
- [Brave Search MCP server](https://github.com/brave/brave-search-mcp-server)
```

Note: the `�?` characters are a console encoding artifact of the harness capture (em-dash in the original). Verbatim assistant text extracted from `session.jsonl` is clean (see below).

### Verbatim assistant texts from session.jsonl (UTF-8 clean)

1. "Good question and the short answer is: **it already exists, multiple times over, and is well-maintained.** You almost certainly don't need to build this from scratch. But let me confirm the current state of things rather than rely on memory, since the MCP ecosystem moves fast."
2. "The searches came back empty. Let me fetch the official MCP servers list directly."  ← agent's own note that WebSearch returned no usable results
3. Final recommendation text as above (verbatim from transcript).

### Q&A record

- Questions asked by agent: **none.** No clarifying questions; the case was answered in a single turn. Final line "Want me to show you the exact config to drop into Claude Code?" is a closing offer, not a clarification; per protocol no scripted answer applies and no follow-up was sent.

### Anomalies

- Both built-in WebSearch calls returned **empty** results ("The searches came back empty"), so the agent pivoted to WebFetch on GitHub. WebSearch tool results contained no search hits/sources at all.
- Agent did not know about / did not query the Official MCP Registry (registry.modelcontextprotocol.io); it used only the GitHub `modelcontextprotocol/servers` repo.
- Run completed in 1 turn, ~1 minute. No timeouts, no script deviations, no extra turns.