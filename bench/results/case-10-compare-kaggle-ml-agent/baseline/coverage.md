# Coverage — Case 10 baseline (A arm)

## Target Repository Inspection Coverage

- **Target Material Path**: `D:\Learning\Agent\Auto_ML_Agent\build-with-ag2\automate-ml-for-kaggle`
- **Path Verification**: Verified via PowerShell `Test-Path -LiteralPath` (`True`).
- **Scoping & Anti-Pollution**:
  - The agent confined all filesystem and code inspection commands strictly within `D:\Learning\Agent\Auto_ML_Agent\build-with-ag2\automate-ml-for-kaggle` and its direct subdirectories (`src/`, `configs/`, `kb/`).
  - No parent directory traversal (`..`, `../..`) occurred.
  - No search or reading occurred within `D:\Learning\BrainStorming\should-i-build\bench`, `bench\workdirs`, `bench\results`, or the temporary execution workdir.
- **Files Read & Inspected**:
  | File Path | Description / Key Evidence Extracted |
  | --- | --- |
  | `automate-ml-for-kaggle\README.md` | Architecture, state machine states (`EXPLORE`, `PREPROCESS`, `TRAIN`, `EVALUATE`, `REPLAN`, `HUMAN_REVIEW`, `DONE`, `FAILED`), code execution backends (`local-jupyter`, `docker-jupyter`). |
  | `automate-ml-for-kaggle\pyproject.toml` | Dependencies: `ag2>=0.11.2`, `kagglehub`, `scikit-learn`, `xgboost`, `lightgbm`, `catboost`, `pydantic`, `typer`. |
  | `automate-ml-for-kaggle\src\workflow\app.py` | Implementation of AG2 GroupChat orchestration, speaker selection, and state transitions. |
  | `automate-ml-for-kaggle\src\agent\prompts.py` | System prompts defining roles for `Data_Explorer`, `Data_Processer`, `Model_Trainer`, `Evaluator`, and `Code_Summarizer`. |
  | `automate-ml-for-kaggle\configs\example.yaml` | Execution configurations, LLM model definitions, timeout and retry limits. |
  | `automate-ml-for-kaggle\kb\ml_model_cards_for_rag.md` | RAG reference knowledge cards on standard machine learning models. |
  | `automate-ml-for-kaggle\src\workflow\controller.py` | State machine transition control logic and gate checks. |

---

## External Retrieval Coverage

| Category | Reached | Details |
| --- | --- | --- |
| **Web Search** | **Yes** (3 queries) | 1. `Kaggle AutoML tools 2026 popular frameworks H2O AutoGluon FLAML`<br>2. `Kaggle experiment tracking MLflow Weights Biases wandb 2026`<br>3. `Kaggle workflow orchestration Prefect Airflow Metaflow 2025 2026` |
| **Web Fetch (HTTP)** | **No** (0 calls) | The agent evaluated candidates using WebSearch snippets and internal knowledge without making direct HTTP page fetches. |
| **GitHub REST / API** | **No** (0 calls) | No GitHub MCP or anonymous GitHub API calls; 1 GitHub URL (`ydataai/ydata-profiling`) was surfaced via search snippet/memory. |
| **PyPI Registry** | **No** (0 calls) | No direct PyPI JSON API calls; package availability inferred from search snippets. |
| **Kaggle Official Docs / API** | **No** (0 calls) | Recognized `kagglehub` in `pyproject.toml`, but did not query Kaggle API or discussion boards. |
| **Academic / arXiv** | **No** (0 calls) | No academic paper search performed. |

---

## Coverage Assessment

1. **Local Baseline Discovery**: High depth. The agent inspected 7 core files and 5 directory listings, gaining an accurate understanding of the project's real code status (not just README claims).
2. **External Breadth**: Moderate. Reached major tool categories (AutoML, Tracking, Orchestration) via 3 targeted web search queries, identifying 9 relevant industry and open-source tools.
3. **Primary-source Verification**: Low. Only 4 out of 9 candidates had canonical URLs provided in the response; no deep fetch was performed to audit commit recency or release notes.
