# Case 02 · 给编码 Agent 的网页搜索/浏览 MCP server（assess）

| 项 | 值 |
| --- | --- |
| 技能（B 臂） | `search-before-build-assess` |
| 模拟用户语言 | English |
| 补充材料 | 无 |
| 对比焦点 | Official MCP Registry 路由、registry 嵌套结构的归一化、免费/付费分层 |

## 背景与考察点

用户想做"让编码 Agent 能搜网页、读网页"的 MCP server。MCP 生态里此类工具已饱和（官方 fetch、playwright-mcp、tavily/exa/brave 等商业 search MCP）。适合检验：

1. B 臂指纹是否触发 Official MCP Registry（强触发信号：Agent tool / connector / MCP server）；A 臂默认搜索是否知道去 registry 找；
2. B 臂能否正确处理 registry 的嵌套返回（字段在 `server` 子对象内，`id` 常为 null，需用 `name` 当主键）；
3. 是否用 `repository.url` 交叉到 GitHub 做一手核验；
4. 免费（fetch、playwright）与付费（Tavily/Exa/Brave API）方案是否分层比较。

## 用户 prompt（两臂原样输入）

```text
I want to build an MCP server that gives my coding agent the ability to search
the web and read web pages, so it can look things up while helping me code.
Something I can run locally. Is this worth building, or does it already exist?
```

## 澄清脚本（两臂通用，仅回答被问到的问题）

1. 宿主/环境 → `I use Claude Code on my laptop, most of the time.`
2. 核心能力边界 → `Search the web for up-to-date info, and open any URL to read its content as clean text. Search results with links are enough; it doesn't need to click through complex JavaScript sites.`
3. 为什么不用现成/可接受成本 → `I don't really know what's out there — that's exactly what I want this assessment to find out. I'm fine using a free API tier if needed.`
4. 检索前确认（B 臂）→ `Confirmed.`

## B 臂路由观察表

| 来源 | 强度 | 触发依据 |
| --- | --- | --- |
| Official MCP Registry | must | 指纹 = Agent connector/MCP server |
| GitHub | must | registry 项 `repository.url` 交叉核验 + 开源实现（modelcontextprotocol/servers、microsoft/playwright-mcp 等） |
| web（宿主/DDG 兜底） | must | 商业 search API 产品（Tavily/Exa/Brave）与安装方式 |

## 两臂记录要点

- [ ] 候选清单：每臂最终提到的 MCP server / 方案（名称 + 链接 + 定性），标出重合项
- [ ] 来源覆盖：A 臂实际触达的平台；B 臂是否查询了 Official MCP Registry 及查询词
- [ ] registry 归一化：B 臂候选是否含真实 `name`/`description`/`repository.url`（而非空壳），同一 server 跨 registry/GitHub 是否去重为一个候选
- [ ] 免费 vs 付费分层是否出现于两臂建议中
- [ ] B 臂内核：kernel-input/output 是否生成，failedRequests/warnings 是否合理
- [ ] 两臂最终建议与理由链原文摘录

## 对比焦点

1. A 臂是否知道 Official MCP Registry 的存在并实际查询，还是只在 GitHub/web 上碰运气；
2. 两臂候选清单的重合度；B 臂多出的候选是否来自 registry 这一专门来源；
3. 对"本地可跑"约束的尊重程度：两臂推荐是否区分了本地 server 与云端 API；
4. 建议的可执行性（能否直接给出可安装的 server 名与安装方式）。
