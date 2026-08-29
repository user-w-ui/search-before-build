# Case 04 · A/B 对比（自动整理收藏内容的稍后读工具，市场未说明）

> **B 臂为修复后最终运行**（内核 v2 + HN 路由触发 + DDG 兜底；references 读取正常，`--disallowed-tools Task Agent`）。
> 共同环境：glm-5.2，非程序员人设，市场刻意未说明。

| 维度 | A 臂（baseline，~7.4 min，4 轮） | B 臂（plugin，最终版） |
| --- | --- | --- |
| 建议 | 先 2 周试用（Readwise Reader 或 Raindrop.io），失败再考虑 no-code 自建 | **Adapt**：Raindrop.io 做主干 + 薄 no-code 定时摘要层；最大未知是 Raindrop 的 AI 标签建议是否"够自动" |
| 检索主动性 | **零检索**（0 WebSearch、0 WebFetch，纯模型记忆） | 主动：host WebSearch 4 次全空 → **DDG 兜底 8 次** + WebFetch 27 页一手核验 + GitHub REST + **HN Algolia 2 次**（"read later never read" 等，309/204 分命中——需求信号首次落地） |
| 来源覆盖 | 无外部证据 | DDG、产品主页（Raindrop/Readwise/Instapaper/Pocket/Omnivore）、GitHub、HN Algolia |
| 候选 | Readwise Reader、Raindrop.io、Instapaper + no-code（均无 URL） | Raindrop.io、Readwise Reader、Instapaper、Omnivore（自托管）、Pocket（已排除）+ 内核另排 readflow/medium |
| 时效处理 | Pocket/Omnivore **从未提及**，停服风险完全未检验 | **双正确**：Pocket = Mozilla 停用，排除；Omnivore = 托管服务 2024-11 关闭，仅保留自托管定性 |
| 双语规则 | —（无检索） | **仍未生效**：市场未知但全部查询英文，无中文词（遗留缺口） |
| 内核 | 无（预期） | 运行正常，7 检索 0 失败；收尾路由审计未显式出现（部分缺口） |

**对比焦点结论**：从"零检索 vs 结构化检索"的极端对比，到本轮 B 臂的 HN 需求信号 + 双停服识别 + 产品一手核验，B 臂证据质量完胜。遗留两项：未知市场下的双语查询未触发、收尾路由-语言审计未显式执行。

证据：[A decision](baseline/decision.md) · [B decision](plugin/decision.md) · [B 内核输出](plugin/artifacts/kernel-output.json)
