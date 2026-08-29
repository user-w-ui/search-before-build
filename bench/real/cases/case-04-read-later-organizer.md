# Case 04 · 自动整理收藏内容的稍后读工具（assess，市场未说明）

| 项 | 值 |
| --- | --- |
| 技能（B 臂） | `search-before-build-assess` |
| 模拟用户语言 | English（市场刻意不说明，观察"未知市场 → 双语检索"） |
| 补充材料 | 无 |
| 对比焦点 | 非开发者语言、HN Algolia 需求信号、产品主页一手核验、**停服时效** |

## 背景与考察点

README 招牌示例（"automatically organizes saved content"）的加强版：用户是非程序员，市场留白。该品类是**停服重灾区**：Omnivore 2024-11 被 ElevenLabs 收购后停服；Pocket（品类之王）2025-07 被 Mozilla 关闭。默认搜索若按知名度/流行度召回，很容易把 Pocket 排第一。适合检验：

1. B 臂澄清是否用日常语言、不逼问"用户画像/价值主张"（SKILL 明令禁止）；
2. B 臂是否用 HN Algolia 做需求信号（necessity check），A 臂是否有任何需求侧信号；
3. 是否触达产品主页（raindrop.io、readwise.io 等）做一手核验，而非只靠搜索摘要；
4. 市场未说明时，B 臂是否按规则双语检索；
5. **时效处理**：两臂对 Pocket / Omnivore 的现状各了解多少——是发现停服并规避，还是当健康候选推荐。

## 用户 prompt（两臂原样输入）

```text
I keep saving articles and bookmarks from the web and I never read them. I
want to build an app that automatically organizes everything I save into
categories, reminds me to actually read them, and works on my phone and
laptop. I'm not a programmer. Is this worth building?
```

## 澄清脚本（两臂通用，仅回答被问到的问题）

1. 当前做法/痛点 → `Right now I use browser bookmarks and a messy notes app. I save hundreds of links and never go back. Manual tagging takes too long, that's why I want it automatic.`
2. 核心能力 → `Auto-organizing what I save and reminding me to read it later. I don't care much about fancy features.`
3. 设备/个人还是分享 → `Phone and laptop. It's mainly for myself, I might tell friends if it works well.`
4. （市场/语言若被追问）→ `Not sure, just for me for now.`（保持未知）
5. 检索前确认（B 臂）→ `Confirmed.`

## B 臂路由观察表

| 来源 | 强度 | 触发依据 |
| --- | --- | --- |
| web（宿主/DDG 兜底） | must | ready-made SaaS 是主要候选形态（Raindrop、Readwise 等） |
| Hacker News Algolia | must | necessity check 的需求信号（"有没有人讨论过这个痛点"） |
| 产品主页核验 | must | 候选官方页面一手核验 |
| Wikipedia | 可选 | 概念背景核对（read-it-later / bookmarking） |
| 双语检索 | must | 市场未说明 → 规则要求中英文同时检索 |

## 两臂记录要点

- [ ] 候选清单：每臂最终提到的产品（名称 + 链接 + 定性），标出重合项
- [ ] **时效记录**：两臂是否提及 Pocket / Omnivore；若提及，是否标注停服（Pocket 2025-07 停服、Omnivore 2024-11 停服）及信息来源；若推荐了已停服产品，原文摘录
- [ ] 来源覆盖：A 臂触达平台；B 臂是否使用 HN Algolia、查询词与命中情况；双语检索证据
- [ ] 澄清质量（B 臂）：是否出现"用户画像/价值主张/市场细分"类措辞（不应出现）；语言是否通俗
- [ ] 产品主页核验：两臂对候选的定性是来自官方页面还是搜索摘要
- [ ] B 臂内核：kernel-input/output 是否生成；时间字段（updated_at 等）是否在排序特征中体现
- [ ] 两臂最终建议与理由链原文摘录

## 对比焦点

1. **时效**：哪一臂识别出 Pocket/Omnivore 已停服并规避；是否有一臂把停服产品当首选；
2. 需求信号：B 臂的 HN 证据 vs A 臂对"有没有人需要"的论证方式；
3. 候选一手核验程度：官方页面 vs 二手摘要；
4. 对非开发者用户的可读性：两臂的表述哪一方更像对普通人说话。
