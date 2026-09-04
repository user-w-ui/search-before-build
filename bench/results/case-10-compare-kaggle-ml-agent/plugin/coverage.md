# Coverage — Case 10 B arm (plugin, compare skill)

## Retrieval Sources & Platforms

| Platform / Source | Status | Detail & Queries |
|---|---|---|
| **GitHub REST API** | Used | 检索 `kaggle automation agent OR kaggle workflow OR autokaggle`、`multi-agent automl OR llm data science workflow`；抓取 `AutoKaggle`、`agentic-kaggle-skill`、`kaggle-Agent`、`autogluon`、`pycaret`、`FLAML`、`tpot` 仓库详情及 README。 |
| **PyPI API** | Used | 查询 `autogluon`、`pycaret`、`flaml`、`h2o` 的分发元数据与维护状态。 |
| **arXiv API** | Used | 检索 `all:multi-agent AND all:automated machine learning` 以及 `ti:AutoKaggle OR ti:"multi-agent" AND ti:AutoML` 论文（含 AutoKaggle 论文 `arXiv:2410.20424`）。 |
| **Hugging Face Hub** | Used | 检索 `https://huggingface.co/api/models?search=automl`。 |
| **Web Search** | Used | 中英文多轮检索：<br>- `Kaggle automated workflow tabular ML local reproducible`<br>- `multi-agent AutoML code generation orchestration`<br>- `Kaggle competition automation cross-validation submission generation`<br>- `AutoKaggle multi-agent framework GitHub`<br>- `LLM agent data science workflow code generation local`<br>- `AutoML 多智能体 自动化工作流 本地运行`<br>- `Kaggle 自动化 交叉验证 提交文件生成`<br>- `AutoKaggle arxiv paper multi-agent framework`<br>- `AutoGluon Kaggle tabular AutoML local`<br>- `PyCaret AutoML pipeline tabular local`<br>- `H2O AutoML local cross-validation reproducible`<br>- `FLAML AutoML Microsoft local tuning`<br>- `TPOT AutoML pipeline code generation genetic programming`<br>- `AutoKaggle cross-validation submission generation reproducibility`<br>- `AutoGluon cross-validation configuration reproducible seed`<br>- `PyCaret cross-validation fold configuration save pipeline reproducible`<br>- `agentic-kaggle-skill cross-validation OOF prediction submission` |
| **Direct WebFetch** | Used | 抓取 `https://github.com/FrankS-IntelLab/agentic-kaggle-skill` 与 `https://github.com/multimodal-art-projection/AutoKaggle`。 |

## Coverage Ledger Summary

- **Codebase Baseline**: 直接读取了 `automate-ml-for-kaggle` 的文件结构、`pyproject.toml`、`README.md`、`configs/kaggle.yaml`、`Auto_ML demo.ipynb` 及 `runs/` 历史记录，提取出 5 个智能体、状态机流转与目前缺失的显式 CV 配置/submission 逻辑。
- **Cross-Layer Deduplication**: 准确区分了“智能体编排层”（自身项目、AutoKaggle、agentic-kaggle-skill）与“底层 AutoML 搜索/特征引擎”（AutoGluon、PyCaret、FLAML），未发生跨层误判。
- **Offline / Constraint Verification**: 明确核验了 AutoGluon / PyCaret / FLAML 的完全离线本地运行能力，以及 AutoKaggle / agentic-kaggle-skill 对 LLM API 的依赖。
