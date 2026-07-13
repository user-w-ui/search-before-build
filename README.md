<div align="center">

<img src="./assets/mascot.png" alt="Search Before Build mascot" width="145">

# Search Before Build

**在开始 vibe coding 之前，先确认这东西真的值得做。**

一个对新手友好的 Codex / Claude Code 的轻量插件：帮你说清问题、判断开发必要性，并认真寻找已经存在的产品、开源项目和可复用组件。

[![npm](https://img.shields.io/npm/v/@superq/search-before-build?label=npm)](https://www.npmjs.com/package/@superq/search-before-build)
![Codex](https://img.shields.io/badge/Codex-plugin-10a37f)
![Claude Code](https://img.shields.io/badge/Claude_Code-plugin-d97706)
[![License](https://img.shields.io/badge/license-MIT-059669)](./LICENSE)

</div>

---

## 为什么做这个？

Vibe coding 让“有个想法”到“开始写代码”的距离变得非常短。这很爽，但也容易：为一次性问题搭一整套系统、写到一半才发现已有成熟产品、重复造轮子，最后花掉大量 token 得到一个自己也不会用的项目。

`search-before-build` 不打击想法，只是让你开工前多停几分钟，回答三个问题：

1. **你真正想解决的是什么？**
2. **这件事真的需要开发吗？**
3. **有没有现成方案可以直接用或拿来改？**

## 它怎么工作？

```text
一个模糊的想法
      │
      ▼
说清真实问题 ──→ 判断是否值得开发 ──→ 检索并验证现有方案
                                              │
                                              ▼
                         Build / Adapt / Use existing / Stop
```

最终给出一个明确但可由你覆盖的建议：

| 建议 | 含义 |
| --- | --- |
| **Build** | 需求真实，现有方案确实没覆盖关键缺口 |
| **Adapt** | 已有接近的方案，改造比从头开发更合适 |
| **Use existing** | 成熟方案已能解决主要问题，直接用更划算 |
| **Stop** | 需求证据不足，或开发成本明显高于收益 |

## 三个技能

| 技能 | 适用场景 | 用法 |
| --- | --- | --- |
| `search-before-build-assess` | 只有想法、尚未开始 | 先读已有信息，仅在关键内容缺失时追问（每次一问，最多五个），再检索并给出建议 |
| `search-before-build-compare` | 已有计划书、原型或仓库 | 从现有材料提取能力，直接寻找相似竞品和可复用方案 |
| `search-before-build-research` | 内部步骤 | 由前两者调用的只读检索，不在命令菜单展示 |

```text
/search-before-build:search-before-build-assess 我想做一个自动整理收藏内容的工具
/search-before-build:search-before-build-compare ./docs/plan.md
```

## 不只是搜索 GitHub

先看要找什么，再决定去哪里找。插件从需求中提取功能指纹，只选真正相关的来源，不会每次扫遍所有平台。

| 要找的东西 | 优先来源 |
| --- | --- |
| 开源仓库、源码或可复用实现 | GitHub |
| JS / Node.js 依赖、CLI 或插件 | npm |
| 跨生态软件包信息与维护信号 | Ecosyste.ms Packages |
| Agent 可用的 MCP 工具或连接器 | Official MCP Registry |
| JVM（Java / Kotlin / Android）依赖 | Maven Central |
| Rust crate | crates.io |
| 模型、数据集或可复用 AI 应用 | Hugging Face Hub |
| 算法、论文或学术先例 | arXiv |

SaaS、商业产品、应用商店等不在目录中的方案，用网络搜索和官方页面补充。目标市场不明确时中英文同时检索。Stars、下载量只辅助判断成熟度，不代替功能匹配，也不会仅因名称相似就认定为竞品。

### 可选的 GitHub 深度检索

有 GitHub MCP、Connector 或等价工具时直接复用；没有也能通过公开 API 和网页搜索正常运行。经用户同意可自动安装 GitHub 官方 MCP：

```text
启用 GitHub 深度检索
```

安装器会下载并校验官方二进制，以 `repos` 工具集和 `--read-only` 模式运行，首次连接用浏览器 OAuth（无需 PAT、Docker 或额外包）。需要本机 Node.js 18+，Windows / macOS / Linux 通用；基础检索本身不依赖 Node。拒绝或授权失败会自动回退。

## 竞品报告

进入检索阶段后，为每个重点竞品生成独立报告（同一竞品再次分析时更新原文件，不产生时间戳副本）：

```text
docs/search-before-build/<当前项目>/<竞品>.md
```

报告只关注竞品对照，包含：简介、与当前项目的对比表、值得关注的设计、可复用启发、一句话总结和资料来源。

## 安装与使用

**Codex（一条命令）**

```bash
npx @superq/search-before-build install
```

完成后新开一个 Codex 任务：

```text
$search-before-build-assess <你的想法、计划或文件路径>
$search-before-build-compare <计划书、原型或仓库路径>
```

**Codex（手动）**

```bash
codex plugin marketplace add user-w-ui/search-before-build --ref main
codex plugin add search-before-build@search-before-build
```

**Claude Code（marketplace）**

```text
/plugin marketplace add user-w-ui/search-before-build
/plugin install search-before-build@search-before-build
```

安装后即可调用 `/search-before-build:search-before-build-assess` 与 `...-compare`；用 `/plugin marketplace update search-before-build` 更新。

**Claude Code（本地加载）**

```bash
claude --plugin-dir /path/to/search-before-build
```

**验证插件**

```bash
claude plugin validate --strict .
python tests/validate_plugin.py
```

## 参与贡献

欢迎提交 Issue 或 Pull Request，尤其欢迎：常被漏掉的检索平台、名称相似但功能不同的误匹配案例、能明显省时或省 token 的复用案例，以及对非专业用户仍太难理解的表达。

---

<div align="center">

### 三思而后行。

</div>
