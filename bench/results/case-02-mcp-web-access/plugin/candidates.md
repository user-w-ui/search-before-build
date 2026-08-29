# Case 02 · B 臂（plugin）候选清单

全部经一手来源核验（2026-08-29：registry 元数据 + GitHub README + 官方定价页）。

| 候选 | 定性 | 一手来源 |
| --- | --- | --- |
| Tavily MCP | 官方 MCP server（search/extract/map/crawl），免费 1000 credits/月 | github.com/tavily-ai/tavily-mcp |
| Brave Search MCP | 官方（search only，读页需配 Fetch） | github.com/brave/brave-search-mcp-server |
| @zhafron/mcp-web-search | 社区，无 key，DuckDuckGo/Bing/SearXNG 兜底 + SSRF 防护 | github.com/tickernelz/mcp-web-search |
| duckduckgo-mcp-server | 社区，无 key | github.com/nickclyde/duckduckgo-mcp-server |
| Fetch（reference MCP server） | 官方参考 server，仅抓页 | github.com/modelcontextprotocol/servers/tree/main/src/fetch |

另：Claude Code 内置 WebSearch/WebFetch 作为"已拥有"选项单独列出（B 臂独有洞察）。
