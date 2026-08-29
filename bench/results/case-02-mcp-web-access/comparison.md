# Case 02 · A/B 对比（给编码 Agent 的网页访问 MCP）

> **B 臂为修复后最终运行**（内核 v2，`--disallowed-tools Task Agent`；宿主 WebSearch 空 → DDG 兜底生效）。
> 共同环境：glm-5.2，Claude Code 2.1.220，无 GitHub MCP/gh。

| 维度 | A 臂（baseline，~1 min） | B 臂（plugin，最终版） |
| --- | --- | --- |
| 建议 | It already exists：官方 fetch + Brave Search | **Use existing**：Tavily MCP 首选（免费 1000 credits/月，`claude mcp add` 一步）；零成本则 @zhafron/mcp-web-search |
| 检索主动性 | 主动：2 WebSearch（全空）+ 2 WebFetch，只抓了 GitHub 一个仓库 | 澄清 3 问 + Official MCP Registry（fetch/brave/tavily/serper）+ npm + GitHub README 一手核验 + 官方定价页 |
| 来源覆盖 | GitHub 单点；**从未触达 MCP Registry** | Registry、npm、GitHub、**DDG 匿名兜底**（host WebSearch 空时自动重试）、**HN Algolia 首次被查询** |
| 候选 | fetch、Brave、Tavily（记忆断言，未核验）、Puppeteer | 5 个（Tavily/Brave/@zhafron/duckduckgo-mcp/Fetch），全部一手核验 2026-08-29，免费额度逐项核实 |
| 澄清 | 零提问 | 3 个 material 问题按脚本作答 |
| 内核 | 无（预期） | 运行正常（上一版"8/9 成功却全标 missing"未复现；最终建议基于逐候选核验表） |

**对比焦点结论**：B 臂的增量价值完整保留——registry 专有路由、内置工具洞察（A 臂没有的选项）、逐候选一手核验；A 臂的 Tavily 是零核验断言。修复后的 B 臂在证据质量上是碾压级的。

证据：[A decision](baseline/decision.md) · [B decision](plugin/decision.md) · [B 最终答复全文](plugin/final-answer.md) · [B 简报](plugin/artifacts/brief.html)
