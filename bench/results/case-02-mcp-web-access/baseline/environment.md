# Environment — Case 02, A arm (BASELINE)

| Item | Value |
| --- | --- |
| Date / time | 2026-08-29 13:20–13:22 (local) |
| Claude CLI | `D:\Programs\claude-code-bin\claude.cmd` (Claude Code 2.1.220) |
| Mode | print mode (`-p`), `--permission-mode auto` |
| Plugin | NONE (baseline arm; no `--plugin-dir`, no skills, no slash commands) |
| Model (from session.jsonl `message.model`) | `glm-5.2` |
| Workdir | `C:\Users\QC\AppData\Local\Temp\opencode\sbb-real\case-02-mcp-web-access\baseline` |
| Session id | `6af9df1e-2e98-42c5-8a31-6c25e3291ba4` |
| Session file | `C:\Users\QC\.claude\projects\C--Users-QC-AppData-Local-Temp-opencode-sbb-real-case-02-mcp-web-access-baseline\6af9df1e-2e98-42c5-8a31-6c25e3291ba4.jsonl` (21 lines) |

## External retrieval tools actually available in-session

Tool calls observed in the transcript (from `session.jsonl` `tool_use` entries):

| Tool | Count | Notes |
| --- | --- | --- |
| WebSearch | 2 | Both calls returned empty results (no hits/sources); agent said "The searches came back empty." |
| WebFetch | 2 | Used on GitHub only (official MCP servers repo + fetch server page); both returned usable content |

No GitHub MCP, no Context7, no grep.app, no browser tool, no other retrieval tools present in the baseline session.

## Permission model

`--permission-mode auto` — all tool calls were auto-approved; no permission prompts observed.