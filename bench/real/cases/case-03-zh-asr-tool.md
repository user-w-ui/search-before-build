# Case 03 · 中文语音转文字 + 会议纪要工具（assess，中文市场）

| 项 | 值 |
| --- | --- |
| 技能（B 臂） | `search-before-build-assess` |
| 模拟用户语言 | 简体中文 |
| 补充材料 | 无 |
| 对比焦点 | 中文市场双语检索、Hugging Face Hub / arXiv 路由、纯 CPU 本地约束 |

## 背景与考察点

用户想要"本地运行的中文语音转文字 + 会议纪要"工具，明确数据不出本机、纯 CPU。该领域成熟（FunASR/Paraformer/SenseVoice、Whisper 系、whisper.cpp、Sherpa-ONNX 等），且中文场景下各实现差异显著。适合检验：

1. B 臂澄清是否用中文日常语言、追问 material 问题（本地/离线、硬件）；
2. B 臂路由是否触发 Hugging Face Hub（本地推理模型）、arXiv（Whisper/Paraformer/SenseVoice 论文，且 HF tags 里的 `arxiv:xxx` 可交叉）、GitHub（仓库）、中英双语 web（中文市场规则）；
3. 中文场景下 Whisper 系与 FunASR/Paraformer 系的能力差异是否有证据支撑，而非口碑推断；
4. "本地 + 纯 CPU"约束是否贯彻到候选筛选；中文 SaaS（通义听悟等）是否只作为对照出现；
5. A 臂默认搜索对中文源（通义、FunASR 中文文档）的触达能力如何。

## 用户 prompt（两臂原样输入）

```text
我想做一个本地运行的语音转文字工具，主要处理中文录音和会议音频，
转成带时间戳的文字稿，最好还能自动整理出会议纪要。数据不想上传到
别人的服务器，最好离线也能用。这个想法值得做吗？
```

## 澄清脚本（两臂通用，仅回答被问到的问题）

1. 输入类型/场景 → `主要是会议录音和访谈，mp3/wav 都有，单次时长 10 分钟到 2 小时。偶尔有两个人以上说话，能分清谁说的最好。`
2. 环境/硬件 → `Windows 电脑，没有独立显卡，纯 CPU。可以接受转写得慢一点。`
3. 为什么不用现成工具 → `讯飞、通义听悟这些要联网上传，公司有保密要求；想知道有没有能自己本地跑的开源方案。`
4. 检索前确认（B 臂）→ `确认。`

## B 臂路由观察表

| 来源 | 强度 | 触发依据 |
| --- | --- | --- |
| Hugging Face Hub | must | 指纹含本地推理模型（openai/whisper、FunAudioLLM/SenseVoiceSmall、funasr 系列等） |
| GitHub | must | 可改造实现（modelscope/FunASR、SYSTRAN/faster-whisper、ggerganov/whisper.cpp、k2-fsa/sherpa-onnx） |
| 双语 web | must | 目标市场为中文：中文 SaaS 与中文资料 + 英文资料 |
| arXiv | 可选 | 论文先例（Whisper 2212.04356、Paraformer 2206.08317、SenseVoice 2407.04051） |

## 两臂记录要点

- [ ] 候选清单：每臂最终提到的实现/模型/产品（名称 + 链接 + 定性），标出重合项
- [ ] 来源覆盖：A 臂触达平台；B 臂 coverage ledger 实际内容；**双语检索证据**（两臂各用了哪些中/英文查询词）
- [ ] 中文能力比较的证据来源（基准/官方文档/仓库 README），是否对"中文 CER/实时率"给出可追溯数据
- [ ] 纯 CPU 与离线约束是否进入候选筛选；SaaS 是否被正确排除或对照
- [ ] B 臂内核：中文查询词是否正确进入 kernel-input 的 query；kernel-output 是否正常
- [ ] 两臂最终建议与理由链原文摘录

## 对比焦点

1. 两臂对中文源的覆盖差异：A 臂能否发现 FunASR/SenseVoice 这类中文生态事实标准；
2. 双语检索：B 臂是否因"中文市场"规则而双语检索；A 臂是否只搜了单一语言；
3. 能力比较的证据质量：哪一臂的"用哪个更好"更有来源支撑；
4. 约束贴合度：哪一臂的建议更尊重"本地、离线、纯 CPU"。
