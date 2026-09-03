# Case 07 baseline rerun environment

## Run identity

- Model: `gpt-5.6-luna`
- Reasoning effort: `max`
- Host: Codex CLI `0.149.1`
- Run mode: direct isolated Codex CLI baseline run
- Session ID: `01a0669a-82d4-7e92-a647-71f8203c15eb`
- Plugins/skills invoked: none
- Subagent delegation: none
- Current date: 2026-09-03
- Local timezone: Asia/Shanghai (UTC+08:00)
- Isolated working directory: `C:\Users\QC\Documents\Codex\2026-08-29\new-chat\work\case07-baseline-rerun-20260903`
- Repository access during research: none
- Run sandbox: `workspace-write`; the isolated directory contained no project material

## Invocation

The case prompt was supplied verbatim to a fresh `codex exec` process with user configuration ignored:

```text
codex exec --model gpt-5.6-luna -c model_reasoning_effort="max" --ignore-user-config --skip-git-repo-check --sandbox workspace-write -C <isolated-directory> --json -o <final-answer.md> <verbatim-case-prompt>
```

The process retained standard Codex system/developer instructions and the platform-provided environment/plugin catalog, but it did not invoke a skill or plugin and did not inspect the benchmark repository.

## Timing

| Event | UTC | Asia/Shanghai |
| --- | --- | --- |
| First rollout event | 2026-09-03T09:29:57.559Z | 2026-09-03T17:29:57.559+08:00 |
| Last rollout event | 2026-09-03T09:31:51.848Z | 2026-09-03T17:31:51.848+08:00 |
| Elapsed | 114.289 seconds | 114.289 seconds |

## Research calls

The run made four successful `web__run` calls:

- three batched `search_query` calls containing 11 exact queries;
- one batched `open` call containing three search references;
- no other tool calls.

## Transcript provenance

The canonical raw Codex rollout is:

`C:\Users\QC\.codex\sessions\2026\09\03\rollout-2026-09-03T17-29-57-01a0669a-82d4-7e92-a647-71f8203c15eb.jsonl`

The local `session.jsonl` is a deterministic normalized evidence log, not the raw platform file. It preserves the exact user prompt, assistant commentary/final answer, exact query/open inputs, and full tool-result payloads in the benchmark's `{message:{role,content}}` schema. Each open call also includes `resolved_urls`, derived from its returned page headings, so the metric extractor can count resolved fetches without replacing the original `ref_id` inputs.
