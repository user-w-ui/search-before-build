# Coverage — Case 03 B arm RE-RUN (plugin)

From session tool calls (session.jsonl) + kernel-input.json + final answer + decoded brief.

## Routes actually queried

| Route | Queried | Evidence |
| --- | --- | --- |
| GitHub REST API (anonymous curl) | **YES** | Repo search `q=meeting+minutes+transcription+offline+local`; README raw fetches: FunASR, SmartSub, AudioNotes, FunClip, sherpa-onnx; repo metadata calls. ~10 GitHub API calls. |
| Host WebSearch | **YES, both returned EMPTY** | 2 Chinese queries (see below) → zero results. Recorded in kernel-input as `host-web` error `empty`. |
| Anonymous Web fallback (DDG HTML) | **YES — used as fallback after host WebSearch emptied** | 4 Chinese queries via `curl html.duckduckgo.com/html/?q=...` (below). Recorded as `anonymous-web` success. |
| Hugging Face Hub (hf CLI / huggingface_hub / REST `api/models`) | **NO — not actually queried** | `huggingface.co/api/models?search=whisper...` appears ONLY inside the catalog file (search-sources.md read); no curl/python/hf call executed. HF model identities (funasr/paraformer-zh, FunAudioLLM/SenseVoiceSmall, cam++ etc.) arrived via DDG snippets + GitHub READMEs. Brief coverage labels HF as `limited` ("通过 FunASR README 间接确认…未单独枚举 Hub 全量模型") — honest admission. |
| arXiv REST | **NO — not actually queried** | `export.arxiv.org/api/query` examples appear only in catalog read; no speech-related arXiv query executed. `arxiv.org/abs/2407.04051` (SenseVoice paper) surfaced via other sources' text. Brief coverage omits arXiv entirely; final chat coverage note also omits it. |
| Hacker News Algolia | **YES, empty** | 1 English query `local speech to text offline whisper chinese` → no output. Recorded as `hackernews` error `no-results`. |

## Query terms per language (bilingual audit)

Chinese:
- WebSearch: `FunASR Paraformer 中文 本地 离线 时间戳 CPU`（宿主工具实际收到的是 GBK 乱码字节，返回空）；`whisper.cpp CPU 中文 语音转文字 离线 GUI Buzz`（同前，返回空）
- DDG fallback: `FunASR Paraformer 中文 本地 离线 时间戳 CPU`；`whisper.cpp Buzz 中文 本地 离线 语音转文字 CPU GUI`；`会议纪要 本地 离线 语音转文字 ollama 开源`；`本地离线中文语音转文字 开源`

English:
- GitHub API: `meeting minutes transcription offline local`
- HN Algolia: `local speech to text offline whisper chinese`
- (DDG catalog smoke test: `openapi typescript client` — catalog example, not real research)

## Fix-verification mapping

1. **capabilityAliases**: YES — kernel-input has `capabilityAliases` for both must-have capabilities, each with zh + en forms (e.g. "本地离线中文语音转文字并输出时间戳" → ["offline Chinese ASR", "语音识别 时间戳", "Paraformer", "SenseVoice", "whisper.cpp", "sherpa-onnx", "本地转写"]; "音频数据不离开本机" → ["local processing", "离线", "不上传", "数据不出本机", "privacy"]).
2. **HF Hub / arXiv**: NO direct queries (details above). HF reached indirectly; arXiv not reached.
3. **DDG fallback**: YES — host WebSearch returned empty on both Chinese queries; agent retried the same topics via DDG (4 Chinese queries), and DDG results fed the kernel (rank-1 web record).
4. **Bilingual audit**: PARTIAL — agent's final answer claims "已用 DuckDuckGo 匿名兜底完成中英文发现" and lists coverage (GitHub tool unused, host WebSearch empty, DDG used, HN empty). But: all DDG queries were Chinese (English discovery came from GitHub/HN instead), and no explicit arXiv/HF route statement in chat (brief does state HF `limited`, arXiv absent).
5. **Lexical matching**: kernel-output coverage shows **2/2 must-have capabilities** with candidate_mention (previously 1/4). Note capabilities were consolidated 4→2; aliases evidently drove matches (e.g. buzz/sherpa-onnx matched capability 1 via Whisper/paraformer-family aliases).

Coverage limits stated by agent: 未使用 GitHub 专属深度检索工具（结果来自公开 API 或网页索引，可能遗漏较新/低曝光项目）；宿主 WebSearch 对相关查询返回空；Hacker News 无返回。