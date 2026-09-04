# Candidates — Case 12 B arm (plugin, compare skill)

Session run dir: `C:\Users\QC\AppData\Local\Temp\search-before-build\runs\20260903T070024-1d17`  
Sources: Final CLI response, decoded brief payload (`artifacts/brief.html.decoded.json`), and decision kernel output (`artifacts/kernel-output.json`).

---

## 1. Evaluated Competitors & Alternatives (Decoded Report Payload)

| Candidate | URL | Category | Assessment & Recommendation Reason |
|---|---|---|---|
| **edgartools** | https://github.com/dgunning/edgartools | 可复用 Python 库 | 最成熟的 Python SEC EDGAR 数据访问库（PyPI 月下载量超 100 万次），提供简洁 API 原生解析三大财务报表与 20+ 种 SEC 文件类型（10-K/10-Q 等），每个数据点天然支持回溯至 SEC 文件与日期。作为财报数据层首选。 |
| **InvestSkill** | https://github.com/yennanliu/InvestSkill | 可复用 LLM 技能框架 | 为 LLM 设计的 26 个结构化美股分析框架库，支持技能串联（10-K 摘要 → 基本面分析 → DCF 估值 → 熊市分析），跨 Claude Code/Cursor 等平台无运行时依赖运行。适合作为分析方法论与透明报告结构的参考实现。 |
| **开源 DCF 估值工具集 (dcf-tools)** | https://github.com/dafahentra/dcf-valuation-tool | 可复用 Python 工具 | 包含 `dafahentra/dcf-valuation-tool`、`devc2255/Institutional-Intrinsic-Valuation-Engine`、`EmanueleSturzo/DCF-Valuation-Model` 等开源估值模型。原生支持 5 年 DCF、WACC 自动化、敏感性分析与蒙特卡洛模拟，假设完全透明可定制。 |
| **Fiscal.ai (原 FinChat.io)** | https://fiscal.ai/ | 现成商业 SaaS | AI 驱动的投资研究平台，覆盖 10 万+ 全球上市公司财务数据。但属于商业收费产品（64 美元/月），估值模型存在黑盒化风险，数据溯源细粒度未知，不符合个人完全透明可复核诉求。 |
| **Simply Wall St** | https://simplywall.st/ | 现成商业产品 | 面向视觉化投资者的基本面分析平台（120 美元/年），内置 DCF 估值但模型假设透明度有限，不可自由调整底层计算逻辑与数据出处。 |

---

## 2. Decision Kernel Top Candidates (`kernel-output.json`)

| Rank | Identifier / Name | Kind | Final Score | Matched Capabilities / Explanations |
|---|---|---|---|---|
| 1 | `pkg:npm/dsh-financial-analysis` | package | 0.6950 | Strong lexical fit with functional fingerprint |
| 2 | `github:yennanliu/investskill` | repo | 0.6698 | GitHub repo observation, US stock analysis skills |
| 3 | `Fiscal.ai (formerly FinChat.io)` | web | 0.6277 | Matched `生成结构化报告整合数字、假设和来源` |
| 4 | `edgartools Python library` | web | 0.5898 | Matched `自动获取SEC财报数据并标注出处与日期` |
| 5 | `Simply Wall St` | web | 0.5487 | Matched `透明可复核的估值模型计算` |
| 6 | `dafahentra/dcf-valuation-tool` | web | 0.5362 | Web observation for DCF Streamlit valuation engine |
| 7 | `SEC Financial Statement Data Sets` | web | 0.4475 | Official SEC XBRL data portal |
| 8 | `EmanueleSturzo/DCF-Valuation-Model` | web | 0.4475 | Web observation for 5-year DCF Monte Carlo model |

---

## 3. Other Tools & Repositories Identified in Research

- **SEC Financial Statement Data Sets** (https://www.sec.gov/data-research/financial-statement-data-sets): SEC 官方 XBRL 结构化财报数字数据集。
- **SEC-API.io** (https://sec-api.io/): 商业 SEC 报表与文件全文检索 API。
- **Alpha Vantage** (https://www.alphavantage.co/): 提供免费额度的美股基础面报表（资产负债表、利润表、现金流量表）与行情 API。
- **devc2255/Institutional-Intrinsic-Valuation-Engine** (https://github.com/devc2255/Institutional-Intrinsic-Valuation-Engine): 基于 Streamlit 和 yfinance 的多阶段 DCF 估值引擎。
- **EmanueleSturzo/DCF-Valuation-Model** (https://github.com/EmanueleSturzo/DCF-Valuation-Model): 5 年期 DCF 模型，带蒙特卡洛情景分析。
