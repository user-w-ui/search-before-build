# Smoke benchmark（离线回归）

这里的 case 只服务于 benchmark runner 和 fixture 格式的**回归保护**，规模刻意很小，**不得**当作 Search Before Build 优于普通 Web 搜索的证据。真实场景实测请见 [`../real/README.md`](../real/README.md)。

## 运行

```bash
npm run benchmark:offline
```

Runner 位于 [`../run-offline.mjs`](../run-offline.mjs)，用例在 [`cases/`](./cases/)，fixture 在 [`tests/fixtures/retrieval/`](../../tests/fixtures/retrieval/)。

## 发布量化结论前

1. 在 `../real/` 完成冻结评测集（当前 12 个真实场景）；
2. 用相同模型与工具预算分别跑 baseline 与 pipeline 两组；
3. 在 [`../results/`](../results/) 提交带日期的结果快照。
