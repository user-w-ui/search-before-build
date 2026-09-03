# 检索评测量化指标规范（METRICS SPEC）

> **本文件只定义指标与计算方法，不存放任何批次的统计数据。** 运行数据与结论统一放在 [`SUMMARY.md`](./SUMMARY.md)。
> 参考实现：[`bench/metrics.mjs`](../metrics.mjs)（计算全部 L0/L1 指标，并为 L2 标注输出辅助矩阵）。本文档是该脚本的唯一规范来源；修改指标先改这里，再改脚本。

## 1. 数据源与基本口径

| 数据源 | 内容 | 用于 |
| --- | --- | --- |
| `<case>/<arm>/session.jsonl` | 每臂原始会话：工具调用（名称+参数）、工具结果、用户回合、助手文本 | L0 计数类指标 |
| `<case>/plugin/artifacts/brief.html` | B 臂渲染简报内嵌 payload（`competitors[].url`、`sources[].url`） | B 臂候选集与引用集 |
| `<case>/baseline/candidates.md` | A 臂候选清单（B 臂简报缺失时的回退源） | A 臂候选集 |
| `<case>/plugin/artifacts/kernel-{input,output}.json` | 内核检索信封（providerHint）与排序产物 | CC 补充口径、KA 标注 |

**分臂口径**：
- **候选集**：B 臂 = 简报 payload 的 `competitors[].url`；A 臂 = `candidates.md` 中提取的 URL。
- **引用集（CD）**：A 臂 = 最终聊天答复中的去重 URL；B 臂 = 简报 payload 的 `competitors[].url ∪ sources[].url`（B 臂聊天答复是摘要、证据表在简报，两者不同口径，只作方向性对比）。
- **成功抓取**：WebFetch 结果无错误标记，或 curl 命令中出现的 URL（视为尝试成功，L0 近似）。

## 2. 自动化分层

| 层级 | 含义 | 指标 |
| --- | --- | --- |
| **L0** | 全自动，无主观 | QV、FV、CD、LC、DE、CT（代理）、CC（URL 部分） |
| **L1** | 规则匹配为主，人工复核 | FVR、VD、MR、CC（内核声明部分）、TR |
| **L2** | 人工按固定 rubric 标注，脚本仅输出辅助信息 | FVR*、EL、THR、KA |

## 3. 指标总表

| 类别 | 指标 | 缩写 | 算法（概要） | 层级 | 归一化 |
| --- | --- | --- | --- | --- | --- |
| **广度** | 目录覆盖 | CC | 抓取 URL host 映射到目录字典（§4.1）去重计数；B 臂并入内核 `providerHint` 声明的目录 | L0/L1 | CC/10 |
| | 查询量 | QV | WebSearch 次数 + 命中搜索端点特征的 curl URL 数 | L0 | min(QV/30, 1) |
| | 抓取量 | FV | 成功抓取的去重 URL 数 | L0 | min(FV/30, 1) |
| | 引用密度 | CD | 引用集（分臂口径见 §1）去重 URL 数 | L0 | min(CD/15, 1) |
| | 语言覆盖 | LC | 中文查询≥1 计 0.5 + 英文查询≥1 计 0.5；**仅双语 case 计入聚合**（§6 注册表） | L0 | 本身 ∈[0,1] |
| **深度** | 澄清轮次 | CT | 澄清阶段问答对计数（§4.2 三条规则），下界代理 | L0* | CT/5 |
| | 核验深度 | VD | Σ(每候选被"关于它"的抓取数，上限3) / 候选数 | L1 | min(VD/3, 1) |
| | 证据分层 | EL | 0=纯记忆/摘要；1=部分核验；2=目录发现→短名单→一手核验全链路 | L2 | EL/2 |
| **可信度** | 一手核验率 | FVR | 带规范 URL 的候选中，被"关于它"的抓取命中的比例（§4.3 匹配规则） | L1 | 本身 ∈[0,1] |
| | 一手核验率（严格版） | FVR* | 分母改为**全部最终候选**（无 URL 的候选视为未核验） | L2 | 本身 ∈[0,1] |
| | 可追溯性 | TR | 结论中带 URL 的定性陈述占比 | L1/L2 | 本身 ∈[0,1] |
| | 内核一致性 | KA | B 臂最终主推 vs 内核 top-1 一致，或覆盖排序有理由；A 臂 N/A 剔除 | L2 | 本身 ∈[0,1] |
| **时效性** | 陷阱处理率 | THR | 陷阱注册表（§6）逐项二元判定（§4.4 三条规则），口径必须写死 | L2 | 本身 ∈[0,1] |
| | 维护信号率 | MR | 候选中"关于它"的抓取含维护特征 URL（releases/commits/activity/GitHub repos API）的比例 | L1 | 本身 ∈[0,1] |
| | 日期证据 | DE | 任一工具结果内容含 ISO 日期（`\d{4}-\d{2}-\d{2}`）即 1 | L0 | 二元 |
| **成本**（只报告，不进总分） | 工具调用总量 / 耗时 / token | — | 会话工具调用总数；起止时间戳差；usage 字段求和 | L0 | 不归一 |

## 4. 指标定义与计算规则

### 4.1 CC（目录覆盖）

目录字典（10 项）：`api.github.com→GitHub API`、`registry.npmjs.*→npm`、`registry.modelcontextprotocol.io→MCP Registry`、`crates.io→crates.io`、`search.maven.org|repo1.maven.org→Maven Central`、`packages.ecosyste.ms→Ecosyste.ms`、`huggingface.co→HF Hub`、`export.arxiv.org→arXiv`、`hn.algolia.com→HN Algolia`、`html|lite.duckduckgo.com→DDG fallback`。

- URL 部分：会话中所有被请求的 URL（WebFetch + curl 命令）按 host 匹配字典，去重。
- 内核声明部分（仅 B 臂）：`kernel-input.json` 中 `retrievals[].providerHint` 映射为目录标签后并入。**原因**：经宿主 WebSearch 执行的目录路由不产生可扫描的 URL，只能靠内核声明捕捉。A 臂无内核，保持纯 URL 口径。
- 已知局限：B 臂内核文件缺失时（如被 `--consume-input` 清理）该部分不可恢复，CC 成为下界。

### 4.2 CT（澄清轮次，下界代理）

同时满足三条才算一个问答对：
1. **截止点**：仅统计第一条"建议性长消息"（>400 字符且含建议性结论词：recommendation / 建议 / use existing / don't build / 别造 / 别从零 / 不值得）**之前**的提问——建议后的追问（如"要不要我给你写配置步骤？"）不计；
2. **问句判定**：`?` 或 `？` 出现在文本**后 70% 区间**（容忍问号后的括号补语、加粗符号）；
3. **配对**：其后存在一条**非确认类**用户文本（确认类 = Confirmed / 确认 / Yes, continue / 继续 / Please / Stop 等）。

已知局限：为下界代理，个别问答对会漏计（脚本输出 CT 抽样供人工核对）；跨臂对比时同规则执行，偏差方向一致。

### 4.3 FVR / VD / MR（候选核验族）

**URL 规范键**（同一项目的不同写法须归并为同一身份）：
- `github.com` / `api.github.com/repos/*` / `raw.githubusercontent.com` → `gh:<owner>/<repo>`
- `npmjs.com(/package/*)` / `registry.npmjs.org/*` → `npm:<name>`
- `crates.io/crates/*` → `crate:<name>`
- 其余 → `<host>:<归一化路径>`

**"关于"关系**（`isAbout`）：抓取 URL 与候选同规范键，或同为 GitHub 键且 owner/repo 相同，或同 host。

- **FVR** = 被任一"关于"它的抓取命中的候选数 / **带规范 URL 的候选数**。无 URL 的候选（纯记忆点名）不计入分母——这是与 FVR* 的唯一区别。
- **FVR***（L2 严格版）= 同分子 / **全部最终候选数**（无 URL 候选视为未核验）。纯记忆型臂在 FVR 下可能虚高，FVR* 才是真实核验率，两者必须同时报告。
- **VD** = 每候选的"关于"抓取数（单候选上限 3）的均值。
- **MR** = 候选中"关于"抓取含维护特征（`github.com/<o>/<r>/(releases|commits|activity|pulse)` 或 `api.github.com/repos/`）的比例。

### 4.4 THR（陷阱处理率）

陷阱来自 §6 注册表（测试设计时预埋，标准答案只在标注时使用，不进被测会话）。每个陷阱二元判定，采用**口径 A**（未提及也计 0 分——对品类头部产品"没发现"本身就是深度不足的证据；若改用口径 B 需在报告中标明并全批一致）：

```
从未被提及                                → 0
被提及且停服事实被明确标注，且未作为健康候选推荐 → 1
被提及但当健康候选（无论最终是否推荐）            → 0
```

脚本自动输出**提及矩阵**（提及 ≠ 正确处理）；"是否正确标注"由标注员按 turn-log/decision 判定。

### 4.5 其余标注项 rubric

- **EL**：0 = 候选全部来自模型记忆或搜索摘要；1 = 部分候选有一手核验；2 = 完整链路（目录发现 → 短名单 → 逐候选一手核验）。
- **KA**：1 = 最终主推与内核 top-1 一致；0.5 = 不一致但覆盖排序给出了明确理由（如 must-have 贴合度）；0 = 不一致且无理由。A 臂 N/A，聚合时从分母剔除。
- **TR**：最终产物（A=聊天答复，B=简报）中对候选的定性陈述里，附带可点开来源的比例。

## 5. 聚合算法

```
类别分 = 该类各指标归一化值的算术平均（N/A 指标剔除后重分母）
  Breadth = mean(CC/10, QVn, FVn, CDn, LC)          # LC 仅双语 case
  Depth   = mean(CT/5, VDn, EL/2)                    # 自动部分 = mean(CTn, VDn)
  Cred    = mean(FVR 或 FVR*, TR, KA)                # 自动部分 = mean(FVR)
  Time    = mean(THR, MR, DE)                        # 自动部分 = mean(MR, DE)

臂级分 = 各 case 类别分的均值（跨 5 case）
Composite = 0.30·Breadth + 0.20·Depth + 0.30·Cred + 0.20·Time
```

- **权重理由**：广度与可信度是双臂差异的主要来源，0.30；深度与广度相关性高，0.20；时效在当前批次仅 2 个陷阱点、样本薄，0.20。权重为配置项，报告必须随分附上。
- **归一化上限（30/15/3/10/5）为配置项**：固定上限适合跨批次回归对比；换 min-max 归一得相对分，只适合单批内比较。两种不可混用。
- **成本三件套**（工具调用总量、耗时、token）**只报告、不进总分**——收益分数必须与成本同页呈现，否则误导。

## 6. 注册表（随测试集演进，脚本内同源维护）

- **陷阱注册表**（THR 用）：当前仅 `case-04-read-later-organizer` → Pocket（2025-07 停服）、Omnivore（2024-11 停服）。新增陷阱：在 `bench/metrics.mjs` 的 `TRAPS` 与本节同步登记，并在 case 设计文档中预埋。
- **双语 case 注册表**（LC 用）：当前 `case-03-zh-asr-tool`（中文市场）、`case-04-read-later-organizer`（市场未知）。其余 case 的 LC 记 N/A 不入聚合。

## 7. 脚本使用

```bash
node bench/metrics.mjs           # markdown 输出：指标表 + 自动分类分 + 提及矩阵 + 内核 top-1 + CT 抽样
node bench/metrics.mjs --json    # 机器可读输出
```

脚本计算：QV、FV、CC、CD、LC、CT、VD、FVR、MR、DE + 自动分类分。脚本不计算、只输出标注辅助信息的：提及矩阵（THR 用）、内核 top-1（KA 用）、CT 抽样（人工复核代理误计）。EL、THR 判定、KA 判定、TR、FVR* 由标注员按 §4.5 rubric 填入 `SUMMARY.md`。

## 8. 有效边界

1. **样本量**：n=5/臂、单模型、单环境。输出定位是**回归基线**（改内核 → 重跑 → 看四维分数与单项指标移动）与方向性描述，不构成统计显著性。
2. **主观成分的精确位置**：EL 分层、THR 的"正确标注"判定、KA 判定、FVR* 的全候选分母核对——四处 L2，rubric 已固化，但执行是人；CT 为下界代理。
3. **环境偏差**：宿主 WebSearch 可用性直接影响 A 臂表现（本环境频繁空结果）；B 臂的兜底优势部分是产品设计，报告时必须注明环境依赖。
4. **数据缺失**：B 臂内核文件被会话清理时（`--consume-input`、run 目录未归档），CC 的内核声明部分与 KA 不可恢复，指标降级为下界并显式标注。
