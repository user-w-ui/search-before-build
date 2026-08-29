# Candidates — Case 03 baseline (A arm)

Candidates the agent actually mentioned across all turns, with URL and characterization.

| Candidate | URL | Agent's characterization | Turn |
| --- | --- | --- | --- |
| **FunASR / Paraformer-large** (Alibaba) | (no URL given) | 中文识别、自动标点、时间戳上普遍优于原版 Whisper，专门为中文会议场景优化过；自带 CAM++ 说话人分离。但 CPU 上不一定比 faster-whisper 快，依赖重、自用折腾成本高 → 自用纯 CPU 不选为首选 | 1, 2 |
| **SenseVoice** (FunAudioLLM) | (no URL given) | 中文效果好（标点、数字、中英混读）；备选，中文标点不够好时再换 | 1, 2 |
| **Whisper (original)** | (no URL) | 更通用但中文体验不如 FunASR/SenseVoice；不建议当主力 | 1 |
| **faster-whisper** (SYSTRAN) | https://github.com/SYSTRAN/faster-whisper | 推荐栈首选转写层：CTranslate2 后端，CPU 比原版快约 4×，pip 一行装，自带时间戳+标点；发版慢（最后正式版 v1.2.1 / 2024-10-31）但 master 仍有 commit（至 2025-11-19） | 2, 4 |
| **whisper.cpp** | (mentioned in turn 1 only as generic CPU option: "faster-whisper / whisper.cpp 则更通用、CPU 也能跑") | 通用 CPU 选项 | 1 |
| **pyannote-audio** | (no URL) | 说话人分离；CPU 能跑但很慢，自用性价比低，建议先不做 | 1, 2 |
| **Ollama** (local LLM runner) | https://ollama.com | 纪要 LLM 运行器；v0.33.2 / 2026-08-27，极活跃；CPU 跑量化 7B | 2, 3, 4 |
| **Qwen2.5 7B** (via Ollama) | (no URL) | 中文强，CPU 量化能跑，7B 是纪要质量底线 | 2, 3 |
| **Chatbox / AnythingLLM** | (no URL) | 零代码纪要：连本地 Ollama 的桌面客户端，粘贴转写文本出纪要 | 3 |
| **Buzz** (chidiwilliams/buzz) | https://github.com/chidiwilliams/buzz | 首选零代码方案：Whisper 桌面 GUI，支持 faster-whisper 后端，自动导出带时间戳 SRT/VTT/TXT，全离线；v1.4.5 / 2026-08-23，commit 到 08-28，极活跃，近月加说话人编辑、DOCX 导出等功能 | 2, 3, 4 |
| **WhisperDesktop** (Const-me/Whisper) | https://github.com/Const-me/Whisper | 初始推荐为纯 CPU 备选（C++/DirectCompute，CPU 上特别快）；**turn 4 检索后收回推荐**：v1.12 / 2023-07，实质停更，仅 2026-05 一次 readme-only 更新 | 2, 3, 4 |
| **ffmpeg** | (no URL) | 预处理：重采样 16k 单声道 + VAD 去静音 | 2 |
| **SaaS 对照（不推荐）**：通义听悟、飞书妙记、讯飞 | (no URL) | 云端产品，数据上传不符隐私要求，仅作为产品化赛道拥挤的对照 | 1, 3 |

## Key findings relative to case focus

- **FunASR found**: YES (from model knowledge, turn 1). **SenseVoice found**: YES (turn 1). **faster-whisper**: YES. **whisper.cpp**: YES (named once). **sherpa-onnx**: NOT mentioned at all.
- Chinese-market options (通义听悟, 飞书妙记, 讯飞) mentioned only as cloud SaaS counter-examples — correct per case expectations.
- No Hugging Face Hub / arXiv routes used; no Chinese sources fetched; no Chinese-language search queries (all 5 WebSearch queries were English).
- FunASR/SenseVoice vs Whisper 中文能力差异 was asserted from model knowledge, NOT backed by fetched benchmarks/CER data. The only fetched evidence was maintenance-status data from GitHub (turn 4).