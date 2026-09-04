# Case 06 基线运行环境

## 运行身份

- 模型：`gpt-5.6-luna`
- 推理强度：`max`
- 运行方式：直接 Codex 子代理运行（A 臂 baseline）
- 插件：无；没有加载或调用 Search Before Build/plugin skill
- Claude CLI：未使用
- 子代理委派：未使用
- 当前日期：2026-09-03
- 本地时区：Asia/Shanghai（UTC+08:00）
- 工作目录：`D:\Learning\BrainStorming\should-i-build`
- 证据写入范围：仅 `bench/results/case-06-invoice-expense-automation/baseline/`

## 研究环境

研究使用 Codex 原生 `web__run` 进行公开网页搜索、打开和页面内查找；使用 `exec_command` 进行 `bench` 范围内的只读目录/文本检查和创建目标目录；使用 `apply_patch` 写入证据文件。没有安装或配置任何工具，没有访问 `bench/real`，没有读取历史 `bench/results` 内容。

本次 `web__run` 共 13 次：

- `search_query` 5 次，合计 18 条精确查询；
- `open` 3 次，合计 29 个目标 ref；
- `find` 5 次，合计 28 个目标 ref。

本次 `exec_command` 共 15 次，包括研究前/中的目录、时间和格式检查，1 次失败的目录创建尝试（PowerShell 不接受 `New-Item -LiteralPath`），1 次用明确 `-Path` 成功创建目标目录，以及证据格式/内容校验。证据文件由 4 次 `apply_patch` 写入/补全。

## 时间记录

工具结果没有提供 web provider 的单次调用时间，所以 `turn-log.md` 和本文件只把下列本机时钟值作为精确捕获标记，并保留工具调用先后顺序：

| 标记 | 本地时间 | UTC |
| --- | --- | --- |
| capture-1 | 2026-09-03T16:26:03.3542153+08:00 | 2026-09-03T08:26:03.3580157Z |
| capture-2 | 2026-09-03T16:27:50.9468863+08:00 | 2026-09-03T08:27:50.9495798Z |

## 日志语义

`session.jsonl` 是代理自记录的证据日志（agent-self-recorded evidence log），不是平台导出的原始 transcript。它仍使用要求的 `{message:{role,content:[...]}}` 逐行 JSON 形状，保留实际工具名、精确查询、打开/查找目标和最终回答；工具结果是对实际返回内容的短摘要，详细候选证据在 `candidates.md`。
