# Candidates — Case 10 baseline (A arm)

Candidates mentioned by the agent in its evaluation text and recommendations. All URLs listed below are those directly provided by the agent in its response; missing URLs are explicitly noted.

| Candidate | URL given by agent | Agent's characterization & category |
| --- | --- | --- |
| **AutoGluon** | https://auto.gluon.ai/ | **AutoML framework**: "4 小时训练击败 99% Kaggle 参赛者，自动集成学习"; primary recommendation to replace `Model_Trainer` (`AutoGluon TabularPredictor`, MIT license). |
| **ydata-profiling** | https://github.com/ydataai/ydata-profiling | **EDA / Profiling**: "专业级 EDA，HTML 报告"; recommended to immediately replace `Data_Explorer` (MIT license). |
| **MLflow** | https://mlflow.org/ | **Experiment tracking**: "实验对比、模型注册、部署集成，标准化实验管理"; recommended to replace `jobs/status.py + events.py` (Apache 2.0 license). |
| **Prefect** | https://www.prefect.io/ | **Workflow orchestration**: "13.8M+ 月下载，事件驱动，混合架构，可视化、容错、可扩展"; recommended to replace `workflow/app.py` hardcoded state machine (Apache 2.0 license). |
| **FLAML** | (none) | **AutoML / HPO**: "平均 PI score 0.7848，快速超参数优化"; mentioned as an alternative candidate for tabular AutoML / tuning. |
| **H2O AutoML** | (none) | **AutoML framework**: "企业级稳定性，开箱即用"; evaluated as a mature enterprise competitor. |
| **Weights & Biases (WandB)** | (none) | **Experiment tracking**: "实时可视化、超参数 sweep、团队协作"; commercial SaaS alternative to local file tracking. |
| **Metaflow** | (none) | **ML orchestration**: "专为 ML 设计，Netflix 开源"; competitor to AG2 custom state machine. |
| **Airflow** | (none) | **Workflow orchestration**: "行业标准"; mature workflow orchestrator. |

---

## Ecosystem Analysis and Mapping

1. **Target Codebase Grounding**:
   - The agent deeply inspected `D:\Learning\Agent\Auto_ML_Agent\build-with-ag2\automate-ml-for-kaggle`.
   - Identified architectural facts: AG2 multi-agent group chat (`app.py`), custom speaker selection, 5 role prompts in `prompts.py` (`Data_Explorer`, `Data_Processer`, `Model_Trainer`, `Evaluator`, `Code_Summarizer`), file-system state tracking in `jobs/`, configuration in `configs/example.yaml`, and 4 Markdown model cards in `kb/`.
2. **Retrieval Depth**:
   - 3 WebSearch queries covered Kaggle AutoML, experiment tracking, and ML workflow orchestration.
   - 4 candidates received direct canonical URLs (`ydata-profiling`, `AutoGluon`, `MLflow`, `Prefect`).
   - 5 candidates (`FLAML`, `H2O AutoML`, `Weights & Biases`, `Metaflow`, `Airflow`) were characterized from search snippets and parametric model knowledge without URLs.
3. **Reusability & Substitution Recommendations**:
   - **Data Exploration**: Replace custom agent prompt with `ydata-profiling`.
   - **Model Training**: Replace manual sklearn/lgbm script generation with `AutoGluon TabularPredictor`.
   - **Experiment Tracking**: Replace folder-based JSON logs with `MLflow Tracking`.
   - **Orchestration**: Replace AG2 state machine with `Prefect`.
