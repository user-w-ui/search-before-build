# 双臂对比汇总（最终版，2026-08-29）

5 个真实场景用例，每个 case 只保留一份可信结果：`baseline/`（裸 Claude Code）+ `plugin/`（search-before-build 插件）。case 01–04 的 plugin 结果为**内核修复后**运行（capabilityAliases、web 投影、身份合并、DDG 兜底、HN 路由均已生效），case 05 的 plugin 结果为修复前运行（当时该 case 内核已正常，未重跑）。逐 case 对比见各 `results/<case-id>/comparison.md`。

## 总表

| Case | A 臂建议（baseline） | B 臂建议（plugin） | A 检索量 | B 检索量 | B 臂路由增量 |
| --- | --- | --- | --- | --- | --- |
| 01 OpenAPI→TS | 别造，试点 @hey-api/openapi-ts | Use existing（openapi-typescript+openapi-fetch） | 4 WebSearch（全空）+9 WebFetch | npm+GitHub+Maven+host-web+Ecosyste.ms，9 请求 0 失败 | Ecosyste.ms/Maven 首次触达；SaaS 层（Fern/Speakeasy）纳入；身份合并 obs=3 |
| 02 网页 MCP | 别造，官方 fetch + Brave | Use existing（Tavily MCP 首选） | 2 WebSearch（全空）+2 WebFetch | Registry+npm+GitHub+定价页+DDG+HN | Registry 专有路由、内置工具洞察、免费额度逐项核验 |
| 03 中文转写 | 拼装 Buzz + Ollama | Use existing（SmartSub/妙幕 + FunASR 组件） | 前 3 轮零检索，后 5 WebSearch+12 WebFetch（全英文） | GitHub REST+DDG 中文 4 条+HN；HF/arXiv 仍未触达 | 中文约束贴合 + 词汇命中 2/2（修复前 1/4） |
| 04 收藏整理 | 先试用 Readwise/Raindrop（**0 检索**） | Adapt（Raindrop 主干 + 薄摘要层） | 0 | DDG×8+WebFetch×27+GitHub+HN×2 | **HN 需求信号首次落地**；Pocket/Omnivore 双停服正确识别 |
| 05 Rust 搜索 | 别造，先用 rg+ast-grep | Adapt（ripgrep crate 级复用） | 19 WebSearch+9 WebFetch | GitHub REST+crates.io×3 | crates.io 注册中心路由 |

## 量化对比（一页速览）

> 数据来源：每臂 `session.jsonl` 工具调用日志 + 简报 payload，脚本 [`bench/metrics.mjs`](../../metrics.mjs) 自动提取；深度类标注项规则见 [METRICS.md](METRICS.md)。

| 指标 | A 臂（裸 agent） | B 臂（插件） | 差距 |
| --- | --- | --- | --- |
| 触达的专有检索目录（5 case 并集） | 0 | **8**（npm / MCP Registry / crates.io / Maven / Ecosyste.ms / HN / DDG兜底 / GitHub API） | 0:8 |
| 每 case 平均专有目录 | 0 | 3.0 | — |
| 引用 URL 数（合计） | 13 | 47 | 3.6× |
| 一手页面抓取（WebFetch 合计） | 35 | 58 | 1.7× |
| 候选一手核验率（标注） | ≈40% | ≈100% | — |
| 时效陷阱识别（case 04 Pocket/Omnivore） | 0/2 | 2/2 | — |
| 建议可执行性（0–2 分，均值） | 1.0 | 1.8 | — |
| 澄清问题数（中位数） | 0 | 3 | — |
| 工具调用总量（5 case 合计） | 84 | 311 | 3.7×（B 的代价） |
| 中文检索（case 03） | 0（全英文） | 有（WebSearch 中文 + DDG 中文兜底） | — |

**解读**：广度差距是压倒性的——B 臂系统性触达 8 个 A 臂从没碰过的专有检索目录，引用密度 3.6×，一手核验率近 100% 对 40%；case 04 的对比最极端（A 臂 0 检索纯记忆，B 臂 84 次工具调用）。代价是 B 臂 3.7× 的工具调用量与更长耗时。A 臂唯一胜出点是 case 05 靠宿主搜索广撒网发现的候选入口更宽（probe），以及零流程零成本。

**口径备注**：① n=5、单模型 glm-5.2、单环境，属描述性对比，不构成统计显著性；② A 臂宿主 WebSearch 在本环境频繁返回空结果，B 臂的 DDG/专有目录兜底是产品设计，也是本环境的产品差异本身；③ B 臂的引用计自简报（聊天答复是摘要、证据表在简报），A 臂计自聊天答复，两者不可直接同口径比密度，只作方向性参考。

## 修复验证汇总（case 01–04，post-fix）

| 修复项 | 验证结果 |
| --- | --- |
| web 记录投影 | ✓ case 01：4/8 候选 kind=web（修复前 12 条全丢） |
| 身份合并 | ✓ case 01：openapi-generator obs=3（github+maven+web），duplicateObservationsMerged=3 |
| capabilityAliases | ✓ case 01 五项齐备、case 03 中英双语文；case 03 词汇命中从 1/4 → 2/2 |
| DDG 匿名兜底 | ✓ case 02/03/04 在宿主 WebSearch 空结果时均正确触发 html.duckduckgo.com |
| HN Algolia 路由 | ✓ case 02/04 实际查询（case 04 命中 309 分需求证据）；case 01/03 未触发（该场景非社区痛点验证，属可接受） |
| 子代理禁令 | ✓ 4 个 post-fix 会话 Task/Agent 工具调用数均为 0（时长从 43 分钟失控 → 23–32 分钟可控） |
| references 读取 | ✓ case 04 本轮 5 个参考文件全部读取成功（上次的路径解析故障未复现） |

## 仍未闭环的缺口（下轮迭代候选）

1. **双语规则**：case 04 市场未知仍全程英文查询（规则未生效）；case 03 中文查询靠 DDG 兜底才走通（宿主 WebSearch 中文查询在本环境 100% 失败，属环境限制）。
2. **HF Hub / arXiv 路由**：case 03 两次运行均未实际查询（目录路由存在但 agent 未执行）。
3. **收尾路由-语言审计**：case 04 未显式出现。
4. **发现面**：hypergrep（2026-03 新项目）两臂都漏掉。
5. **版本一致性**：case 05 的 plugin 结果为 v1 内核；若要求 5 个 case 全部同一内核版本，需重跑 case 05。

## 对"检索内核是否提升检索能力"的结论

- **支持**：B 臂在 5/5 case 触达了 A 臂从未触达的专门注册中心（npm / MCP Registry / crates.io / Maven / Ecosyste.ms），全部候选一手核验；修复后内核的投影、合并、别名匹配三项在真实运行中验证通过；case 04 的时效陷阱（Pocket/Omnivore 双停服）与 HN 需求信号只有 B 臂做到。
- **局限**：双语与 HF/arXiv 两条路线仍未闭环；结论基于单模型（glm-5.2）、单批、5 用例，属观察性结论，不构成统计显著性。

## 证据位置

- 逐 case：`bench/results/<case-id>/{baseline,plugin}/`（turn-log、environment、candidates、coverage、decision、session.jsonl；plugin 另有 kernel-input/output 与 brief.html）
