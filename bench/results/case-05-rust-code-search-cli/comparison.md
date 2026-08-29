# Case 05 · A/B 对比（Rust 极速本地代码/模糊搜索 CLI）

> **B 臂为修复前运行**（内核 v1，本 case 当时内核表现已正常；若需与其余 4 个 case 内核版本对齐可申请重跑）。
> 共同环境：glm-5.2，无 GitHub MCP/gh。

| 维度 | A 臂（baseline，~14.5 min） | B 臂（plugin，v1 内核） |
| --- | --- | --- |
| 建议 | don't build yet：先用 rg + ast-grep，试用一晚 probe，摩擦持续再写胶水 CLI | **Adapt**：ripgrep 库 crate（ignore + grep-searcher/grep-regex）做底座，叠 tree-sitter 结构化（仿 ast-grep）+ nucleo-matcher 模糊 |
| 检索主动性 | 主动且深：19 WebSearch + 9 WebFetch（probe 的 releases/issues 成熟度核验） | 澄清 3 问 → GitHub REST + crates.io×3（下载量核验）+ 一手文档 |
| 来源覆盖 | GitHub 页面 + github topics 发现 probe；**未触达 crates.io** | **crates.io 触达**；GitHub；未触达 Ecosyste.ms |
| 候选 | ripgrep、ast-grep、ugrep、nucleo-matcher、semgrep、fzf/skim、**probe（独有发现）** | ripgrep、ast-grep、nucleo-matcher、probe、comby |
| 发现面 | hypergrep（2026-03 新项目）未发现 | hypergrep 未发现（共同短板） |
| 内核 | 无（预期） | 7 请求 0 失败，6 候选，重复候选合并生效 |

**对比焦点结论**：建议方向一致且都可执行；A 臂检索更广（发现 probe 的入口），B 臂的 crates.io 注册中心路由是 A 臂没有的真实增量（下载量/维护信号）。两臂共同漏掉 hypergrep——新项目发现面是共同短板。

证据：[A decision](baseline/decision.md) · [B decision](plugin/decision.md) · [B 内核输出](plugin/artifacts/kernel-output.json)
