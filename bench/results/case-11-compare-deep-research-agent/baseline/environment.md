# Environment — Case 11 baseline (A arm)

| Item | Value |
| --- | --- |
| Case | 11 · 深度研究 Agent 仓库对比 (compare, existing repo) |
| Arm | A = baseline: bare Claude Code, NO plugin, no slash command, raw prompt pasted |
| Claude CLI | `D:\Programs\claude-code-bin\claude.cmd` — version 2.1.220 (Claude Code) |
| Permission mode | `--permission-mode auto` (all tool calls auto-approved) |
| Disallowed tools | `--disallowed-tools Task Agent` (subagents prohibited) |
| Session ID | `24f414fa-56e6-43f3-8fa3-585bc111815b` |
| Session file | `C:\Users\QC\.claude\projects\C--Users-QC-AppData-Local-Temp-opencode-sbb-real-case-11-compare-deep-research-agent-baseline\24f414fa-56e6-43f3-8fa3-585bc111815b.jsonl` |
| Model (from transcript "model" field) | **claude-opus-5** |
| Workdir | `C:\Users\QC\AppData\Local\Temp\opencode\sbb-real\case-11-compare-deep-research-agent\baseline` |
| Run date/time | 2026-09-03, 16:23:11 – 16:28:10 local (UTC 08:23:11 – 08:28:10); ~5.0 min wall clock |
| Session turn count | 1 (single assistant response containing all code inspection, web search, analysis doc creation, and final recommendation) |
| Timeouts / retries | None. Finished in ~5 minutes without stalls or errors. |

## External retrieval tools actually available in-session

Tool calls observed in the transcript (from `session.jsonl` `tool_use` entries):

| Tool | Count | Notes |
| --- | --- | --- |
| Bash | 4 | Code inspection on target repo (`pwd`, `find`, `ls -la`) and search across parent directory `build-with-ag2` |
| Read | 8 | Target repo files (`README.md`, `main.py`, `backend.py`, `frontend.py`, `pyproject.toml`, `.env.example`) + sibling project readmes (`ag-ui/gpt-researcher`, `dataroom-research`) |
| WebSearch | 6 | AG2 DeepResearchAgent capabilities, GPT Researcher, browser-use framework, LangChain Open Deep Research, OpenAI Deep Research pricing |
| Write | 1 | Wrote `deep-research-agent-analysis.md` (15.5 KB) in temporary workdir |

No GitHub MCP, no Context7, no grep.app, no arXiv API, no npm/PyPI registry tools were configured or invoked in the baseline session.
