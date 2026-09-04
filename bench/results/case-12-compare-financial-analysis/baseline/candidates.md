# Candidates — Case 12 baseline (A arm)

Candidates mentioned by the agent in its evaluation text or generated report `financial_analysis_evaluation.md`.

| Candidate | URL given by agent | Agent's characterization |
| --- | --- | --- |
| SEC EDGAR API | (none) | "建议数据源: SEC EDGAR API (免费, 美股) - 基本面分析的基础" |
| Tushare API / 聚宽 | (none) | "建议数据源: 聚宽/Tushare API (A股)" |
| Backtrader | (none) | "开源量化框架: Backtrader - 可靠的金融分析替代方案" |
| Zipline | (none) | "开源量化框架: Zipline - 策略与量化回测" |
| vnpy | (none) | "开源量化框架: vnpy - 国内成熟开源交易/量化框架" |
| Polygon.io | (none) | "数据 API + 自建: Polygon.io + pandas + 自定义策略" |
| Bloomberg Terminal / Wind / FactSet | (none) | "专业工具: 实时数据流 + 深度基本面 + 固定公式 + 审计日志，月费 $2000+" |

## Ecosystem and Gap Analysis

- **Target codebase inspection**: The agent correctly accessed `D:\Learning\Agent\Auto_ML_Agent\build-with-ag2\financial-analysis`, accurately identified its 208-line single-file AG2 implementation (`main.py`), and analyzed its code facts: Yahoo Finance scraping (`ca.finance.yahoo.com`), hardcoded `if "2025" in news_modifiedDate:`, yfinance price extraction, and GPT-4o dynamic code generation for technical price calculations.
- **External Discovery**: 0 external retrieval operations (0 WebSearch, 0 WebFetch). All mentioned candidates (SEC EDGAR, Tushare, Backtrader, Zipline, vnpy, Polygon.io, Bloomberg, Wind) were generated from parametric model memory without URLs or live maintenance/pricing verification.
- **Contrast with B arm**: The plugin arm actively retrieved and evaluated specific modern Python libraries and skills (`edgartools`, `InvestSkill`, `dcf-valuation-tool`, `Fiscal.ai / FinChat.io`) with exact GitHub links, licensing, and commit activity.
