# Bench 工作区

两条互不混淆的评测轨道：

| 目录 | 内容 | 目的 |
| --- | --- | --- |
| [`smoke/`](./smoke/) | 3 个确定性离线 case + runner | 防止归一化/排序/去重/指标管线回归 |
| [`real/`](./real/) | 12 个真实场景 case + 双臂对比协议 | 每个用例分别用「agent 默认搜索」与「插件增强搜索」各跑一遍，保留两臂证据后对比 |
| [`results/`](./results/) | 双臂运行产物的存放位置（JSON 快照已被 .gitignore 忽略） | 留存证据，不污染仓库 |

- 离线回归：`npm run benchmark:offline`，入口 [`run-offline.mjs`](./run-offline.mjs)。
- 真实场景：先读 [`real/README.md`](./real/README.md)，按协议逐 case 双跑（baseline / plugin 两臂）。
- 量化对比：`node bench/metrics.mjs` 从各臂 session.jsonl 提取指标（**指标规范见 [`results/METRICS.md`](./results/METRICS.md)**，运行统计数据与结论放 [`results/SUMMARY.md`](./results/SUMMARY.md)）。

**结论纪律**：smoke 数字不构成任何质量声明；真实场景的对比结论只有在每个用例两臂证据齐全、并写入对比文档后才允许对外引用。
