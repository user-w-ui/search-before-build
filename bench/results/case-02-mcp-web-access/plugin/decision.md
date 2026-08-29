# Case 02 · B 臂（plugin）最终建议

## Recommendation: **Use existing** — don't build it.

**Main reason**：官方、成熟、本地可跑的 stdio MCP server 已完整覆盖"网页搜索 + 页面抓取"两个 must-have；Claude Code 本身自带 WebSearch/WebFetch 工具，从零造只会重复官方已维护的工作。

**最可复用**：Tavily MCP（`tavily-ai/tavily-mcp`，官方，`claude mcp add` 一步接入，免费 1000 credits/月，无卡，工具集最全 search/extract/map/crawl）；零成本偏好则 `@zhafron/mcp-web-search`（无 key，DuckDuckGo/Bing/SearXNG 兜底 + SSRF 防护）。

**最大未知**：用户是否在意内置工具的固有限制（如搜索区域、抓取摘要粒度）。

完整答复见 [final-answer.md](final-answer.md)（含逐候选核验表格，2026-08-29 一手来源）。
