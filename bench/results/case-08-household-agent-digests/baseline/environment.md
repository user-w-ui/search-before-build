# Environment

- Case: 08 — household agent digests.
- Run type: A-arm baseline, direct Codex subagent run. No plugin was loaded or invoked, and no Search Before Build skill, plugin reference, `bench/real`, or historical `bench/results` content was read. No Claude CLI was used and no subagent was delegated.
- Model: `gpt-5.6-luna`.
- Reasoning: `max`.
- Date: 2026-09-03.
- Local timezone: Asia/Shanghai (`+08:00`). UTC was recorded alongside local timestamps.
- Filesystem scope: all reads and writes for this run were under `D:\Learning\BrainStorming\should-i-build\bench`; the evidence bundle is this directory.
- Research mode: direct web research using official vendor documentation and product pages. No connector or plugin was installed or configured.
- Tool counts: `web__run` 12 calls total; `search_query` 30 queries; `open` 32 source pages; no `click`, `find`, `screenshot`, `finance`, `weather`, `sports`, or `time` operations. The baseline evidence pass used local filesystem/time inspection through `exec_command` 8 times and artifact edits through `apply_patch` 5 times; the later schema correction is a post-run evidence-format edit and does not change the research counts. The precise self-recorded call list is in `turn-log.md` and `session.jsonl`.
- Evidence-log note: `session.jsonl` is an agent-self-recorded evidence log, not a platform-exported raw transcript. Each external `web__run` call is represented as an assistant content item of type `tool_use` with a unique self-recorded id and its actual recorded `input`, followed immediately by a user content item of type `tool_result` with the observed summary and `is_error:false`. It records the actual tool names and observed result summaries; it does not invent tool calls or results.
- Timestamp note: the first exact local/UTC clock capture was `2026-09-03T16:26:57.0647367+08:00` / `2026-09-03T08:26:57.0684154Z`; artifact preparation was clock-captured at `2026-09-03T16:28:33.0815413+08:00` / `2026-09-03T08:28:33.0847769Z`. Web pages report their own crawl/update dates in the source output. Message ingress time was not exposed by the platform, so the first clock capture is used as the run-start anchor.
- Artifact validation: at local `2026-09-03T16:35:02.0927931+08:00` / UTC `2026-09-03T08:35:02.0962600Z`, the target directory contained exactly the six required files, and PowerShell parsed all 30 `session.jsonl` lines successfully.
