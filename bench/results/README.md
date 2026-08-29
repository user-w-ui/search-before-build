# 结果落档目录

真实场景双臂对比的证据按 case 归档：

```text
results/
  SUMMARY.md                    # 跨用例对比结论 + 量化对比一页表
  METRICS.md                    # 量化指标定义、自动提取口径、标注规则、一页结论
  <case-id>/                    # 如 case-01-openapi-ts-client
    baseline/                   # A 臂：agent 默认搜索
      turn-log.md               #   会话回合记录
      environment.md            #   可用检索工具、权限模式、模型
      candidates.md             #   候选清单：名称 + 链接 + 定性
      coverage.md               #   实际触达的检索来源/平台
      decision.md               #   最终建议与理由
      session.jsonl             #   原始会话记录（量化提取的数据源）
    plugin/                     # B 臂：插件增强搜索（同上结构）
      artifacts/                #   kernel-input.json、kernel-output.json、brief.html、
                                #   session.jsonl；内核未运行时放 KERNEL_NOT_RUN.md
    comparison.md               # 按 real/cases/<case-id>.md 的对比焦点逐项比较
```

- 量化对比脚本：[`bench/metrics.mjs`](../metrics.mjs)（从各臂 session.jsonl 自动提取广度/深度硬指标）。
- `*.json` 已被 `.gitignore` 忽略（`bench/results/*.json`）；markdown 汇总可选择提交。
- 离线 smoke 的日期快照也放本目录（`smoke-<date>.json`）。
- 对比结论（含 SUMMARY.md）必须引用两臂证据；smoke 数字不得混入。
- 换模型、换工具预算或改内核版本后重测，注明环境并作为新一批快照落档。
