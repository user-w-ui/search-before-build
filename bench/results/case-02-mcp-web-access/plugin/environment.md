# Case 02 · B 臂（plugin）环境

- Claude Code：2.1.220（print 模式 + `--resume` 续会话）
- 模型：glm-5.2（经网关路由）
- 权限：`--permission-mode auto` + `--disallowed-tools Task Agent`（子代理禁令，生效：Task/Agent 调用数 0）
- 环境工具：node v24.x 可用、`gh` CLI 不存在（回退 GitHub 匿名 REST）、宿主 WebSearch 频繁空结果（DDG 兜底生效）
- 日期：2026-08-29
- 说明：本运行的内核 input/output 文件未留存（report-input 被 `--consume-input` 删除、kernel 文件不在 run 目录）；内核实际执行过，最终结论基于逐候选一手核验，无"全标 missing"现象。会话原始记录见 [artifacts/session.jsonl](artifacts/session.jsonl)。
