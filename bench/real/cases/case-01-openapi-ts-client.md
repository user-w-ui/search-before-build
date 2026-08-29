# Case 01 · OpenAPI 规范 → TypeScript 客户端生成器（compare，已有计划书）

| 项 | 值 |
| --- | --- |
| 技能（B 臂） | `search-before-build-compare` |
| 模拟用户语言 | English |
| 补充材料 | [`../material/case-01-plan.md`](../material/case-01-plan.md)（复制进工作目录并命名为 `plan.md`） |
| 对比焦点 | 跨生态发现（JVM 系工具）、包注册中心路由、候选重合度 |

## 背景与考察点

用户已有一份半成品计划书（Node.js CLI，把 OpenAPI 描述生成类型安全的 TS 客户端）。该领域成熟度极高，且候选横跨生态：npm 系（openapi-typescript、orval、kubb 等）、JVM 系（openapi-generator，Maven Central 分发）、商业 SaaS（Fern、Speakeasy）。适合检验：

1. B 臂（compare）是否从材料提取基线，而非重复询问材料里已有的东西；
2. B 臂路由是否覆盖 GitHub / npm / web，且能否跨生态发现 JVM 系的 openapi-generator 并把"要装 Java 运行时"作为采用成本；A 臂默认搜索能发现到哪一层；
3. 同一项目跨来源出现时（openapi-generator 同时见于 GitHub/Maven/web），B 臂内核去重是否生效；
4. 两臂给出的"可直接采用方案"哪个更具体、更贴合材料的离线约束。

## 用户 prompt（两臂原样输入）

```text
I have a plan for a CLI tool that generates typed TypeScript API clients from
OpenAPI specs. I'd like you to compare my plan against what already exists
before I spend more time on it. Here is the plan: ./plan.md
```

（B 臂调用方式：`/search-before-build:search-before-build-compare ./plan.md`；
A 臂直接粘贴上述文本，不带任何附加引导。）

## 澄清脚本（两臂通用，仅回答被问到的问题）

1. 对齐选择（compare 必问一次）→ **"Align the real need first"**；A 臂若直接开查，记录该行为即可。
2. 谁在用/什么场景 → `Our company runs dozens of REST microservices. Frontend and backend teams hand-write API clients today, and they drift from the specs.`
3. 最核心能力 → `Accurate TypeScript types for requests, responses, and query params, generated directly from the OpenAPI documents.`
4. 形式与约束 → `A CLI we can run in CI and locally. It must work offline in our private network. We would much rather adopt an existing tool than build one.`
5. 检索前确认（B 臂）→ `Confirmed.`

## B 臂路由观察表

| 来源 | 强度 | 触发依据 |
| --- | --- | --- |
| GitHub | must | 开源实现/仓库级证据（OpenAPITools/openapi-generator、orval、kubb、drwpow/openapi-typescript、fern-api/fern） |
| npm | must | 指纹含 Node.js/CLI（openapi-typescript、orval、kubb 均为 npm 包） |
| web（宿主/DDG 兜底） | must | 商业产品（Fern、Speakeasy）与产品主页核验 |
| Maven Central | 可选 | openapi-generator 的 JVM 分发坐标 |
| Ecosyste.ms | 可选 | 跨生态身份与维护信号 |

## 两臂记录要点

- [ ] 候选清单：每臂最终提到的候选（名称 + 链接 + 该臂给的定性/理由），标出两臂重合项
- [ ] 来源覆盖：A 臂实际用到的检索工具/平台；B 臂 search coverage ledger 的实际内容
- [ ] 是否发现 openapi-generator 及 Java 运行时成本；是否发现 openapi-typescript / orval / kubb
- [ ] 离线约束是否体现在候选筛选里（Fern/Speakeasy 这类 SaaS 是否被正确归为不适配）
- [ ] B 臂内核：kernel-input/output 是否生成；openapi-generator 跨来源是否被合并为一个候选（observationCount）
- [ ] 两臂最终建议与理由链原文摘录

## 对比焦点

1. 两臂候选清单的重合度与各自独有候选分别是什么；
2. 哪一臂更完整地覆盖了"npm 轻量方案 + JVM 重型方案 + 商业 SaaS"三类形态；
3. 建议的可执行性：是否点名具体可 adopt/adapt 的项目，而非泛泛而谈"有现成的"；
4. B 臂的去重与路由是否符合其规则；A 臂检索主动性如何。
