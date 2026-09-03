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

> 指标定义与算法见 [METRICS.md](METRICS.md)（纯规范），本节只放数据。自动指标由 `node bench/metrics.mjs`（v2）提取。

| 指标 | A 臂（裸 agent） | B 臂（插件） | 差距 |
| --- | --- | --- | --- |
| 专有检索目录（5 case 并集，CC） | **0** | **8**（GitHub API / npm / MCP Registry / crates.io / Maven / Ecosyste.ms / HN / DDG兜底） | 0:8 |
| 每 case 平均目录数（CC） | 0 | 3.2 | — |
| 查询量（QV 合计） | 30 | 52 | 1.7× |
| 抓取量（FV 合计，去重 URL） | 33 | 135 | 4.1× |
| 引用密度（CD 合计） | 16 | 47 | 2.9× |
| 一手核验率 FVR（自动，URL 分母） | 0.75 | 0.88 | — |
| 一手核验率 FVR*（标注，全候选分母） | **≈40%** | **≈100%** | — |
| 时效陷阱处理（THR，case 04 Pocket/Omnivore） | 0/2 | 2/2 | — |
| 澄清轮次（CT，下界代理） | 0 | 2.8/5 case | — |
| 中文检索（LC，双语 case） | 0（case 03 全英文） | 0.5（有中文查询+DDG 中文兜底；case 04 仍未触发） | — |
| Composite（含 L2 标注，权重 0.3/0.2/0.3/0.2） | ≈0.25 | ≈0.71 | 2.8× |
| **成本**：工具调用总量 | 84 | 311 | 3.7×（B 的代价） |

**解读**：广度差距是结构性的——B 臂触达 8 个 A 臂从未碰过的专有检索目录，抓取量 4.1×、引用 2.9×；可信度的关键差异在 FVR*（严格口径）：A 臂约四成候选有真正的一手支撑（且 case 04 全凭记忆、零 URL 候选），B 臂全部候选经一手核验。自动口径 FVR（0.75:0.88）差距偏小，原因是**无 URL 的纯记忆候选不计入自动分母**——这正是必须同时报告两个口径的原因（METRICS.md §4.3）。时效维度差距最大（5.4×，自动口径）。A 臂唯一胜出点：case 05 靠 19 次宿主搜索广撒网（QV 单 case 最高），以及零流程零成本。

**口径备注**：① n=5、单模型 glm-5.2、单环境，描述性对比，不构成统计显著性；② A 臂宿主 WebSearch 本环境频繁空结果，B 臂兜底是产品设计，报告结论须注明环境依赖；③ CD 与 FVR 自动口径分臂不同源（A=聊天答复/candidates.md，B=简报 payload），只作方向性参考；④ CT 为下界代理（脚本附抽样核对）。

## 统计数据（自动提取，v2）

| Case | 臂 | QV | FV | CC | CD | LC | CT | 候选数 | FVR | VD | MR | DE | 工具调用 | Task/Agent |
| --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- |
| 01 openapi | baseline | 4 | 9 | 0 | 7 | — | 0 | 7 | 1.00 | 3.00 | 0.00 | 0 | 14 | 0 |
| 01 openapi | plugin | 8 | 34 | 4 | 16 | — | 2 | 7 | 1.00 | 2.00 | 0.00 | 1 | 85 | 0 |
| 02 mcp | baseline | 2 | 2 | 0 | 3 | — | 0 | 3 | 1.00 | 2.00 | 0.00 | 0 | 4 | 0 |
| 02 mcp | plugin | 9 | 15 | 4 | 10 | — | 3 | 5 | 0.80 | 1.00 | 0.80 | 1 | 62 | 0 |
| 03 zh | baseline | 5 | 12 | 0 | 6 | 0.5 | 0 | 4 | 0.75 | 2.25 | 0.75 | 0 | 18 | 0 |
| 03 zh | plugin | 10 | 15 | 3 | 5 | 0.5 | 2 | 5 | 0.60 | 0.60 | 0.60 | 1 | 45 | 0 |
| 04 read | baseline | 0 | 0 | 0 | 0 | 0 | 0 | 0 | — | 0 | — | 0 | 0 | 0 |
| 04 read | plugin | 16 | 45 | 3 | 8 | 0.5 | 4 | 4 | 1.00 | 2.25 | 0.00 | 1 | 84 | 0 |
| 05 rust | baseline | 19 | 10 | 0 | 0 | — | 0 | 6 | 1.00 | 2.67 | 0.50 | 0 | 48 | 0 |
| 05 rust | plugin | 9 | 26 | 2 | 8 | — | 3 | 3 | 1.00 | 3.00 | 0.33 | 1 | 35 | 0 |

注：A-04 候选数为 0 指其候选**全部无 URL**（纯记忆点名）——FVR 自动口径无分母，FVR* 口径记 0/3。CC 中 B-01=4 含内核 providerHint 声明的 npm 路由（经宿主 WebSearch 执行的目录路由无 URL，靠内核声明捕捉，见 METRICS.md §4.1）。

### 自动分类分（L0/L1，L2 未计入）

| 臂 | Breadth(auto) | Depth(auto) | Cred(auto) | Time(auto) |
| --- | --- | --- | --- | --- |
| baseline | 0.169 | 0.331 | 0.750 | 0.125 |
| plugin | 0.515 | 0.575 | 0.880 | 0.673 |

### 标注项（L2，rubric 见 METRICS.md §4.5）

| 指标 | A 臂 | B 臂 | 备注 |
| --- | --- | --- | --- |
| EL（证据分层 0–2） | 0.6（01/03/05=1，02/04=0） | 2.0（全链路：目录→短名单→一手核验） | |
| THR（陷阱处理，口径 A） | 0/2 = 0 | 2/2 = 1 | Pocket/Omnivore 双停服正确标注并排除 |
| KA（内核一致性） | N/A | 0.75 | 01=1（openapi-fetch 一致）；03=0.5、04=0.5（内核 top-1 分别为 DDG 查询页/已停服 Pocket，agent 覆盖有理由）；05=1（ripgrep 一致）；02 内核缺失 N/A |
| FVR*（全候选分母） | ≈0.40（≈14/33） | ≈1.00 | A 臂无 URL 候选（04 全部、02 Tavily）计入未核验 |
| TR（可追溯性，估算） | ≈0.3 | ≈0.95 | B 臂简报逐候选带 sources 数组 |

### 完整分类分与 Composite（L0+L1+L2）

| 臂 | Breadth | Depth | Cred | Time | Composite |
| --- | --- | --- | --- | --- | --- |
| baseline | 0.169 | ≈0.32 | ≈0.36 | ≈0.13 | **≈0.25** |
| plugin | 0.515 | ≈0.72 | ≈0.90 | ≈0.71 | **≈0.71** |

（权重 0.30/0.20/0.30/0.20，理由与配置项见 METRICS.md §5；Depth/Cred/Time 含上表标注值，TR 为估算故标 ≈。）

### 陷阱提及矩阵与内核 top-1（标注辅助输出）

- 陷阱提及：case-04 Pocket / Omnivore —— baseline 均未提及（—），plugin 均提及（✓）且标注停服（THR=1）。
- 内核 top-1：01 openapi-fetch（与主推一致）；02 无内核产物；03 DDG 查询页（退化候选，agent 覆盖）；04 Pocket（已停服产品被内核排 top-1，agent 正确覆盖——**内核排序的时效特征待改进**）；05 ripgrep（一致）。

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
5. **内核时效特征**：case 04 内核把已停服的 Pocket 排到 top-1（靠 agent 人工覆盖），维护/停服信号应进入排序特征。
6. **目录路由的执行方式偏差**：npm 发现实际经宿主 WebSearch 完成、未调用 registry API（case-01 由内核 providerHint 证实路由意图；case-02 内核文件缺失无法核实）——CC 的 URL 口径捕捉不到，已按内核声明口径补足。
7. **版本一致性**：case 05 的 plugin 结果为 v1 内核；若要求 5 个 case 全部同一内核版本，需重跑 case 05。

## 对"检索内核是否提升检索能力"的结论

- **支持**：B 臂在 5/5 case 触达了 A 臂从未触达的专门注册中心（8:0），抓取量 4.1×、引用 2.9×；严格口径一手核验率 ≈100% vs ≈40%；case 04 的时效陷阱（Pocket/Omnivore 双停服）与 HN 需求信号只有 B 臂做到；修复后内核的投影、合并、别名匹配三项在真实运行中验证通过。四维 Composite ≈0.71 vs ≈0.25（2.8×），代价是 3.7× 工具调用与更长耗时。
- **局限**：双语与 HF/arXiv 两条路线仍未闭环；内核排序缺时效特征（case 04 top-1 为已停服产品）；结论基于单模型（glm-5.2）、单批、5 用例，属观察性结论，不构成统计显著性。

## 证据位置

- 逐 case：`bench/results/<case-id>/{baseline,plugin}/`（turn-log、environment、candidates、coverage、decision、session.jsonl；plugin 另有 kernel-input/output 与 brief.html）
- 指标规范：`bench/results/METRICS.md`；提取脚本：`bench/metrics.mjs`（v2）
