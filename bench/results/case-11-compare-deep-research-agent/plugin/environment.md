# Environment — Case 11 B-arm (plugin) · Deep Research Agent Compare

- **Case**: 11-compare-deep-research-agent · **Arm**: B (plugin) · **Skill**: `search-before-build-compare`
- **Date/Time**: 2026-09-03 14:22:52 – 14:40:13 (UTC+8)
- **Claude CLI**: `D:\Programs\claude-code-bin\claude.cmd` (Claude Code 2.1.220)
- **Model**: `claude-opus-5` (from session jsonl `model` field)
- **Permission Mode**: `--permission-mode auto`
- **Subagent Disallow**: `--disallowed-tools Task Agent`
- **Plugin Dir**: `D:\Learning\BrainStorming\should-i-build`
- **Workdir**: `C:\Users\QC\AppData\Local\Temp\opencode\sbb-real\case-11-compare-deep-research-agent\plugin`
- **Session ID**: `4648c1bf-836c-4ab0-94e4-3a41a1089276`
- **Kernel Run Dir**: `C:\Users\QC\AppData\Local\Temp\search-before-build\runs\sbb-compare-20260903-143456-23d7`
- **dist/cli.js present & executed**: Yes (`dist/cli.js run`)

---

## Tool Availability & Actual Usage

### Subagent Ban Verification
- `Task` / `Agent` tool calls: **0** (strictly prevented via `--disallowed-tools Task Agent`).

### Tools Actually Used in Session
Total tool invocations: **56**
- `Bash`: 17 calls (code inspection, `gh` availability check, anonymous GitHub REST search & repo metadata retrieval, arXiv API queries, npm/PyPI registry checks, kernel invocation)
- `Read`: 16 calls (target repo files `main.py`, `backend.py`, `frontend.py`, `pyproject.toml`, `.env.example`, `README.md`; skill reference documents `conversation-and-decision.md`, `research-method.md`, `search-sources.md`, `github-retrieval.md`, `decision-kernel.md`, `report-template.md`, `report-viewer.md`; kernel output `kernel-output.json`)
- `WebSearch`: 13 calls (research queries across commercial hosted tools, open-source agents, ConflictRAG, LangGraph checkpointing, cost guardrails)
- `PowerShell`: 5 calls (temporary run-dir creation, kernel run, report rendering via `scripts/render-report.mjs`)
- `Write`: 3 calls (kernel input json construction, report input json construction)
- `Edit`: 2 calls (report input adjustments)

### External Connector / Retrieval Status
- `gh` CLI check: Not installed / not authenticated. Agent detected this and transitioned to anonymous GitHub REST API (`https://api.github.com/...`) per repository instructions.
- Web search: Active and utilized for capability comparisons and paper references.
- Academic query: Active (arXiv API `https://export.arxiv.org/api/query?...` returned 165 records).
- Rate limits / Errors: None observed. All API and web requests succeeded.
