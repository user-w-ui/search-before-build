# Candidates — Case 03 B arm RE-RUN (plugin)

Source: final answer (turn 5) + decoded brief (`brief-decoded.json`). All candidates are local/offline open-source; cloud SaaS (讯飞/通义听悟) appears only as excluded contrast.

| # | Name | URL | Category | Characterization (from brief/final answer) |
| --- | --- | --- | --- | --- |
| 1 | SmartSub / 妙幕 | https://github.com/luyu0279/SmartSub | 开箱即用桌面产品 | Electron 桌面应用，Windows x64 安装包，内置 FunASR/whisper.cpp/sherpa-onnx 本地引擎，纯 CPU 可用，明确"文件不出本机"，MIT。**最终推荐的最值得复用项** |
| 2 | FunASR | https://github.com/modelscope/FunASR | 可复用组件/工具包 | 阿里达摩院端到端 ASR 工具包，Paraformer-zh 中文离线带时间戳，SenseVoiceSmall CPU 约 17× 实时，配套 fsmn-vad/ct-punc/cam++ 说话人分离，MIT |
| 3 | FunClip | https://github.com/modelscope/FunClip | 可改造项目（带界面） | 基于 FunASR/Paraformer-Large 的 Gradio 网页应用，集成时间戳、SRT、说话人分离与 LLM 辅助剪辑，CPU 可跑 |
| 4 | AudioNotes | https://github.com/harx2024/AudioNotes | 一站式会议纪要方案 | 本地 FunASR + 本地 Ollama（qwen3.5:2b）端到端纪要/笔记/问答；默认 Fun-ASR-Nano 需 GPU，Docker 12GB+ 内存，偏重 |
| 5 | sherpa-onnx | https://github.com/k2-fsa/sherpa-onnx | 可复用引擎（C++/Python/CLI） | next-gen Kaldi + onnxruntime，纯 CPU/Windows 原生/完全离线，VAD+说话人分离+ASR 一体，Apache-2.0，约 1.4 万 star |
| 6 | whisper.cpp | https://github.com/ggerganov/whisper.cpp | 可复用引擎 | Whisper 的 C/C++ 移植，纯 CPU，带时间戳/SRT；中文为多语种模型、弱于 Paraformer/SenseVoice（README 依据） |
| 7 | Buzz | https://github.com/chidiwilliams/buzz | 开箱即用桌面产品 | Whisper 系桌面 GUI（Win/Mac/Linux），离线本地转写；中文准确率受 Whisper 限制 |
| 8 | Tingji (听记) / meeting-transcriber / jkinco-listen-open | GitHub API search hits (`meeting minutes transcription offline local`) | 一站式会议 bundle | 本地/离线会议转写+纪要 bundle，弱候选（仅搜索命中，未深挖） |

Overlap note vs previous run: 重合项 FunASR、sherpa-onnx、whisper.cpp、SmartSub；本 run 新增 FunClip、AudioNotes、Buzz、听记系；本 run 未出现 faster-whisper（前一 run 有）。