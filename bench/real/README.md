# 真实场景对比实测协议（Paired A/B）

**目标**：回答"新检索内核是否真的提升了检索能力"。对同一个真实需求，用**两种检索方式各跑一遍**，保留两臂证据，最后逐用例对比：

- **A 臂（baseline）**：agent 默认自带的搜索能力——不加载本插件、不调用技能，直接粘贴同一份 prompt；
- **B 臂（plugin）**：本插件的增强搜索——`claude --plugin-dir <仓库根>`，显式调用 `search-before-build-*` 技能。

**不设标准答案**：搜索评测不存在唯一正确结果，结论来自同用例两臂证据的**横向对比**，而不是对照一份预设清单打分。

## 0. 前置条件

```bash
cd <repo root>
npm install
npm run build                # 确认 dist/cli.js 存在（内核入口）
claude plugin validate --strict .
python tests/validate_plugin.py
```

被测机器需有网络与 Claude Code。每臂开始时记录会话中**实际可用**的外部检索工具清单（web search、GitHub MCP、Context7、grep.app、浏览器等），作为"该臂检索能力"的证据。

## 1. 防污染设计（务必遵守）

1. **两臂完全隔离**：每臂独立全新会话、独立空工作目录（建议 `C:\Users\QC\AppData\Local\Temp\opencode\sbb-real\<case-id>\<arm>`），互不共享上下文。先跑 A 臂还是 B 臂均可，但同一 case 的两臂不得互相引述结果。
2. **工作目录与插件目录分离**：`--plugin-dir` 指向仓库根，但工作目录在仓库外；compare 类 case 把 `material/` 复制进工作目录。
3. **同一 prompt**：A、B 两臂的初始输入完全一致（见各 case 的 prompt 区块）。A 臂直接粘贴；B 臂通过技能命令调用。**不得**额外提示"请先搜索"之类的话——A 臂会不会主动检索，本身就是要测的行为。
4. **澄清脚本两臂通用**：case 里的预设回答用于扮演用户。B 臂按技能流程逐轮追问；A 臂不一定按同一脚本提问，如实记录 A 臂的实际对话即可。
5. **临时产物按 run 隔离**：插件已改为每次研究使用唯一的 run 目录（`<temp>/search-before-build/runs/<run-id>/`，见 `references/report-viewer.md`），并发会话不再互相覆盖。但每个 case×arm 组合仍必须有自己的**工作目录 + 全新会话**，这是会话层面（而非文件层面）的隔离。

## 2. 执行方式（可并发）

每个 **case×arm** 组合是一个独立子代理任务：一个子代理只跑一个组合，多个子代理可同时并行（如 5 个 case 的 B 臂一起跑）。前提是每个组合遵守第 1 节的隔离要求。

单组合步骤：

1. 读 [`cases/<case-id>.md`](./cases/)。
2. **A 臂**：空工作目录启动 `claude`（不带 `--plugin-dir`），粘贴 case prompt。按脚本回答（若被追问）。全程记录它用了哪些检索工具、找到了什么、给了什么建议。结束后把证据存到 `../results/<case-id>/baseline/`。
3. **B 臂**：另一空工作目录启动 `claude --plugin-dir <仓库根>`，用技能命令调用：
   - assess：`/search-before-build:search-before-build-assess <prompt>`
   - compare：`/search-before-build:search-before-build-compare <material路径>`
   按脚本逐轮回答（最多 5 个信息性问题 + 1 次检索前确认），确认后批准其工具调用。结束时技能会返回临时简报的绝对路径（其父目录就是该 run 的 run-dir）。把证据存到 `../results/<case-id>/plugin/`。
4. 写 `../results/<case-id>/comparison.md`：按 case 文件末尾的"对比焦点"逐项比较两臂证据。

**驱动方式**：`claude` 交互式跑或 print 模式（`-p` 首轮 + `-c -p` 续会话）均可。print 模式下研究阶段单轮可能超过 4 分钟，超时上限给足（建议 ≥15 分钟），且超时后要确认子进程确实退出，避免 Windows 下孤儿进程继续写临时目录。

## 3. 每臂证据清单

```text
results/<case-id>/<baseline|plugin>/
  transcript.md      # 会话关键段落或全量转录（含实际提问与回答）
  environment.md     # 可用检索工具、权限模式
  candidates.md      # 该臂最终提到的候选清单：名称 + 链接 + 它给每个候选的定性/理由
  coverage.md        # 实际触达的检索来源/平台（B 臂含 search coverage ledger 摘要）
  decision.md        # 最终建议及理由原文摘录
  artifacts/         # B 臂额外：从该 run 的 run-dir（<temp>/search-before-build/runs/<run-id>/，
                     # 即技能最终消息中简报路径的父目录）复制 kernel-input.json、kernel-output.json、
                     # brief.html；A 臂无此目录属正常
```

B 臂若内核未被调用，在 `artifacts/` 放一个 `KERNEL_NOT_RUN.md` 说明观察到的原因（这本身就是对比证据）。每个组合结束后**立即**从 run-dir 归档（run-dir 是唯一命名的，但临时目录会被系统清理）。

## 4. 对比维度（写入 comparison.md）

| 维度 | 对比内容 |
| --- | --- |
| 检索主动性 | A 臂是否主动检索、检索了几轮；B 臂的路由选择是否符合其指纹规则 |
| 来源覆盖 | 两臂各自触达的平台/注册中心集合及其差异（A 缺了什么，B 多了什么、有没有 B 也漏掉的） |
| 候选质量 | 两臂候选清单的重合度、各自独有的候选、候选的原始来源（一手页 vs 搜索摘要） |
| 建议与理由 | 两臂最终建议、理由链、可复用方案是否可执行 |
| 时效与事实 | 对时间敏感事实（已停服产品、维护状态）两臂各自如何处理 |
| 澄清质量 | （仅 B 臂适用）技能提问是否 material、是否用日常语言 |
| 内核行为 | （仅 B 臂适用）归一化/去重/排序产物是否正常、warnings 是否合理 |
| 成本（可选） | token/耗时，如环境允许记录 |

## 5. 用例清单与来源覆盖矩阵

| # | Case | 技能 | 模拟用户语言 | B 臂预期覆盖来源 |
| --- | --- | --- | --- | --- |
| 01 | OpenAPI → TS 客户端生成器（已有计划） | compare | en | GitHub、npm、web、Ecosyste.ms、Maven Central（可选） |
| 02 | 给编码 Agent 的网页搜索/浏览 MCP | assess | en | Official MCP Registry、GitHub、web |
| 03 | 中文语音转文字 + 会议纪要（本地） | assess | zh | Hugging Face Hub、arXiv、GitHub、双语 web |
| 04 | 自动整理收藏内容（稍后读，市场未说明） | assess | en | web、Hacker News Algolia、Wikipedia（可选）、产品主页核验 |
| 05 | Rust 极速本地代码/模糊搜索 CLI | assess | en | crates.io、GitHub、web、Ecosyste.ms（可选） |

设计上未覆盖（留待后续补充）：Crossref/OpenAlex（纯学术出版场景）。核验层来源（Jina Reader、Context7、grep.app）不绑定具体 case，任何臂都可能用到，如实记录即可。

## 6. 汇总与发布纪律

- 5 个 case 全部双跑完成后，在 `../results/SUMMARY.md` 汇总跨用例对比结论。
- 任何"插件检索强于默认搜索"的结论必须引用两臂证据与对比表；smoke 数字不得混入。
- 换模型、换工具预算或改内核版本后重测，注明环境并作为新一批快照落档。
