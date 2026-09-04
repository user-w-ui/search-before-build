# Decision — Case 10 B arm (plugin, compare skill)

## Final Recommendation: **Build**（在现有基础上补充缺口）

### 原文摘录

> 你的项目**已经实现了最有价值的部分**——多智能体编排框架 + 状态机控制 + 质量门控。现有替代方案要么缺少你需要的关键能力，要么是黑盒 AutoML 无法提供编排层。

### 核心结论与理由链

1. **项目已有优势：**
   - 完整的多智能体编排层（AutoGluon/PyCaret 都没有）
   - 状态机控制 + 质量门控（比 AutoKaggle 的线性流程更灵活）
   - 生成可读可调的 Python 代码（黑盒 AutoML 做不到）
   - `run_id` 管理 + 配置快照 + Docker 支持（可复现性保证完善）

2. **识别到的三个核心缺口：**
   - **显式 CV 配置** → 可直接借鉴 `agentic-kaggle-skill` 的 `make_folds.py` 脚本
   - **严谨的本地交叉验证评估追踪** → 参考 `agentic-kaggle-skill` 的 OOF 追踪模式
   - **可靠的 submission.csv 生成与验证** → 采用 `agentic-kaggle-skill` 的 submission endgame 文档和 `AutoKaggle` 的验证逻辑

3. **可复用方案与组件：**
   - **立即可集成**：
     - `agentic-kaggle-skill` 的 `make_folds.py`（补充为配置文件的显式 CV 策略：stratified/group/time-series）
     - `agentic-kaggle-skill` 的 submission 格式验证流程（在 Summarizer 阶段增加）
     - `AutoKaggle` 的 Reader 智能体模式（在 Initializer 阶段解析 Kaggle 竞赛规则）
   - **可选后端替换**：
     - `AutoGluon` 或 `PyCaret`（替换 Model_Trainer 的临时模型选择逻辑）

4. **为何不直接采用现有替代方案：**
   - **AutoKaggle**：架构最接近，但公开文档未明确 CV 配置和 submission 生成细节，需要运行代码验证；且当前项目的状态机灵活性（重试/重规划）更完善。
   - **agentic-kaggle-skill**：不是独立系统，是给 Claude Code/Hermes 用的 skill，不能替代自主编排层。
   - **AutoGluon / PyCaret**：黑盒 AutoML，缺少核心价值（编排层 + 代码透明性）。
