# Environment — Case 05 baseline (A arm)

| Item | Value |
| --- | --- |
| Case | 05 · Rust blazing-fast local code search CLI (assess) |
| Arm | A = baseline: bare Claude Code, NO plugin, no slash command, raw prompt pasted |
| Claude CLI | D:\Programs\claude-code-bin\claude.cmd — version 2.1.220 (Claude Code) |
| Permission mode | --permission-mode auto (all tool calls auto-approved) |
| Session id | 91bbb58a-c156-47bb-9d34-b795b2c1cc7c |
| Session file | C:\Users\QC\.claude\projects\C--Users-QC-AppData-Local-Temp-opencode-sbb-real-case-05-rust-code-search-cli-baseline\91bbb58a-c156-47bb-9d34-b795b2c1cc7c.jsonl |
| Model (from transcript "model" field) | glm-5.2 (reported on all 85 assistant-message records) |
| Workdir | C:\Users\QC\AppData\Local\Temp\opencode\sbb-real\case-05-rust-code-search-cli\baseline (empty except agent-created friction-log.md) |
| Date/time of run | 2026-08-29, 13:21:02 – 13:35:30 local (UTC 05:21:02 – 05:35:30); ~14.5 min wall clock |
| Driving mode | print mode: first call `-p` with prompt; later turns `--resume <session-id> -p <answer>` |

## Tools observed in the transcript (per session jsonl, tool_use records)

| Tool | Count | Notes |
| --- | --- | --- |
| WebSearch | 19 | proactive, started in turn 1 (see coverage.md) |
| WebFetch | 9 | GitHub repo/releases/issues pages, ast-grep docs, docs.rs, ugrep repo/MANUAL |
| Bash | 3 | `ls -la` of workdir + parent (incl. sibling plugin dir), `cat` of own memory file — read-only |
| Read | 5 | read own memory files / project dirs |
| Write | 5 | 3 into own project memory dir (~/.claude/projects/.../memory/), 1 friction-log.md in workdir, 1 current-plan.md memory file |

No GitHub MCP, no Context7, no crates.io access observed. Web tools (WebSearch/WebFetch) were the agent's only external retrieval.