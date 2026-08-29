# Decision — Case 03 B arm RE-RUN (plugin)

Verbatim quotes from the final wrap-up answer (turn 5) and the decoded brief (brief-decoded.json).

## Final recommendation

> **Use existing（直接用现成的）**

Brief value: `Use existing`

## Main reason

> 已有多个成熟开源方案能在纯 CPU 的 Windows 上离线完成中文带时间戳转写、数据不出本机，并已覆盖图形界面与会议纪要。从零自建既不更便宜、也不更安全，第 5 道必要性门不成立——你的真实需求是"拿到保密的本地中文转写稿+纪要"，而不是"做一个工具"。

Brief reason: 已有多个成熟开源方案能在纯 CPU 的 Windows 上离线完成中文带时间戳转写且数据不出本机，并覆盖图形界面与会议纪要；从零自建既不更便宜也不更安全，必要性不足。

## Necessity check (as stated by agent)

| # | 判断项 | 结论 |
| --- | --- | --- |
| 1 | 存在具体问题或需求 | 事实（保密场景下确需本地转写+纪要） |
| 2 | 核心产品能解决该问题 | 推断（本地离线 ASR+时间戳+本地 LLM 纪要命中需求，但这是方案假设） |
| 3 | 交付形式契合需求 | 事实（本地桌面/命令行、纯 CPU、Windows） |
| 4 | 现有变通方案仍有明显麻烦 | 推断（云服务被保密否决；本地开源方案已大量存在，"麻烦"主要在配置） |
| 5 | 自建比采用/改造现有方案更优 | 未知（倾向否定）——SmartSub/FunASR/FunClip/AudioNotes/sherpa-onnx 已覆盖，从零自建不更便宜也不更安全 |

## Most reusable option

> **SmartSub / 妙幕** —— Windows 图形界面安装包，内置 FunASR / sherpa-onnx / whisper.cpp 本地引擎，纯 CPU 可用，明确"文件不出本机"，几乎零编程成本。会议纪要可在其文字稿上叠加本地 Ollama（如 qwen3.5:2b）补足。

Alternates by priority:
- 最佳中文准确率（愿跟教程敲命令）→ **FunASR（Paraformer-zh / SenseVoiceSmall）**，或带 Gradio 界面的 **FunClip**
- 一站式会议纪要 → **AudioNotes**（本地 FunASR + Ollama），但默认 ASR 需 GPU、Docker 偏重，需把 ASR 换成 CPU 模型

## Biggest unknown

> ① 你电脑的具体 CPU 与内存（影响模型选型与速度，虽可接受慢）；② "开箱即用图形界面(SmartSub)"、"最佳中文准确率(FunASR/FunClip)"、"一站式纪要(AudioNotes)"三者间的优先级——这决定在几个都成立的现成方案里首选哪一个。

Brief unknowns: CPU 型号与内存大小；三者优先级未明确；AudioNotes 默认 ASR 需 GPU 且 Docker 较重，纯 CPU 机上能否流畅运行未实测。

## Constraint adherence

- 本地/离线/纯 CPU/保密 全部进入候选筛选：SmartSub(CPU 回退)、FunASR(CPU 17×实时注记)、sherpa-onnx(纯 CPU 原生)等按能力矩阵（native/partial/extensible/unsupported）逐项标注；AudioNotes 因默认 GPU 被标 partial 并提示需改造。
- SaaS（讯飞/通义听悟）仅作对照说明，未列入候选。
- 中文能力差异有来源支撑（README 原文核查 FunASR/Sherpa/whisper.cpp，SenseVoice CPU 实时率注记），非纯口碑推断；未做用户真机实测（列入 unknown）。

## Rendered brief

`C:\Users\QC\AppData\Local\Temp\search-before-build\runs\20260829T071919-45c4\brief.html`（最终回答中给出绝对路径；已归档至 artifacts\brief.html）