# Case 10 · Kaggle 自动化机器学习项目（compare，已有仓库）

| 项 | 值 |
| --- | --- |
| 技能（B 臂） | `search-before-build-compare` |
| 模拟用户语言 | 简体中文 |
| 补充材料 | `D:\Learning\Agent\Auto\_ML\_Agent\build-with-ag2\automate-ml-for-kaggle`（直接把该路径交给 agent；不要预先复制或改写仓库） |
| 对比焦点 | 从现有代码提取真实基线、Kaggle 生态与 AutoML 竞品、可复用组件和下一步优先级 |

## 背景与考察点

这是一个已有开发进度的场景。被测 agent 必须先读取仓库，区分已经实现、只在 README 中计划、以及无法确认的能力，然后再和当前 Kaggle/AutoML 工具比较。用例不预设仓库功能，避免把项目名或 README 宣称当作证据。

重点观察它能否找到同一技术层的替代品（例如 Kaggle 官方工作流、AutoGluon、FLAML、Optuna、H2O 等），并回答“应该复用哪一层、缺口是什么”，而不是笼统地说“AutoML 已经很多”。

## 用户 prompt（两臂原样输入）

```text
请先读取这个已有仓库，再帮我判断它有没有继续开发的必要：
D:\Learning\Agent\Auto\_ML\_Agent\build-with-ag2\automate-ml-for-kaggle

我想知道它和现在 Kaggle 上常用的 AutoML、训练编排和实验跟踪方案相比，哪些能力已经重复，哪些地方值得继续投入。请给出可以直接复用或集成的项目，以及最值得做的改进方向。
```

（B 臂调用方式：`/search-before-build:search-before-build-compare D:\Learning\Agent\Auto\_ML\_Agent\build-with-ag2\automate-ml-for-kaggle`；A 臂直接粘贴上述文本。）

## 澄清脚本（两臂通用，仅回答被问到的问题）

1. 对齐选择（compare 必问一次）→ **“先对齐真实需求”**。
2. 实际使用场景 → `主要是表格型 Kaggle 比赛。我希望从数据检查、交叉验证、特征处理到生成 submission 有一条可重复的本地流程，而不是每次从 notebook 手工拼。`
3. 约束与成功标准 → `代码要能在普通 GPU 或 CPU 上运行，比赛数据不能上传到第三方 SaaS；最重要的是可复现和少写样板代码，单纯追求排行榜第一不是目标。`
4. 采用倾向 → `如果仓库只是把现成库串起来，我更愿意保留它的编排和配置层，直接替换模型搜索或实验跟踪组件。`
5. 检索前确认（B 臂）→ `确认。`

## B 臂路由观察表

| 来源 | 强度 | 触发依据 |
| --- | --- | --- |
| GitHub | must | 读取基线仓库并核验 AutoML/编排项目的实现与维护状态 |
| Kaggle 官方文档与代码 | must | 比赛数据、Notebook、提交和 API 工作流是一手场景证据 |
| PyPI | must | Python AutoML、超参搜索、特征工程和实验跟踪包的实际分发 |
| web（宿主/DDG 兜底） | must | 产品主页、限制条件和商业托管方案核验 |
| Papers with Code / arXiv | optional | 只有在比较算法或论文复现能力时使用 |

## 两臂记录要点

- [ ] 基线清单：仓库中已实现/计划/未知的入口、数据流、模型搜索、提交生成、配置与测试。
- [ ] 候选清单：Kaggle 原生工具、开源 AutoML、搜索/跟踪组件和托管方案，标出是否可离线使用。
- [ ] 是否避免用项目名、Stars 或 README 愿景推断功能；每项结论都应回到代码或官方文档。
- [ ] 可复用建议是否落到具体边界，例如保留 orchestrator、替换 search backend、补充 dataset validation 或 reproducibility。
- [ ] B 臂是否把仓库基线与真实需求分开澄清，并记录 material 证据缺口。
- [ ] B 臂内核：同一组件跨 GitHub/PyPI/Kaggle 是否去重，维护信号是否只是 tie-breaker。
- [ ] 两臂最终建议与理由链原文摘录。

## 对比焦点

1. A 臂是否真的读取仓库，B 臂是否先建立实现基线而不是重新问材料里已有的信息；
2. 哪一臂覆盖了 Kaggle、PyPI、GitHub 三类来源，并能发现可替换的具体组件；
3. 建议是继续 Build、围绕现有编排层 Adapt，还是直接 Use existing，是否和离线/可复现约束一致；
4. 哪一臂能给出按优先级排序的改进路线，而不是把所有 AutoML 工具平铺罗列。

