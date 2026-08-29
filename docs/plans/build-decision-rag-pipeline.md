# 升级计划：Build 决策检索与证据管线

## 1. 目标与版本边界

`search-before-build` 需要在现有 `assess` / `compare` 工作流下面增加一个可执行、可测试、可追溯的决策内核。

本版本只解决四件事，并严格按下面的顺序实现：

1. 确定主要检索工具，基于真实返回样例冻结最小输入信封、能力描述和渐进归一化规则。
2. 实现简单、有效、可解释、强容错的算法层。
3. 先建立小规模 smoke benchmark，验证 fixtures、指标和 runner；正式的普通 Web Search 对照集后续单独构建。
4. 把新内核接回现有技能，完成文档、本地打包检查、验证和本地提交。本轮不发布、不打 tag、不 push。

DeepSeek Harness、OpenCode、Pi 和 VS Code Marketplace 的运行时适配不属于本版本。当前只保证内核不依赖 Codex / Claude Code 的专有返回结构，为下一版本保留干净的 Adapter seam。

## 2. 产品重定位

通用 Web Search 已有成熟的宿主原生工具、MCP 和商业提供商。本项目不与它们竞争抓取规模或搜索索引。

新定位：

> **Build 决策检索与证据管线**——复用宿主或公共检索工具，把分散结果转化为经过归一化、去重、融合、验证和需求对齐的证据包，再约束 Agent 给出可审计的 Build / Adapt / Use existing / Stop 决策。

“RAG”只作为理解这条管线的类比，不作为产品能力宣传。本版本没有持续知识库、向量数据库或强制 embedding 模型，核心问题是短列表候选融合与证据验证。

项目真正需要证明的能力是：

- 能把功能指纹编译成结构化搜索计划；
- 能兼容不同检索工具的返回结构和失败方式；
- 能在不依赖 embedding 的前提下融合几十个候选；
- 能说明候选为何入选、淘汰或需要继续验证；
- 能用 benchmark 证明它优于“让 Agent 随便搜一下”。

## 3. 设计原则

1. **检索复用优先**：优先使用宿主原生搜索和用户已有 MCP；只有能力缺失时才使用匿名兜底。真实返回形状和工具选择依据见 [retrieval-sources.md](../resources/retrieval-sources.md)。
2. **每次运行每类只选一个主 Adapter**：不在核心内维护大型 provider 回退生态；但允许不同宿主、不同运行环境为同一来源类别提供不同 Adapter。
3. **小接口、深实现**：调用者只需把任意原始返回值和本次调用上下文交给一个管线入口；字段定位、类型转换、错误分类、去重、融合和门禁都隐藏在模块内部。这里统一的是插件自己的处理入口，不是外部工具的字段。
4. **程序化负责确定性，LLM 负责语义判断**：解析、归一化、排序、账本、阈值和 schema 校验由代码完成；查询改写、能力映射和最终建议由 LLM 在结构化协议下完成。
5. **先词法、后语义**：首版使用字段权重、BM25F、RRF 和规则信号；embedding 只保留为未来可选的 `RankerAdapter`。
6. **缺字段和失败都是正常状态**：超时、限流、鉴权缺失、字段缺失、未知返回形状和部分结果必须进入 artifact，而不是直接让整次研究失败。
7. **先固定评测再调权重**：试运行后冻结数据集和指标，再调整算法，避免为了已有结果修改 benchmark。

## 4. 总体架构

```text
用户请求 / 现有仓库
        │
        ▼
功能指纹 ──→ SearchPlan
                  │
                  ▼
       Tool / Platform Adapter
       host / MCP / anonymous
                  │
                  ▼
       Raw RetrievalEnvelope[]
                  │
                  ▼
┌────────────────────────────────────┐
│ Retrieval Ingress                  │
│ decode → locate → project → coerce │
│ → identity → warnings              │
└────────────────────────────────────┘
                  │
                  ▼
     NormalizationResult[]
                  │
                  ▼
┌────────────────────────────────────┐
│ Build Decision Core                │
│ fuse → score → evidence             │
│ → budget → stop → decide           │
└────────────────────────────────────┘
                  │
                  ▼
       DecisionArtifact + Trace
                  │
                  ▼
   现有报告查看器 / Skill 最终建议
```

外部只暴露三个小接口：

```ts
interface RetrievalAdapter {
  retrieve(request: RetrievalRequest): Promise<unknown>;
}

interface RetrievalIngress {
  normalize(envelope: RetrievalEnvelope): NormalizationResult;
}

interface BuildDecisionCore {
  advance(state: DecisionState, event?: DecisionEvent): DecisionStep;
}
```

`RetrievalAdapter` 只负责调用工具，返回值明确为 `unknown`，因此不会要求外部工具遵守我们的字段结构。`RetrievalIngress` 是深模块：它通过少量格式 Decoder、数据驱动 Profile、保守的通用 fallback 和字段降级规则吸收返回差异。`BuildDecisionCore` 是同步、确定性的状态机；它不直接调用宿主工具或模型，而是返回下一步动作：

```ts
type DecisionStep =
  | { state: DecisionState; action: { kind: "retrieve"; request: RetrievalRequest } }
  | { state: DecisionState; action: { kind: "semantic"; task: SemanticTask } }
  | { state: DecisionState; action: { kind: "complete"; result: DecisionArtifact } };
```

Adapter 或 Agent 执行动作，把原始结果和调用上下文包装成最小 `RetrievalEnvelope`；`RetrievalIngress` 再产出宽松的 `NormalizationResult`。只有归一化后的记录和受 schema 约束的语义结果会作为 `DecisionEvent` 送回内核。这样固定事件序列一定产生固定状态和 trace，也能把网络、解析、模型随机性与算法测试分开。

当前 Codex / Claude Code 技能可通过 CLI 形式调用同一状态机：`init` 创建状态，`next` 取下一动作，`normalize` 接收原始工具结果，`ingest` 写回归一化事件，`validate` 执行门禁。下一版本接入 OpenCode / DeepSeek Harness 时，只增加自动循环和工具调用 Adapter，不改整合与算法层。

## 5. 第一阶段：检索工具与渐进归一化

### 5.1 冻结首版来源范围

来源目录可以继续保留全部已调研工具，但首版实现按优先级分层，避免一次写十几个 Adapter。

#### Tier A：必须实现

| 来源类别 | 主路径 | 兜底路径 | 用途 |
| --- | --- | --- | --- |
| 通用网页 | 宿主原生 Web Search / 已装 Search MCP | DuckDuckGo HTML | 产品、SaaS、官方文档、讨论 |
| 源码仓库 | GitHub 插件 / MCP / 已认证 CLI | GitHub 公开 REST | 可改造项目、README、许可证、维护信号 |
| 包与依赖 | 对应语言注册中心 | Ecosyste.ms | 可复用包、版本、许可证、维护和采纳信号 |
| Agent 工具 | Official MCP Registry | 普通 Web Search | MCP server 与 Agent connector |
| 一手验证 | 宿主 fetch / GitHub 文件读取 | Jina Reader | 主页、README、官方文档原文 |

首版至少为以下返回形状提供 fixture 和归一化 Profile / Decoder：

- generic host Web Search；
- GitHub repository search；
- npm search；
- Ecosyste.ms lookup；
- Official MCP Registry；
- generic page fetch。

#### Tier B：按指纹触发，首版只记录能力、增加 Profile 或复用通用 fallback

- Hugging Face Hub：模型、数据集、Space；
- arXiv / Crossref / OpenAlex：算法、论文、正式发表与引用；
- crates.io / Maven Central：对应技术栈出现时；
- Hacker News Algolia：需求和采用信号；
- Context7 / grep.app：宿主已经提供时作为验证工具。

### 5.2 真实返回差异

[retrieval-sources.md](../resources/retrieval-sources.md) 中的样例至少包含下面这些形状：

| 工具类别 | 条目位置或格式 | 典型差异 |
| --- | --- | --- |
| 宿主 Web Search / Tavily | `results[]` | `excerpts[]`、`content`、`score`、日期可空 |
| GitHub REST | `items[]` | `html_url`、嵌套 license、stars、topics |
| npm / Ecosyste.ms / Hugging Face | 根数组 | URL 在 `links` 或 `repository_url`，许可证可能在 tags 或数组中 |
| crates.io / Hacker News | `crates[]` / `hits[]` | 采纳信号和主键字段完全不同 |
| Maven / Crossref | `response.docs[]` / `message.items[]` | 时间戳单位、标题数组和日期嵌套不同 |
| MCP Registry | `servers[].server` | 多一层包裹，仓库地址继续嵌套 |
| arXiv | Atom XML | 不是 JSON，作者和 link 为重复节点 |
| DuckDuckGo | HTML | 需要解析选择器和解码跳转 URL |
| Jina / Context7 | 纯文本或 Markdown | 可能没有结构化条目 |
| Wikipedia | 单个对象 | 不是结果列表 |

因此不能要求工具直接返回 `canonicalId`、统一日期、统一 rank 或 telemetry。我们的代码只能要求自己保存调用上下文，并尽最大努力把原始 payload 投影成内部观察记录。

### 5.3 最小输入信封

外部工具的唯一硬要求是“能取得一个返回值”。工具返回值本身始终视为 `unknown`：

```ts
type RetrievalEnvelope = {
  requestId: string;
  providerHint?: string;
  categoryHint?: SourceCategory;
  query?: string;
  receivedAt: string;
} & (
  | { outcome: "success"; payload: unknown }
  | { outcome: "error"; payload?: unknown; error: {
    kind: "timeout" | "rate_limit" | "auth" | "network" | "tool" | "unknown";
    message: string;
    retryAfterMs?: number;
  } }
);
```

其中只有 `payload` 来自工具；`requestId`、`receivedAt`、query 和 provider/category hint 都由调用 Adapter 或 Agent 补充。调用失败时连 `payload` 都可以没有，由我们把异常包装为 error outcome。即使工具只返回一段文本，也能进入整合层。

`RetrievalRequest` 仍是我们发给 Adapter 的内部意图，不假设目标工具支持其中所有参数：

```ts
interface RetrievalRequest {
  requestId: string;
  operation: "search" | "fetch";
  category?: SourceCategory;
  query?: string;
  url?: string;
  preferences: {
    limit?: number;
    cursor?: string;
    timeoutMs: number;
  };
}
```

Adapter 根据已知能力尽量满足 `preferences`。已知不支持的选项记录为 capability gap；无法预先判断的保持 `unknown`，调用后再根据实际返回更新 observed capability，不能伪装成已执行。

### 5.4 Adapter 能力描述

```ts
type CapabilityState = "yes" | "no" | "unknown";

interface AdapterCapabilities {
  operations?: Array<"search" | "fetch">;
  categories?: SourceCategory[];
  formats?: Array<"json" | "xml" | "html" | "text">;
  supports: Partial<Record<
    | "pagination"
    | "limit"
    | "cancellation"
    | "providerScore"
    | "publishedDate"
    | "stableIdentity"
    | "fullText",
    CapabilityState
  >>;
}
```

路由器基于已知能力选 Adapter，不根据工具名字猜能力；信息不足时允许带着 `unknown` 试调用，再用结果纠正。能力描述可以来自：

1. 已知 provider 的静态 Profile；
2. 宿主工具 schema 的运行时探测；
3. 实际返回后的 observed capabilities；
4. 完全未知工具的保守默认值。

声明支持不等于实际成功，未声明也不等于不支持。覆盖账本同时记录 `declared` 和 `observed`，后者以本次调用为准；冲突时保留冲突，不悄悄覆盖历史信息。

### 5.5 RetrievalIngress：泛用整合逻辑

整合层不为每个 provider 手写一整套类，而是按五步处理：

1. **Decode**：识别 JSON、Atom/XML、HTML、Markdown 或普通文本；
2. **Locate**：用数据驱动 Profile 找条目路径，例如根数组、`results[]`、`items[]`、`response.docs[]`、`message.items[]`、`servers[].server`；
3. **Project**：把已知字段路径投影成内部字段；Profile 缺失时再使用保守的字段别名 fallback；
4. **Coerce**：安全解析 URL、数字、ISO 日期、毫秒时间戳、字符串数组和嵌套 license；
5. **Identify**：根据可用信息生成 identity candidates，并记录所有缺失、冲突和推导过程。

Provider Profile 是数据，不是公共 interface：

```ts
interface RetrievalProfile {
  id: string;
  format: "json" | "xml" | "html" | "text";
  itemPaths: string[];
  fields: Partial<Record<NormalizedField, string[]>>;
  transforms?: string[];
}
```

新增一个结构普通的 JSON 工具，应当只需增加 Profile 和 fixture；只有 DuckDuckGo redirect、arXiv Atom、Jina 文本头等无法安全用字段映射表达的情况，才增加专用 Decoder 或 Transform。

通用 fallback 只能尝试高置信度别名，例如：

- title：`title`、`name`、`full_name`；
- URL：`url`、`html_url`、`link`、`repository_url`；
- 摘要：`snippet`、`description`、`summary`、`content`、`extract`；
- 日期：`published_at`、`updated_at`、`publish_date`、`date`；
- 采纳信号：`stars`、`stargazers_count`、`downloads`、`cited_by_count`。

fallback 不做语义大胆猜测。例如不把任意 `id` 当标题、不把任意 number 当分数，也不从工具名字推断来源可信度。无法确定就保留为空并产生 warning。

### 5.6 宽松内部记录

```ts
interface NormalizedRecord {
  recordId: string;
  status: "usable" | "partial" | "unusable";
  kind?: SourceCategory;
  identities: Array<{
    scheme: "purl" | "github" | "doi" | "arxiv" | "mcp" | "url" | "provider";
    value: string;
    confidence: "exact" | "derived";
  }>;
  title?: string;
  url?: string;
  text: {
    snippet?: string;
    description?: string;
    fragments?: string[];
  };
  dates?: {
    publishedAt?: string;
    updatedAt?: string;
  };
  attributes: Record<string, string | number | boolean | string[]>;
  provenance: {
    requestId: string;
    provider?: string;
    providerRank?: number;
    providerScore?: number;
    rawRef: string;
  };
  warnings: NormalizationWarning[];
}

interface NormalizationResult {
  records: NormalizedRecord[];
  rejected: Array<{ rawRef: string; reason: string }>;
  observedCapabilities: AdapterCapabilities["supports"];
  batchWarnings: NormalizationWarning[];
}
```

真正必需的只有管线生成的 `recordId`、`rawRef` 和 provenance requestId。标题、URL、日期、分数、稳定 identity 甚至类别都可以缺失。

`rawRef` 指向单独保存或内存持有的原始 payload；公共 artifact 默认不复制整份 `raw`，避免体积失控。无法形成候选的记录仍进入 `rejected` 或 `unusable`，方便调试新工具。

### 5.7 字段缺失时的降级规则

| 缺失能力或字段 | 降级行为 |
| --- | --- |
| 没有 provider rank | 使用返回顺序；单对象视为 rank 1；纯文本不参与 RRF |
| 没有 provider score | 完全忽略；RRF 不需要原始分数 |
| 没有 title | 尝试已知 name/full_name；仍缺失则只保留为证据片段 |
| 没有 URL | 使用稳定 provider ID；两者都没有则不跨源自动合并 |
| 没有 description/snippet | BM25F 只使用现有字段，并降低 `textCoverage` |
| 没有日期 | freshness 为 `unknown`，不是 0 分或过期 |
| 没有 stars/downloads/citations | 不计算对应采纳信号，不惩罚 |
| 没有稳定 identity | 使用本次运行内 recordId，禁止激进跨源去重 |
| 没有分页信息 | 记录 `pagination=unknown`，不能声称搜索完整 |
| 只有合成答案，没有来源 | 只能作为 query hint，不能作为关键声明证据 |
| 部分条目解析失败 | 保留成功条目，失败项进入 `rejected` |
| 整批形状未知 | 保存 rawRef，返回 `unusable` + `unknown_shape`，允许 Agent 选择文本提取或换工具 |

算法读取的是字段可用性和 observed capabilities，而不是假定所有记录完整。

### 5.8 验收测试

每个 Profile、Decoder 和通用 fallback 必须通过共享测试：

1. [retrieval-sources.md](../resources/retrieval-sources.md) 中 JSON 根数组、嵌套数组、XML、HTML、单对象和文本样例均可进入 `NormalizationResult`；
2. 空结果、字段缺失和新增未知字段不会崩溃；
3. 单条脏数据不会丢弃整批合法结果；
4. 超时、429、401/403、5xx 和解析错误得到稳定分类；
5. 相同 fixture 产生一致的 identity candidates 和 recordId；
6. provider 原始分数不会被误当成跨源全局分数；
7. 未知形状会保留 rawRef 和 warning，而不是编造字段；
8. 日志和错误中不泄露 token、OAuth 信息或完整敏感 payload。

### 5.9 第一阶段交付物

- `schemas/retrieval-envelope.schema.json`
- `schemas/normalization-result.schema.json`
- `src/retrieval/decoders/`：JSON、XML、HTML、text Decoder
- `src/retrieval/profiles/`：Tier A 的数据驱动 Profile
- `src/retrieval/normalize/`：Locate、Project、Coerce、Identify 与 fallback
- `tests/fixtures/retrieval/`：直接来自来源报告的真实脱敏样例
- `tests/retrieval/`：Profile、Decoder、fallback 和 degradation 测试
- 能力矩阵：每个 Adapter 的 declared / observed capabilities

完成条件：

- 至少覆盖根数组、两种嵌套 JSON、XML/HTML 和纯文本五类结构；
- 任意字段缺失不会让整批失败；
- 新增普通 JSON provider 只需 Profile + fixture，不需要修改核心归一化代码；
- 完全未知结构能够可观察地降级，而不是报错终止或伪造统一字段。

## 6. 第二阶段：简单可靠的算法层

### 6.1 管线状态

一次研究只维护一个版本化的 `DecisionArtifact`，避免阶段间靠自然语言传递状态：

```text
fingerprint
searchPlan
retrievalObservations
candidates
evidence
coverage
decision
trace
metrics
```

每个阶段返回新状态，不直接修改调用者持有的对象。artifact 使用 schema 校验，并记录 `schemaVersion`，为后续迁移保留空间。

### 6.2 最小算法集合

首版只实现下面五种机制，不加入额外复杂度。

#### A. QueryPlanner：结构化查询计划

LLM 根据功能指纹生成受 schema 约束的 `SearchPlan`：

- 每个查询必须关联一个目标来源类别和一个待验证假设；
- 查询覆盖问题、工作流、输入输出、技术类别和同义词，而不只搜索产品名；
- 中英文市场未知时允许双语查询；
- 脚本负责 trim、大小写归一化和近重复查询合并；
- 每个来源类别设置查询数、结果数和工具调用上限。

#### B. IdentityResolver：确定性身份归并

按下面的稳定身份优先级聚类：

1. PURL / DOI / arXiv ID / MCP server name；
2. GitHub `owner/repo`；
3. 去 fragment、跟踪参数和默认端口后的规范化 URL；
4. 规范化标题 + 域名的保守后备规则。

Jaccard token 相似度只用于标记“疑似重复”，不能单独自动合并不同身份。无法确认时宁可保留两个候选，避免错误去重。

#### C. CandidateFusion：BM25F + RRF + 轻量多样性

- BM25F 在 `title`、`snippet`、`description`、`language/ecosystem` 上计算与功能指纹的词法匹配；
- 标题和 must-have capability 字段权重最高；
- RRF 使用各 provider 的 `providerRank` 融合不同列表，默认 `k = 60`；
- provider 自带分数仅作为同来源内的 tie-break，不进入跨来源总分；
- 没有 description、日期或采纳信号时仍能完成排序；
- Top-K 最终选择增加词法 MMR：相关性来自归一化后的排序分，冗余度使用 token/字符 3-gram Jaccard，不要求向量；
- 当功能指纹包含多个 must-have capability 时，使用 xQuAD-lite 式贪心覆盖：优先补齐尚未覆盖的能力和来源类别，再选择同一能力下的第二个相似候选。

候选先经过硬性 eligibility gate，再进入排序：

- 与目标运行方式明确不兼容；
- 缺少用户指定的 must-have capability，且没有扩展路径；
- 许可证或部署约束命中 deal-breaker；
- 已归档且没有可接受替代维护来源。

最终保留可解释 feature vector，而不是只保存一个神秘总分：

```ts
{
  lexicalFit,
  reciprocalRank,
  evidenceQuality,
  freshness,
  maintenance,
  penalties,
  finalScore,
  explanations
}
```

初始权重放在版本化配置中，试运行后冻结 benchmark 再调整。首版可以参考 WebVector 的无 embedding 降级、RRF、词法 MMR 和 xQuAD-lite 实现，参考 `bm25s` 的 TypeScript BM25 实现、`pi-web-access` 的 Adapter / fallback 测试方式，但不把这些项目设为必需运行依赖。

#### D. EvidenceScorer：规则化证据质量

证据质量只衡量“这条材料能否支持声明”，不等于候选流行度：

- 一手官方页面、官方仓库实现或注册中心记录优先；
- 搜索摘要只能用于发现，不能单独证明关键能力；
- 两个 provider 返回同一原始页面不算交叉验证；
- 冲突证据不得通过平均分消失，必须显式记录；
- `native`、`unsupported` 等强声明需要一手证据；
- 缺证据统一降级为 `unverified`，不能自动变成 `unsupported`；
- 对最终建议中的数字、日期、版本号和许可证标识执行精确锚点检查：引用证据中找不到时直接标记，不让词法相似度掩盖事实冲突；
- 句子级词法支持检查只作为提示信号，中文使用字符 n-gram，英文使用 token n-gram；它不能替代一手证据等级和引用存在性门禁。

`stars`、下载量和引用量只作为维护或采用信号，不作为功能相似性的证据。

#### E. BudgetController + StopPolicy：有界检索

每轮记录：

- 新增唯一候选数；
- 新增有证据支持的关键能力数；
- 新增一手来源数；
- 工具调用数、失败数、耗时和预计 token；
- 尚未覆盖的必要来源类别和关键声明。

下一轮优先选择“未覆盖关键声明最多、最近成功率可接受”的来源。首版自动补搜最多一轮，查询直接由缺失 must-have、缺失来源类别和冲突声明生成；不实现 bandit、强化学习或无界 PRF 扩展。

满足任一条件即停止：

1. 必要来源类别已覆盖，前 N 个候选的关键能力均有足够证据；
2. 连续两轮没有新增唯一候选或关键证据；
3. 达到查询数、工具调用数、耗时或迭代上限；
4. 所有剩余来源均不可用。

因预算耗尽而停止必须在结果中标记 `budget_exhausted`，不能伪装成“已搜索完整”。

### 6.3 程序化门禁

门禁只做可以确定性检查的事：

1. schema 是否有效；
2. 强声明是否存在合格 evidence ref；
3. evidence ref 是否指向真实检索条目；
4. 能力矩阵是否只使用 `yes / no / unknown`，且没有把未知误写成支持；
5. 覆盖账本是否记录所有触发来源的成功、失败或跳过原因；
6. 决策是否只有一个合法值；
7. trace 是否能解释关键候选的入选、淘汰和补充检索。

门禁失败时返回结构化的 `missingRequirements`，由 Agent 决定补搜或将结论降级。脚本不能自行伪造语义判断。

### 6.4 容错要求

- 单个 Adapter 失败不终止整条管线；
- 所有网络动作均有 timeout、最大重试和退避上限；
- 相同 `requestId` 的重试不重复累计候选；
- 部分结果参与融合，但降低覆盖置信度；
- 非法 LLM artifact 给出可修复错误路径；
- 算法对空列表、单列表、全重复列表和缺字段列表有确定行为；
- 固定输入必须产生固定排序和相同 trace。

### 6.5 第二阶段交付物

- `src/core/`：管线入口与状态迁移
- `src/planning/`：SearchPlan 校验和查询去重
- `src/identity/`：稳定身份与 URL 规范化
- `src/ranking/`：BM25F、RRF、词法 MMR、能力覆盖选择和 feature vector
- `src/evidence/`：证据等级、冲突、引用锚点检查和门禁
- `src/budget/`：预算、边际收益与停止条件
- `src/trace/`：机器可读事件和人类可读解释
- 针对正常、缺字段、失败和冲突路径的单元测试

完成条件：使用固定 fixture 能从 `SearchPlan + NormalizationResult[]` 稳定生成排序候选、证据账本、停止原因和可验证的 `DecisionArtifact`；缺失字段只关闭对应特征，不阻断其余算法。

### 6.6 WebVector 借鉴边界

[WebVector](https://github.com/rthomas24/web-vector) 与本项目都采用“检索后再做确定性处理”的路线，但目标不同：它把网页抓取并切块后返回可引用 passage；本项目要把 Web、GitHub、包注册中心、MCP Registry 等异构结果归并为产品候选和 Build 决策证据。因此只借机制和测试方法，不复制整条管线。

| WebVector 机制 | 本项目处理 | 原因 |
| --- | --- | --- |
| 无 embedding 时完整回退到 BM25 | 直接采用该原则 | 保持低依赖，embedding 继续是可选 RankerAdapter |
| weighted RRF | 采用简化实现 | 不混合不同 provider 的原始分数尺度 |
| lexical MMR / shingle Jaccard | 改造成候选多样性选择 | 避免 Top-K 被同类项目和镜像重复占满 |
| xQuAD-lite aspect coverage | 把 related query aspect 换成 must-have capability / 来源类别 | 更符合 Build 决策，而不是 passage 问答 |
| evidence sufficiency + 最多一次 auto-retry | 改成能力覆盖、主来源覆盖、冲突和新增候选信号 | WebVector 的 query-term coverage 阈值不能直接代表产品能力已验证 |
| 引用 verifier 与数字/日期检查 | 只采用确定性锚点检查和语言适配后的相似度提示 | 避免把英文阈值直接套到中英文混合证据 |
| recording fixture + golden baseline | 采用其离线回归模式 | 排序变化必须有可复现证据，而不是凭样例观感调权重 |
| provider conformance helpers | 改成 Ingress conformance | 我们接收宿主任意 `unknown payload`，不能要求第三方工具返回统一 `url/title/rank` |
| 全文抓取、HTML/PDF 解析、chunk、向量库、reranker | 不纳入核心 | 与现有宿主 fetch 重叠，并会显著扩大依赖、安全和维护面 |

参考实现定位：

- [ARCHITECTURE.md](https://github.com/rthomas24/web-vector/blob/main/docs/ARCHITECTURE.md)：五阶段管线、单页失败隔离、可选依赖和依赖注入；
- [fusion.ts](https://github.com/rthomas24/web-vector/blob/main/packages/core/src/retrieval/fusion.ts)：RRF、MMR、Jaccard 去重、来源多样化和 xQuAD-lite；
- [evidence.ts](https://github.com/rthomas24/web-vector/blob/main/packages/core/src/retrieval/evidence.ts)：确定性 evidence gate 与补搜建议；
- [verify.ts](https://github.com/rthomas24/web-vector/blob/main/packages/core/src/retrieval/verify.ts)：引用支持、ROUGE-L 和数字日期检查；
- [eval/README.md](https://github.com/rthomas24/web-vector/blob/main/eval/README.md)：录制 fixture、golden case、回归阈值和离线指标。

实现时优先依据论文或通用算法重新实现，并在源码注释和文档中注明灵感来源。若直接复制 MIT 代码片段，则必须保留其版权与许可证声明，同时在简历和 README 中清楚区分复用部分与本项目独有部分。

## 7. 第三阶段：简单但可信的 benchmark

benchmark 分成两层，分别回答“算法是否正确”和“插件是否真的改善 Agent 搜索”。

### 7.1 离线算法 benchmark

使用冻结的检索 fixture，不发网络请求、不调用模型，保证每次可重复。

参考 WebVector 的 golden baseline 做法：每次评测保存版本化结果；pilot 后冻结每项指标允许的最大回退幅度，超过阈值时 CI 失败。阈值由本项目数据分布确定，不直接照搬 WebVector 的 `0.02`。

覆盖案例：

- 相同项目从 GitHub、npm、Ecosyste.ms 返回；
- 不同项目标题相似但功能不同；
- provider 分数尺度完全不同；
- 单一来源或同类候选试图占满 Top-K；
- 多个 must-have capability 需要由不同候选或证据覆盖；
- URL 带跟踪参数、重定向或不同 scheme；
- 缺日期、缺描述、缺采纳信号；
- 单来源超时、限流或只返回部分结果；
- 官方证据与二手描述冲突；
- 所有候选都不满足 must-have capability。

指标：

- normalization success rate；
- duplicate precision / recall；
- candidate Recall@5、MRR 或 nDCG@5；
- evidence ref 完整率；
- 无据强声明拦截率；
- 固定输入确定性；
- 错误 fixture 的 graceful-degradation 通过率。

### 7.2 真实 Agent 对照

建立 12 个实际 Build 决策任务，覆盖：

- npm / CLI 工具；
- MCP / Agent connector；
- 浏览器或 VS Code 插件；
- SaaS / 商业产品；
- 开源可改造项目；
- 模型或数据集；
- 算法或论文先例；
- 中英文双语市场。

每题人工维护：

- 3–8 个可接受候选；
- 必须命中的来源类别；
- must-have capability；
- 关键一手来源；
- 不应被当作匹配项的 hard negatives。

对照方式：

| 组别 | 配置 |
| --- | --- |
| Baseline | 同一个 Agent、同一个模型、同一组检索工具，提示“使用 Web Search 调研并建议是否建设” |
| Pipeline | 同一个 Agent、同一个模型、同一组检索工具和调用预算，启用 Search Before Build 管线 |

公平性约束：

- 固定模型版本、工具集合、最大调用数和超时；
- 不让 Pipeline 获得 Baseline 无法访问的数据源；
- 保存完整查询、工具返回、trace、token、耗时和最终答案；
- smoke 模式每题运行一次，release benchmark 每题运行三次并报告中位数；
- 不使用本项目生成的自评分作为唯一成功指标。

端到端主要指标：

1. Recall@5；
2. 前五名唯一且相关候选比例；
3. 一手来源比例；
4. 关键声明 evidence ref 完整率；
5. unsupported claim rate；
6. 触发来源覆盖率；
7. 工具调用数、token、耗时；
8. 三次运行的候选与建议一致性。

Build / Adapt / Use existing / Stop 的“决策准确率”只作为人工分析项，不作为首版唯一发布门槛，因为很多真实问题没有客观唯一答案。

### 7.3 防止 benchmark 失真

1. 先用 3 个 pilot case 验证脚本和指标；
2. 冻结 12 个正式案例、gold candidates 和 hard negatives；
3. 冻结后再调整排序权重与停止阈值；
4. 同时公开绝对指标、相对变化和失败案例；
5. 不只展示平均值，至少列出每题结果；
6. 时间敏感事实记录评测日期和来源快照；
7. benchmark 脚本不得依赖私有账户数据。

第一版不预先编造效果门槛。当前 3 个 pilot 只验证 runner 与指标计算，不作为产品质量声明。后续完成普通 Web Search 基线后，再根据实际分布冻结门槛并写入版本控制；一旦冻结，不得为通过测试临时下调。

### 7.4 第三阶段交付物

当前 smoke 骨架：

- `bench/cases/*.json`
- `bench/run-offline.mjs`
- `tests/fixtures/retrieval/`
- `bench/RESULTS.md` 中的范围声明
- README 中的复现实验命令与非效果声明

正式评测阶段再增加：

- `bench/baseline-prompt.md`
- `bench/run-live.mjs`
- `bench/results/<version>.json`
- 自动生成的量化对比表、成本与失败样例

当前完成条件：其他人能从仓库复现 smoke 结果，且 README 明确它不代表相对普通 Web Search 的效果提升。正式评测阶段的完成条件仍是：有相同模型和工具权限的人能运行成对 benchmark，报告同时展示提升、成本和失败样例。

## 8. 第四阶段：接回技能、本地验证与提交

### 8.1 技能集成

- `assess` 和 `compare` 保留现有对话与最终决策职责；
- 把来源路由、覆盖账本、证据包和稳定枚举迁移到版本化 artifact；
- Skill 负责要求 Agent 调用管线，不再重复描述内部排序细节；
- 现有报告 schema 继续保持权威；Skill 只把已经核验的候选证据翻译进去，不把内核的词法命中直接交给查看器；
- 保留普通研究只读、显式授权后才能安装 GitHub MCP 的现有约束；
- 旧宿主无法运行新内核时明确降级到 legacy prompt-only 模式，并在报告中标记。

### 8.2 工程与依赖

- 核心使用 TypeScript，提交编译后的 Node.js ESM，保证已安装插件无需现场构建；
- 第一版保持零运行时依赖；TypeScript 和 Node 类型只作为开发依赖；
- BM25F、RRF、URL/PURL/DOI 规范化优先内置，避免依赖较新的排序包；
- JSON Schema 作为可读契约，CLI 入口只做主路径所需的最小边界校验，暂不引入运行时 schema 库；
- 使用 Node 内置 test runner 或现有 Python validator，避免再引入测试框架；
- 发布物中只包含运行所需的编译结果、schema、技能和报告资源。

### 8.3 本地提交前验证

```bash
claude plugin validate --strict .
python tests/validate_plugin.py
node --check scripts/setup-github-mcp.mjs
node --check scripts/render-report.mjs
npm test
npm run benchmark:offline
npm pack --dry-run
```

同时增加：

- artifact schema 向后兼容测试；
- 所有 Tier A Profile / Decoder 的真实 fixture、未知字段和降级测试；
- 排序确定性和容错测试；
- Skill 到现有报告 schema 的转换约束；
- Codex 与 Claude Code 各一次交互 smoke test；
- 正式评测阶段再补 release benchmark 结果和版本信息校验。

### 8.4 发布材料

- README 从“高级 Skill”叙述升级为“可验证的 Build 决策检索内核”；
- 提供一张真实 trace 示例，展示查询、来源、融合、证据和停止原因；
- 提供普通 Web Search 与 Pipeline 的 benchmark 对比；
- 清楚区分已发布、实验性、计划中和下一版本能力；
- CHANGELOG 说明新 artifact、算法、降级路径和兼容性；
- 未来发布稳定版本前先发布 prerelease，验证现有安装流程与报告查看器。

本轮完成条件：全量本地验证通过、smoke benchmark 可复现、README 声明均有仓库内实现支持，并形成可审查的本地 commits。版本同步、tag、push、prerelease 和 npm 发布全部留到正式评测完成之后。

## 9. 下一版本：多平台 Adapter

本版本只冻结平台 Adapter seam、最小输入信封和渐进归一化入口，不实现多平台分发。

下一版本优先级：

1. OpenCode：TypeScript/npm 插件，复用核心成本最低；
2. DeepSeek Harness：TypeScript/Cordis 插件，但 developer preview 期间需要兼容性测试；
3. Pi：作为第三个 Adapter 验证 seam 的通用性；
4. VS Code / Copilot：先考虑 MCP 或 Language Model Tool，Marketplace UI 最后投入。

进入下一版本前必须满足：

- 核心不读取 Codex / Claude 专有全局状态；
- 平台 Adapter 只负责工具发现、调用、用户确认和包装原始返回，不在其中复制 provider 字段映射；
- 平台 Adapter 不复制 BM25F、RRF、证据门禁或停止逻辑；
- 至少两个宿主的原始返回能通过同一个 RetrievalIngress 进入核心，且不要求它们提供相同字段；
- benchmark 已能检测新 Adapter 是否造成质量回退。

## 10. 建议目录结构

```text
schemas/
  retrieval-envelope.schema.json
  normalization-result.schema.json
  decision-artifact.schema.json
src/
  core/
  retrieval/
    adapters/
    decoders/
    profiles/
    normalize/
  planning/
  identity/
  ranking/
  evidence/
  budget/
  trace/
bench/
  cases/
  fixtures/
  results/
tests/
  retrieval/
  ranking/
  evidence/
  integration/
skills/
references/
scripts/
```

## 11. 实现顺序与检查点

### Milestone 1：Retrieval Ingress

- 冻结 Tier A 来源；
- 定义最小 `RetrievalEnvelope`、宽松 `NormalizationResult` 和 TypeScript 类型；
- 用 generic Web 与 GitHub 两种差异明显的真实 fixture 实现首批 Profile；
- 建立 Decoder、Profile、fallback 和 unknown-shape 共享测试。

检查点：两个真实返回结构经同一入口进入核心；它们可以产出不同字段集合，但错误、缺失和部分结果都有稳定、可观察的行为。

### Milestone 2：Normalization and Identity

- URL、PURL、仓库、DOI、arXiv 与 MCP identity；
- npm、Ecosyste.ms、MCP Registry Profile，以及必要的专用 Transform；
- 去重与疑似重复标记。

检查点：离线 fixture 的归一化与去重达到人工标注预期。

### Milestone 3：Ranking and Evidence

- SearchPlan 校验；
- BM25F、RRF、词法 MMR、能力覆盖选择和 feature vector；
- EvidenceScorer、冲突记录、数字/日期锚点和强声明门禁；
- trace 解释。

检查点：固定输入排序确定，所有强声明可追溯。

### Milestone 4：Budget and Stop

- 覆盖账本；
- 查询、调用、时间和迭代预算；
- 有界补搜与停止原因；
- 失败降级。

检查点：超时、限流、空结果和连续无增益都能结束，不出现无限循环。

### Milestone 5：Benchmark

- pilot；
- 冻结 12 个案例；
- 离线与 live runner；
- 结果报告和发布门槛。

检查点：对照结果可复现，提升与成本同时可见。

### Milestone 6：Integration and Local Validation

- 接回 assess / compare；
- 保持 viewer schema 稳定，更新 README 和本地安装产物；
- 全量验证并创建本地 commits；正式评测后再进入 prerelease 与稳定发布。

检查点：仓库声明与实现、测试、benchmark 结果一致。

## 12. 明确不做

- 不建设通用搜索引擎或大型 provider 聚合器；
- 不要求 embedding 模型、向量数据库或长期索引；
- 不把 provider 原始分数直接混合；
- 不把两个 provider 返回的同一页面当成两份独立证据；
- 不用 Stars、下载量或搜索摘要证明功能相似；
- 不让 LLM 自评分代替外部 benchmark；
- 不在本版本实现 DeepSeek Harness、OpenCode、Pi 或 VS Code Marketplace Adapter；
- 不为了展示“算法复杂”而引入学习排序、bandit、强化学习或重型 Agent 框架。
