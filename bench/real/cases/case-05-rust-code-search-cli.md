# Case 05 · Rust 极速本地代码/模糊搜索 CLI（assess）

| 项 | 值 |
| --- | --- |
| 技能（B 臂） | `search-before-build-assess` |
| 模拟用户语言 | English |
| 补充材料 | 无 |
| 对比焦点 | crates.io 路由、新兴小项目发现面、成熟度信号的角色 |

## 背景与考察点

用户想做"Rust 写的极速本地代码搜索 CLI，支持模糊/结构化搜索"。ripgrep（66k+ stars，持续维护）、ast-grep（结构化搜索）已占据该空间，2026 年还有 hypergrep 等新项目出现。适合检验：

1. B 臂指纹是否触发 crates.io（强触发信号：Rust 实现或依赖）；A 臂默认搜索会不会去 crate 注册中心；
2. GitHub 上的维护证据（commit 活跃度）是否被纳入判断；
3. stars/downloads 是否只作 tie-breaker，功能对比（regex / fuzzy / 结构化 / gitignore）是否为主依据；
4. 发现面：新兴小项目（hypergrep 等）能否被发现——检验检索是否够新、够宽，而不是只吐老面孔；
5. 建议方向：复用 ripgrep/ast-grep 生态做薄封装（Adapt），还是无视现有生态直接 Build。

## 用户 prompt（两臂原样输入）

```text
I want to build a blazing-fast local code search CLI in Rust. It should do
regex and fuzzy matching over large codebases, respect .gitignore, and ideally
support structural search that understands the code, not just text. Personal
tool first, maybe open source later. Should I build it?
```

## 澄清脚本（两臂通用，仅回答被问到的问题）

1. 最核心能力/优先级 → `Fast regex search over big repos is the must-have. Fuzzy and structural search are nice-to-haves.`
2. 为什么现有工具不够 → `I use ripgrep, but it doesn't do fuzzy or structural matching out of the box, so I was planning to write those layers myself.`
3. 形态/分发 → `A single installable CLI on my machine. If I open source it, binaries for Windows, macOS, and Linux.`
4. 检索前确认（B 臂）→ `Confirmed.`

## B 臂路由观察表

| 来源 | 强度 | 触发依据 |
| --- | --- | --- |
| crates.io | must | 指纹含 Rust 实现（ripgrep、ast-grep 等 crate 元数据、下载量） |
| GitHub | must | 仓库级维护证据（BurntSushi/ripgrep、ast-grep/ast-grep 等） |
| web（宿主/DDG 兜底） | must | 发现面（替代品文章、新兴工具）与主页核验 |
| Ecosyste.ms | 可选 | 跨生态信号（ripgrep/ast-grep 的 npm、py 绑定） |

## 两臂记录要点

- [ ] 候选清单：每臂最终提到的工具/项目（名称 + 链接 + 定性），标出重合项
- [ ] 来源覆盖：A 臂触达平台；B 臂是否查询 crates.io、查询词与命中情况
- [ ] 发现面：两臂是否提及 hypergrep 等 2026 年新项目；各自"新项目"来自什么来源
- [ ] 功能对比的证据：regex/fuzzy/结构化能力各自的来源支撑；stars/downloads 在两臂论证中的角色
- [ ] B 臂内核：kernel-input/output 是否生成；crate 缺字段（如 license 为 null）时是否只降 confidence 不误判
- [ ] 两臂最终建议与理由链原文摘录

## 对比焦点

1. crates.io 这类专门注册中心：A 臂是否触达；B 臂是否按指纹规则触达；
2. 发现面新旧：哪一臂能找到更新的、更小众的项目；
3. 建议深度：哪一臂能把"在 ripgrep/ast-grep 上做薄封装"讲成可执行路径，而非简单说"别造轮子"；
4. 成熟度信号使用是否克制（只做 tie-breaker）。
