# Coverage — Case 12 B arm (plugin, compare skill)

## 1. Retrieval Sources & Platform Coverage

| Platform / Source | Status | Detail & Queries |
|---|---|---|
| **Codebase Inspection** | Used | 深入读取 `D:\Learning\Agent\Auto_ML_Agent\build-with-ag2\financial-analysis` 的 `README.md`、`main.py`、`pyproject.toml`、`.env.example`，准确建立基线能力（AG2 多智能体架构、Yahoo Finance 新闻爬虫、yfinance 股价、买卖评级）。 |
| **GitHub REST API** | Used (Anonymous) | 检索 `SEC EDGAR financial statement analysis`、`DCF valuation stock analysis`、`financial analysis agent LLM` 等仓库；深入读取 `yennanliu/InvestSkill` 的元数据与 README。 |
| **SEC EDGAR / Official Filings** | Used | 检索并核查 SEC EDGAR 数据源、XBRL 结构化财报解析工具（`edgartools`）、官方数据接口规范与数据溯源要求。 |
| **Web Search** | Used | 16 轮精准搜索：<br>- `SEC financial statement analysis tool fundamental research`<br>- `stock valuation DCF model tool open source`<br>- `financial statement analysis SEC EDGAR API Python library`<br>- `financial analysis report generator transparency traceable sources`<br>- `美股基本面分析工具 财报数据 估值模型`<br>- `InvestSkill yennanliu Claude financial analysis US stock`<br>- `edgartools Python library SEC EDGAR financial statements`<br>- `"DCF valuation" Python tool streamlit stock fundamental analysis`<br>- `FinChat.io financial analysis AI tool features pricing`<br>- `Simply Wall St financial analysis valuation model review`<br>- `financial analysis report generator traceable data sources Python`<br>- `edgartools Python SEC financial statements source code documentation`<br>- `"alpha vantage" free API fundamental data balance sheet income statement`<br>- `stock fundamental analysis Python tool complete solution GitHub 2025 2026`<br>- `AG2 autogen financial analysis multi-agent framework comparison`<br>- `"data provenance" "audit trail" financial analysis tool source attribution` |
| **npm Registry** | Used | `npm search "financial analysis"` 检索 JS/TS 生态相关金融分析工具包。 |
| **crates.io API** | Used | 查询 `https://crates.io/api/v1/crates?q=financial+analysis` 探测 Rust 金融工具。 |
| **Hugging Face Hub API** | Used | 查询 `https://huggingface.co/api/models?search=financial+analysis` 探测金融分析模型。 |

---

## 2. Coverage Ledger & Multi-Layer Deduplication

- **Baseline Code Analysis**: 识别出目标项目当前仅实现了“Yahoo Finance 新闻爬虫 + yfinance 简单股价拉取 + GPT-4o 摘要生成推荐”，完全缺失三大报表提取、估值模型和可追溯引用。
- **Technical Layer Distinction**:
  - 数据获取层：`edgartools`、Alpha Vantage、SEC 官方 XBRL 接口。
  - 估值计算层：开源 DCF 工具（`dafahentra`、`devc2255`、`EmanueleSturzo`）。
  - 分析报告与技能层：`InvestSkill` 结构化提示词框架。
  - 现成商业产品层：`Fiscal.ai`、`Simply Wall St`。
- **Data Provenance & Traceability**: 严格遵循用户约束（不得黑盒、每个关键数字回到 SEC/官方页面），核实了 `edgartools` 的 XBRL 映射能力与商业 SaaS 的透明度局限。
