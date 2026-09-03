# Coverage — Case 12 baseline (A arm)

What the agent actually did to gather evidence (from session.jsonl transcript).

## Retrieval activity summary

- **Proactive external search**: **NO** — 0 external WebSearch, 0 WebFetch, 0 API queries.
- **Repository Codebase Inspection**: **YES** — 2 Bash file discovery operations + 4 Read operations directly reading `README.md`, `main.py`, `pyproject.toml`, and `.env.example` from `D:\Learning\Agent\Auto_ML_Agent\build-with-ag2\financial-analysis`.
- **Local Artifact Creation**: 1 Write operation creating `financial_analysis_evaluation.md` in the temporary work directory.
- **Total tool calls**: 7 (Bash: 2, Read: 4, Write: 1).

## Source platforms touched

- **Target Repository (Local File System)**: 6 operations reading and analyzing code files.
- **GitHub REST API / Public Repos**: NOT touched (0)
- **SEC EDGAR / Official Financial API Portals**: NOT touched (0)
- **PyPI / npm Registries**: NOT touched (0)
- **Web Search Engines**: NOT touched (0)

## Data Quality & Grounding

- **Target Code Facts**: High precision. The agent extracted the exact hardcoded year line (`if "2025" in news_modifiedDate:`), identified the unverified SSL scraping endpoint (`ca.finance.yahoo.com/_finance_doubledown`), identified GPT-4o dynamic code generation risks for price calculation, and recognized the lack of financial statement parsing.
- **Competitor / External Evidence**: Low grounding. Candidates were cited by name from model memory without URLs, live status checks, or license verification.
