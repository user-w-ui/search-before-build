# Case 03 · A/B 对比（中文语音转文字 + 会议纪要，本地/离线/纯 CPU）

> **B 臂为修复后最终运行**（内核 v2 + capabilityAliases + DDG 兜底；中文宿主 WebSearch 本环境仍不可用）。
> 共同环境：glm-5.2，中文会话。

| 维度 | A 臂（baseline，~6 min，5 轮） | B 臂（plugin，最终版） |
| --- | --- | --- |
| 建议 | 拼装 Buzz + Ollama（前 3 轮零检索纯知识；第 4 轮爆发 5 WebSearch+12 WebFetch，全英文） | **Use existing**：SmartSub/妙幕（内置 FunASR/sherpa-onnx/whisper.cpp，文件不出本机）+ 本地 Ollama 纪要；组件级可复用 FunASR |
| 检索主动性 | 被动（被追问"还在维护吗"才检索）；亮点：用检索数据推翻了自己的 WhisperDesktop 推荐 | 澄清 4 问 → GitHub REST 一手核验 + DDG 4 条中文查询 + HN 1 次；宿主 WebSearch 中文查询全失败后正确触发 DDG 兜底 |
| 来源覆盖 | GitHub 页面；无双语、无 HF/arXiv | GitHub、DDG（中文）、HN；**HF Hub/arXiv 仍未实际查询**（遗留缺口） |
| 候选 | Buzz、Ollama、faster-whisper 等（记忆为主）；**sherpa-onnx 未发现** | 8 个：SmartSub、FunASR、FunClip、AudioNotes、sherpa-onnx、whisper.cpp、Buzz + 听记系（全部带 URL 一手核验） |
| 内核 | 无（预期） | capabilityAliases zh+en 双语文 ✓；**词汇命中 2/2（修复前 1/4）**；DDG 记录成为 rank-1 证据 |
| 澄清 | 按脚本答 1 问 | 4 问（3 个偏离脚本但均 material） |

**对比焦点结论**：B 臂的推荐更贴合"中文+时间戳+说话人分离+纯 CPU 离线"约束，且候选全部一手核验；A 臂凭检索推翻过期推荐值得肯定，但中文检索与双语检索均缺失。共同遗留：HF Hub/arXiv 路由在真实运行中未被执行，且宿主中文 WebSearch 在本环境彻底失效（DDG 兜底后部分缓解）。

证据：[A decision](baseline/decision.md) · [B decision](plugin/decision.md) · [B 内核输入](plugin/artifacts/kernel-input.json)
