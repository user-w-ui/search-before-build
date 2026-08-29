# Case 02 · B 臂（plugin）检索覆盖

来自简报 coverage 数组 + 会话 curl 日志。

| 来源 | 状态 | 说明 |
| --- | --- | --- |
| Official MCP Registry | used | 查询 fetch / brave / tavily / serper，返回 transports、env vars、repo identities |
| npm | used | 查询 "mcp web search"、"tavily mcp"、"mcp server fetch"，返回包名/版本/license/repo 链接 |
| GitHub | limited | 匿名 REST 检索 + README 抓取；无 gh CLI、无鉴权，可能漏低曝光项目 |
| Host Web search | unavailable | 宿主 WebSearch 对 material 查询返回空 → 回退匿名 DuckDuckGo HTML |
| DDG fallback | used | html.duckduckgo.com 兜底查询（MCP web search 等） |
| HN Algolia | used | 查询 "MCP web search server"（需求信号） |
| 定价/官方页 | used | 抓取 Brave/Tavily 官方定价页核验免费档（2026-08-29） |

未使用：crates.io / Maven / Ecosyste.ms / HF Hub / arXiv（指纹不匹配，属合理排除）。
