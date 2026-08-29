# Environment — Case 01 baseline (A arm)

- Run date/time: 2026-08-29, started 13:20:14, session closed 13:22:44 (local time)
- Claude Code version: 2.1.220 (`claude --version`)
- Launch: `claude --permission-mode auto -p "<prompt>"` — NO `--plugin-dir`, no slash command, raw prompt only
- Working directory: `C:\Users\QC\AppData\Local\Temp\opencode\sbb-real\case-01-openapi-ts-client\baseline` (contains only `plan.md`)
- Permission mode: `auto`
- Model (from session.jsonl `message.model` field): **glm-5.2**
- Tools observed in the transcript: `Read` (1 use), `WebSearch` (4 uses), `WebFetch` (9 uses). No GitHub MCP, no Context7, no other retrieval tool — only the built-in web tools.
- Session file: `C:\Users\QC\.claude\projects\C--Users-QC-AppData-Local-Temp-opencode-sbb-real-case-01-openapi-ts-client-baseline\ad7652a3-3622-45cf-9002-09d559b71841.jsonl` (copied to `session.jsonl` here)
- Session turn count: 1 (single assistant response containing all research + final answer). No clarifying questions were asked; the agent went straight to research.
- Timeouts: none. The single turn finished in ~2.5 minutes.