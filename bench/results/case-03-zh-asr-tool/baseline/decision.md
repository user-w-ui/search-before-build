# Decision — Case 03 baseline (A arm)

## Final recommendation (verbatim, turn 4 closing)

> "转写就锁死 Buzz，别再看 WhisperDesktop 了。它健康、活跃、最近还在加你要的功能。纪要配 Ollama，最活跃的那个，不用担心。faster-whisper 你不用单独装，Buzz 带着它跑。所以装到一半发现没人维护这个风险，按这套组合基本不存在。你装 Buzz + Ollama 试试就行。"

Turn 5 closing: "不客气！这套组合自用完全够用，慢慢跑就行。祝你装得顺利，转写效果到不到预期随时回来聊。"

## Recommendation chain across turns

1. **Turn 1 (initial verdict)**: "值得做，但要想清楚做的是哪一层"。技术层已被开源解决（FunASR/SenseVoice 中文优于原版 Whisper；faster-whisper/whisper.cpp CPU 可跑；pyannote/CAM++ 说话人分离；本地 LLM 出纪要）。真正的价值点不在 ASR 而在：说话人分离、纪要质量、长会议处理、说话人实名映射。自用 vs 产品两条路；产品化赛道拥挤（通义听悟、飞书妙记、Buzz、WhisperDesktop），差异化只能靠隐私承诺 + 中文会议端到端体验。
2. **Turn 2 (after CPU/self-use clarification)**: 明确推荐 **faster-whisper (large-v3, int8) + ffmpeg 预处理 + Ollama(Qwen2.5 7B) 纪要**，"别从零写 ASR，转写层直接用现成开源件；自己只写转写→喂给本地 LLM 出纪要这根细线，大概 50 行 Python"。附两段可运行代码骨架。明确说话人分离先不做（CPU 慢、自用性价比低）。
3. **Turn 3 (zero-code question)**: 首选 **Buzz**（faster-whisper 后端、SRT/VTT/TXT 导出、全离线），备选 **WhisperDesktop**（纯 CPU 快），纪要走 **Ollama + Chatbox/AnythingLLM** 手动粘贴。
4. **Turn 4 (maintenance question — the only research turn)**: 检索后**主动收回 WhisperDesktop 推荐**（v1.12/2023-07 实质停更），Buzz/Ollama 确认极活跃，faster-whisper "发版慢但活着"且经 Buzz 打包可绕开发版问题。最终锁定 Buzz + Ollama。

## Constraint adherence

- 隐私/离线约束：贯彻始终（"隐私完全守住（音频和文本都不出本机）"；SaaS 仅作对照被排除）。
- 纯 CPU 约束：转写层选 faster-whisper/WhisperDesktop 即因 CPU 友好；LLM 用 CPU 量化 7B，明确"7B 是底线"；也诚实给出权衡（离线纪要质量天花板低于云端、CPU 纪要 1-2 分钟/份）。
- 诚实性亮点：turn 4 依据检索数据推翻自己 turn 2/3 的 WhisperDesktop 推荐，并交代 faster-whisper 发版停滞的细节。

## Evidence-quality caveats

- "FunASR/SenseVoice 中文优于 Whisper"（标点、数字、中英混读）全程为模型记忆断言，**未提供任何基准/CER/文档来源**；唯一检索证据是 turn 4 的 GitHub 维护状态。
- 未发现 sherpa-onnx；未访问 Hugging Face Hub / arXiv / 中文源。