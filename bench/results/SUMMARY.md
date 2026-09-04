# 检索能力双臂对比结果报告（12 case，2026-09-04）

我们用 12 个真实软件选型场景检验"检索内核是否提升 agent 的检索能力"。每个 case 跑两臂：**A 臂（baseline）**＝裸 agent 直接回答；**B 臂（plugin）**＝同一 agent 加载 search-before-build 插件（内置目录路由、注册中心检索与候选核验内核）。全部 24 个会话的原始数据保存在 `bench/results/<case-id>/{baseline,plugin}/`。

## 测试集

12 个 case 覆盖两类任务、三个运行环境：

| 批次 | Case | 类型 | 宿主 / 模型 |
| --- | --- | --- | --- |
| 2026-08 | 01–05（OpenAPI 客户端、网页 MCP、中文转写、收藏整理、Rust 代码搜索） | 从零造 or 用现成 | Claude Code / glm-5.2 |
| 2026-09 | 06–09（发票报销自动化、照片去重、家庭摘要、离线 PDF 转 Excel） | 从零造 or 用现成 | Codex CLI / gpt-5.6-luna |
| 2026-09 | 10–12（Kaggle ML agent、深度研究 agent、金融分析 agent） | 评估本地已有项目 | Claude Code / claude-opus-5 |

各 case 的双臂最终建议：

| Case | A 臂建议（baseline） | B 臂建议（plugin） |
| --- | --- | --- |
| 01 OpenAPI→TS | 别造，试点 @hey-api/openapi-ts | Use existing（openapi-typescript+openapi-fetch） |
| 02 网页 MCP | 别造，官方 fetch + Brave | Use existing（Tavily MCP 首选） |
| 03 中文转写 | 拼装 Buzz + Ollama | Use existing（SmartSub/妙幕 + FunASR 组件） |
| 04 收藏整理 | 先试用 Readwise/Raindrop（0 检索，纯记忆） | Adapt（Raindrop 主干 + 薄摘要层） |
| 05 Rust 搜索 | 别造，先用 rg+ast-grep | Adapt（ripgrep crate 级复用） |
| 06 发票报销 | 造窄 MVP（拼装 FP/PaddleOCR/Paperless-ngx） | Adapt（FP 报销系统为主干 + PaddleOCR 识别层） |
| 07 照片去重 | Build（本地小工具 MVP） | Adapt（immich-automated-selfie-timelapse 为主） |
| 08 家庭摘要 | Adapt（生态薄编排层） | Adapt（paperr 自托管为主干） |
| 09 PDF→Excel | Adapt（Camelot/Docling 组件 + 审核流） | Adapt（Camelot 主 seam + OCRmyPDF） |
| 10 Kaggle ML | 改造（AutoGluon 替换训练层，保留 AG2 决策层） | Build（补显式 CV/OOF 追踪/submission 校验） |
| 11 深度研究 | Adapt（转投同级 gpt-researcher 系项目） | Adapt（tarun7r/deep-research-agent 为主） |
| 12 金融分析 | 不值得继续（4.6/10，演示级原型；0 检索，仅读码） | Adapt（edgartools+DCF 库+数据溯源标注层） |

## 指标

完整定义与算法见 [METRICS.md](METRICS.md)，由 `node bench/metrics.mjs` 全自动提取。四个类别：

| 类别 | 指标 | 含义 |
| --- | --- | --- |
| 广度 | QV / FV / CC / CD / LC | 查询量、去重抓取 URL 数、触达的专有检索目录数（GitHub API、npm、crates.io、HuggingFace、arXiv 等 10 项目录字典）、引用 URL 数、中英文查询覆盖 |
| 深度 | CT / VD | 澄清轮次（下界代理）、每候选的平均一手核验抓取数 |
| 可信度 | FVR | 带 URL 候选中被一手抓取核验的比例 |
| 时效性 | MR / DE / THR | 维护信号（releases/commits）核验比例、结果含日期证据、停服陷阱识别（case 04 预埋 Pocket/Omnivore 双陷阱） |

各指标归一化到 0–1 后合成类别分，再按 0.30/0.20/0.30/0.20 加权得 Composite（广度与可信度权重高，因两臂差异主要来源于此）。**成本不计入分数，只单列工具调用总量。**

## 总体结果

### 一页速览

| 指标 | A 臂（裸 agent） | B 臂（插件） | 差距 |
| --- | --- | --- | --- |
| 专有检索目录（12 case 并集） | **0** | **10**（目录字典全覆盖） | 0:10 |
| 每 case 平均目录数 | 0 | 2.83 | — |
| 查询量（QV 合计） | 138 | 154 | 1.1× |
| 抓取量（FV 合计，去重 URL） | 111 | 216 | 1.9× |
| 引用密度（CD 合计） | 41 | 112 | 2.7× |
| 一手核验率 FVR（均值） | 0.75 | 0.78 | 持平（见解读） |
| 澄清轮次 CT（均值） | 0（12 case 全 0） | 2.92 | — |
| 停服陷阱处理 THR（case 04） | 0/2 | 2/2 | — |
| 日期证据 DE（命中 case 数） | 3/12 | 9/12 | — |
| 零检索 case | 2（04、12，纯记忆作答） | 0 | — |
| **Composite** | **0.341** | **0.592** | **1.7×** |
| 每 case 胜负 | 1/12 | **11/12** | — |
| 成本：工具调用总量 | 176 | 554 | 3.1× |

### 每 case 明细

| Case | 臂 | QV | FV | CC | CD | LC | CT | 候选数 | FVR | VD | MR | DE | 工具调用 |
| --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- |
| 01 openapi | baseline | 4 | 9 | 0 | 7 | — | 0 | 7 | 1.00 | 3.00 | 0.00 | 0 | 14 |
| 01 openapi | plugin | 8 | 34 | 4 | 16 | — | 2 | 7 | 1.00 | 2.00 | 0.00 | 1 | 85 |
| 02 mcp | baseline | 2 | 2 | 0 | 3 | — | 0 | 3 | 1.00 | 2.00 | 0.00 | 0 | 4 |
| 02 mcp | plugin | 9 | 15 | 4 | 10 | — | 3 | 5 | 0.80 | 1.00 | 0.80 | 1 | 62 |
| 03 zh | baseline | 5 | 12 | 0 | 6 | 0.5 | 0 | 4 | 0.75 | 2.25 | 0.75 | 0 | 18 |
| 03 zh | plugin | 10 | 15 | 3 | 5 | 0.5 | 2 | 5 | 0.60 | 0.60 | 0.60 | 1 | 45 |
| 04 read | baseline | 0 | 0 | 0 | 0 | 0 | 0 | 0 | — | 0 | — | 0 | 0 |
| 04 read | plugin | 16 | 45 | 3 | 8 | 0.5 | 4 | 4 | 1.00 | 2.25 | 0.00 | 1 | 84 |
| 05 rust | baseline | 19 | 10 | 0 | 0 | — | 0 | 6 | 1.00 | 2.67 | 0.50 | 0 | 48 |
| 05 rust | plugin | 9 | 26 | 2 | 8 | — | 3 | 3 | 1.00 | 3.00 | 0.33 | 1 | 35 |
| 06 invoice | baseline | 18 | 28 | 0 | 9 | — | 0 | 18 | 1.00 | 2.11 | 0.00 | 0 | 13 |
| 06 invoice | plugin | 9 | 10 | 2 | 10 | — | 4 | 7 | 1.00 | 2.14 | 0.00 | 0 | 11 |
| 07 photo | baseline | 11 | 3 | 0 | 4 | — | 0 | 4 | 0.75 | 1.50 | 0.00 | 1 | 4 |
| 07 photo | plugin | 22 | 9 | 0 | 7 | — | 4 | 5 | 0.80 | 2.40 | 0.00 | 0 | 9 |
| 08 household | baseline | 30 | 25 | 0 | 0 | — | 0 | 27 | 1.00 | 2.48 | 0.00 | 0 | 12 |
| 08 household | plugin | 12 | 15 | 4 | 11 | — | 3 | 7 | 0.71 | 1.00 | 0.00 | 1 | 16 |
| 09 offline | baseline | 40 | 22 | 0 | 8 | — | 0 | 18 | 1.00 | 2.00 | 0.00 | 0 | 22 |
| 09 offline | plugin | 2 | 12 | 2 | 8 | — | 0 | 5 | 1.00 | 1.00 | 1.00 | 0 | 14 |
| 10 compare | baseline | 3 | 0 | 0 | 4 | — | 0 | 4 | 0.00 | 0.00 | 0.00 | 1 | 15 |
| 10 compare | plugin | 20 | 20 | 3 | 12 | — | 5 | 5 | 0.60 | 1.80 | 0.60 | 1 | 71 |
| 11 compare | baseline | 6 | 0 | 0 | 0 | — | 0 | 4 | 0.00 | 0.00 | 0.00 | 1 | 19 |
| 11 compare | plugin | 16 | 8 | 3 | 7 | — | 5 | 5 | 0.60 | 0.60 | 0.60 | 1 | 56 |
| 12 compare | baseline | 0 | 0 | 0 | 0 | — | 0 | 0 | — | 0 | — | 0 | 7 |
| 12 compare | plugin | 21 | 7 | 4 | 10 | — | 0 | 5 | 0.20 | 0.40 | 0.20 | 1 | 66 |

（"—"＝该指标对此臂无定义：LC 仅双语 case 计入（03/04）；A-04、A-12 候选全部无 URL 或零检索，FVR/MR 无分母。）


### 臂级汇总（12 case 均值）

| 臂 | Breadth | Depth | Cred | Time | Composite |
| --- | --- | --- | --- | --- | --- |
| baseline | 0.227 | 0.250 | 0.625 | 0.177 | **0.341** |
| plugin | 0.469 | 0.544 | 0.776 | 0.547 | **0.592** |

## 解读

- **广度差距是结构性的**：B 臂在 12 个 case 中触达了全部 10 个专有检索目录（GitHub API、npm、MCP Registry、crates.io、Maven Central、Ecosyste.ms、HF Hub、arXiv、HN Algolia、DDG），A 臂一个都没有——裸 agent 的检索全部经通用搜索完成，从不查注册中心。引用密度 2.7×、抓取量 1.9× 由此而来。
- **A 臂的失败模式是零检索作答**：case 04 全程 0 次工具调用、case 12 仅读本地代码，两案均凭模型记忆给出建议；B 臂 12 个 case 全部有真实检索。
- **可信度须看口径**：自动 FVR 两臂持平（0.75:0.78）——但该口径的分母只有"带 URL 的候选"，A 臂零检索 case 的无 URL 纯记忆候选根本不进分母。剔除该口径的掩护后，A 臂零检索案的建议实际上无一手证据支撑。
- **澄清与时效是 B 臂独有行为**：A 臂 12 个 case 无一提出澄清问题（CT 全 0）；case 04 预埋的 Pocket（2025-07 停服）/Omnivore（2024-11 停服）双陷阱只有 B 臂发现并正确排除，A 臂未提及任何停服事实仍推荐了相关品类产品。
- **B 臂并非全胜**：case 09 是唯一丢分项——内核路由直连使核验极精准（FVR=1.0、MR=1.0）但查询量仅 2、无日期证据，被 A 臂 40 次查询的广撒网在广度上反超；case 12 的候选核验链路偏弱（FVR=0.20）。
- **代价**：B 臂工具调用总量 3.1× 于 A 臂，换取上述检索质量差异。

## 口径与局限

1. 三批 case 的模型与宿主不同（glm-5.2 / gpt-5.6-luna / claude-opus-5），臂间差异混入了模型能力差异；n=12、单环境，属观察性对比，不构成统计显著性。
2. A 臂宿主 WebSearch 在本环境频繁返回空结果，B 臂的 DDG 匿名兜底是产品设计，结论有环境依赖。
3. CD 与 FVR 的自动口径分臂不同源（A=聊天答复/candidates.md，B=简报 payload），只作方向性参考；CT 为下界代理。
4. 报告的 Composite 为自动可提取指标（L0/L1）合成；证据分层（EL）、严格核验率（FVR*）、可追溯性（TR）等人工标注项不在本表内。

## 结论

**支持"检索内核提升检索能力"**：加载插件的一臂在 11/12 case 上综合得分更高（0.592 vs 0.341，1.7×），触达 10:0 的专有检索目录，引用 2.7×，且独有澄清行为（CT 2.92 vs 0）、停服陷阱识别（2/2 vs 0/2）与日期证据（9/12 vs 3/12）；裸 agent 的两个零检索 case 说明其建议可能完全建立在模型记忆之上。代价是 3.1× 的工具调用量。B 臂的丢分 case（09 广度塌陷、12 核验不足）指出了内核路由在"精准"与"广度"之间的权衡空间。

## 证据位置

- 逐 case 原始数据：`bench/results/<case-id>/{baseline,plugin}/`（turn-log、environment、candidates、coverage、decision、session.jsonl；plugin 另有 kernel-input/output 与 brief.html）
- 指标规范：[METRICS.md](METRICS.md)；提取脚本：`bench/metrics.mjs`
