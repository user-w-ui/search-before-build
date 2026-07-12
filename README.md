<div align="center">

# Should I Build?

**在开始 vibe coding 之前，先确认这东西真的值得做。**

一个面向 Claude Code 的轻量技能包：帮你说清问题、冷静判断开发必要性，并认真寻找已经存在的产品、开源项目和可复用组件。

![Version](https://img.shields.io/badge/version-0.1.0-4f46e5)
![Claude Code](https://img.shields.io/badge/Claude_Code-plugin-d97706)
![Status](https://img.shields.io/badge/status-early_preview-059669)

</div>

---

## 为什么做这个？

Vibe coding 让“有个想法”到“开始写代码”的距离变得非常短。

这当然很爽，但也很容易发生：

- 还没想清楚谁会用，就先搭了半天框架；
- 为一个只出现过一次的问题，做了一整套系统；
- 写到一半才发现，已经有成熟产品；
- 重新实现了现成的库、插件或模型；
- 花掉大量 token，最后得到一个自己也不会继续用的项目。

`should-i-build` 不负责打击想法。它只是让你在开工前多停几分钟，用更少的成本回答三个问题：

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

最终会给出一个明确但可由你覆盖的建议：

| 建议 | 含义 |
| --- | --- |
| **Build** | 需求真实，而且现有方案确实没有覆盖关键缺口 |
| **Adapt** | 已有接近的方案，改造比从头开发更合适 |
| **Use existing** | 成熟方案已经能解决主要问题，直接使用更划算 |
| **Stop** | 需求证据不足，或开发成本明显高于实际收益 |

## 三个技能

### `/should-i-build:should-i-build-assess`

适合只有想法、尚未正式开始的项目。

它会先读取你已经提供的信息，只在关键内容缺失时追问。每次只问一个容易回答的问题，最多五个，不会把对话变成产品经理面试。

```text
/should-i-build:should-i-build-assess 我想做一个帮我自动整理收藏内容的工具
```

完整流程：

```text
澄清想法 → 检查必要性 → 搜索现有方案 → 给出建议 → 保存竞品报告
```

### `/should-i-build:should-i-build-compare`

适合已经有计划书、原型、仓库或半成品的项目。

它会从当前材料中提取已经实现和计划实现的能力，直接寻找真正相似的竞品和可复用方案，不会重新追问“这个需求是否存在”。

```text
/should-i-build:should-i-build-compare ./docs/plan.md
```

也可以直接传入当前仓库、产品说明或原型路径。

### `should-i-build-research`（内部步骤）

内部检索技能，由 `assess` 和 `compare` 调用，不在命令菜单中展示。

它负责：

- 根据实际功能而不是项目名称寻找候选；
- 区分成品、可改造项目和可复用组件；
- 核查官方文档、仓库、版本、许可证或价格；
- 标记原生支持、部分支持、可扩展、不支持和尚未验证；
- 只返回研究结果，不直接修改文件。

## 不只是搜索 GitHub

不同项目需要去不同地方找答案。插件会根据需求和当前可用工具，自适应选择检索渠道：

- GitHub 和其他代码托管平台；
- Hugging Face、ModelScope 等模型与数据平台；
- npm、PyPI、crates.io 等包管理平台；
- SaaS 官网、应用商店和插件市场；
- 自动化模板市场与产品发现平台。

中文项目或目标市场不明确时，会同时使用中文和英文检索。

检索结果不会因为名称相似就被认定为竞品。关键候选需要尽可能通过官方页面、文档、发布记录、清单文件或代表性实现进行验证。Stars 和下载量只作为成熟度参考，不代替功能匹配。

### 可选的 GitHub 深度检索

如果当前 Agent 已有 GitHub MCP、Connector 或等价工具，插件会直接复用。没有时仍可通过公开 API 和网页搜索正常运行，并可在用户同意后自动安装 GitHub 官方 MCP：

```text
启用 GitHub 深度检索
```

安装器会识别系统架构、下载并校验官方二进制、写入 Claude Code 或 Codex MCP 配置，并以 `repos` 工具集和 `--read-only` 模式运行。首次连接使用 GitHub 浏览器 OAuth，不需要 PAT、Docker、npm 包或 Python 包。拒绝安装或授权失败时会自动回退，不影响基础使用。

## 竞品报告

运行 `assess` 或 `compare` 并进入检索阶段后，会为每个重点竞品生成独立报告：

```text
docs/should-i-build/<当前项目>/<竞品>.md
```

报告只关注竞品对照，不混入前面的需求追问和必要性判断：

```markdown
# <竞品名称>

官方地址：[<项目或产品名称>](<URL>)

## 简介

## 与 <当前项目名称> 的对比

| 维度 | <竞品名称> | <当前项目名称> |
| --- | --- | --- |
| 核心定位 | ... | ... |
| 核心工作流 | ... | ... |
| 最重要的功能 | ... | ... |
| 主要优势 | ... | ... |
| 主要局限 | ... | ... |

## 值得 <当前项目名称> 关注的设计

## 可复用或参考的启发

## 一句话总结

## 资料来源
```

同一个竞品再次分析时会更新原报告，不会不断产生带时间戳的副本。

## 安装与使用

### 本地加载

克隆或下载本项目后，在 Claude Code 中加载插件目录：

```powershell
claude --plugin-dir D:\path\to\should-i-build
```

macOS 或 Linux：

```bash
claude --plugin-dir /path/to/should-i-build
```

进入 Claude Code 后即可手动调用：

```text
/should-i-build:should-i-build-assess <你的想法、计划或文件路径>
/should-i-build:should-i-build-compare <计划书、原型或仓库路径>
```

### Codex

仓库根目录也包含 `.codex-plugin/plugin.json`，并复用同一套 `skills/` 与 `references/`。将本仓库加入一个 Codex marketplace 后，用户可安装：

```bash
codex plugin add should-i-build@<marketplace-name>
```

安装后请新开一个 Codex 任务，再明确请求 `$should-i-build-assess` 或 `$should-i-build-compare`。`should-i-build-research` 是两个主工作流调用的只读研究步骤，不建议直接使用。

### 验证插件

```bash
claude plugin validate --strict .
python tests/validate_plugin.py
```


## 项目结构

```text
should-i-build/
├── .claude-plugin/
│   └── plugin.json
├── .codex-plugin/
│   └── plugin.json
├── skills/
│   ├── should-i-build-assess/SKILL.md
│   ├── should-i-build-compare/SKILL.md
│   └── should-i-build-research/SKILL.md
├── references/
│   ├── conversation-and-decision.md
│   ├── github-retrieval.md
│   ├── research-method.md
│   └── report-template.md
├── scripts/
│   └── setup-github-mcp.mjs
└── tests/
    └── validate_plugin.py
```

## Roadmap

- [ ] 加强 GitHub、Hugging Face 和 ModelScope 的平台级深度检索
- [ ] 增加可选 Skill、插件和 MCP 能力探测与路由
- [ ] 建立更多真实项目的检索与误匹配测试集
- [ ] 优化大型仓库、计划书和半成品的能力基线提取
- [ ] 兼容更多遵循 Agent Skills 标准的开发代理

## 参与贡献

欢迎提交 Issue 或 Pull Request，尤其欢迎这些反馈：

- 某类项目经常漏掉的重要检索平台；
- 名称看起来相似、实际功能完全不同的误匹配案例；
- 能明显节省开发时间或 token 的复用案例；
- 对非专业用户仍然太难理解的问题或表达。

---

<div align="center">

**先确认值得做，再开始做。**

</div>
