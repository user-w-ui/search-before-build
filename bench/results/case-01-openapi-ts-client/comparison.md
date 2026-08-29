# Case 01 · A/B 对比（OpenAPI → TS 客户端生成器）

> **B 臂为修复后最终运行**（内核 v2：web 投影/身份合并/capabilityAliases 修复版，`--disallowed-tools Task Agent`，~32 min）。
> 共同环境：glm-5.2，Claude Code 2.1.220，无 GitHub MCP/gh；宿主 WebSearch 频繁空结果。

| 维度 | A 臂（baseline，~2.5 min） | B 臂（plugin，最终版） |
| --- | --- | --- |
| 建议 | Don't build，试点 @hey-api/openapi-ts | **Use existing**：openapi-typescript + openapi-fetch（`--check` 直接满足 CI staleness 门禁） |
| 检索主动性 | 主动 1 回合：4 WebSearch（全空）+ 9 WebFetch（靠记忆点名再抓页） | 澄清 2 问 + 9 个内核检索请求（npm×2、GitHub REST×2、Maven Central×1、host-web×4、Ecosyste.ms×2），0 失败，28 记录 → 23 唯一候选 |
| 来源覆盖 | 仅 GitHub 页面 + hey-api 文档 | npm、GitHub、Maven Central、host-web、**Ecosyste.ms 首次实际使用**；HN 未查询 |
| 候选 | 7 个（swagger-typescript-api 为独有发现）；无 SaaS | 7 个（**Fern、Speakeasy 首次被纳入**）；JVM 运行时成本显式列为采用成本 |
| 内核 | 无（预期） | ✓ 全绿：web 记录投影（4/8 候选 kind=web，修复前 12 条全丢）；**身份合并生效**（openapi-generator obs=3 = github+maven+web，openapi-typescript obs=2，duplicateObservationsMerged=3）；capabilityAliases 5 项齐备 |
| 澄清 | 零提问 | 2 个 material 问题 |

**对比焦点结论**：修复后 B 臂在候选广度（补上 SaaS 层）、身份去重、证据来源上全面占优；A 臂仅凭"发现 swagger-typescript-api"扳回一分。B 臂仍缺 HN 需求信号（本 case 非痛点验证场景，属可选）。

证据：[A decision](baseline/decision.md) · [B decision](plugin/decision.md) · [B 内核输出](plugin/artifacts/kernel-output.json)
