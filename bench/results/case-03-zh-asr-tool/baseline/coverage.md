# Coverage — Case 03 baseline (A arm)

What the agent actually did to gather evidence. No monitoring stalls were observed; the agent finished in ~7 minutes total.

## Search behavior summary

- **Turns 1–3: NO search at all.** The initial "值得做吗" prompt was answered entirely from model knowledge (recommendation, stack choice, code snippets, candidate names with GitHub URLs from memory). Two follow-up turns (hardware clarification, zero-code tool question) were also answered without any tool call except one `Bash ls` of the (empty) workdir.
- **Turn 4: one research burst** — triggered only by the user's question about maintenance status ("现在还活跃维护吗"). In that single turn: **5 × WebSearch, 12 × WebFetch**, all against GitHub. After that the session closed (turn 5, no tools).

## WebSearch queries (all 5, ALL IN ENGLISH — no Chinese query terms at all)

1. `Buzz whisper transcription Windows GUI 2025 maintained release`
2. `Const-me WhisperDesktop CPU performance Windows 2025`
3. `Buzz chidiwilliams v1.4.5 release date 2025 2026 maintained`
4. `Const-me WhisperDesktop v1.12 release date 2025 2026`
5. `faster-whisper maintained 2025 2026 CTranslate2 alternative status`

## WebFetch URLs (12, all GitHub)

Repo roots: github.com/chidiwilliams/buzz, github.com/Const-me/Whisper, github.com/SYSTRAN/faster-whisper, github.com/ollama/ollama
Releases pages: buzz/releases, Const-me/Whisper/releases, faster-whisper/releases, ollama/ollama/releases
Commits pages: buzz/commits/master, Const-me/Whisper/commits/master, faster-whisper/commits/master, buzz/commits/main

## Sources/platforms touched

- GitHub (via WebSearch + WebFetch): the ONLY platform touched.
- NOT touched: Hugging Face Hub, arXiv, npm, PyPI, any Chinese site (GitHub 中文文档、FunASR 中文文档、通义/讯飞 页面), Ollama 官网未被 fetch（只 fetch 了 GitHub 仓库）。
- No bilingual search: 5/5 queries English, 0 Chinese queries. No Chinese keyword variation (e.g. 语音转文字/会议纪要/离线) was ever searched.

## Facts claimed from the searches (turn 4 output)

- Buzz v1.4.5 / 2026-08-23, commits to 08-28 → "极活跃"
- Ollama v0.33.2 / 2026-08-27 → "极活跃"
- faster-whisper last tagged release v1.2.1 / 2024-10-31, master commits to 2025-11-19 → "发版慢但活着"
- WhisperDesktop v1.12 / 2023-07, ~3-year gap, one readme-only 2026-05 commit → "实质停更"，推荐被收回

## Notes

- The single `ls -la` Bash call (turn 2/3 boundary) checked the workdir before offering to scaffold code; user declined, nothing was written.
- The time-sensitivity handling (turns 3→4) is the one place this arm refreshed facts; FunASR/SenseVoice Chinese-quality claims remained unsourced memory assertions throughout.