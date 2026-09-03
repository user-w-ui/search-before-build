# Candidates — Case 10 B arm (plugin, compare skill)

Session run dir: `C:\Users\QC\AppData\Local\Temp\search-before-build\runs\20260903_063435_vvr95d`
Sources: Final CLI response + decoded report payload (`artifacts/brief.html`).

## Evaluated Competitors & Alternatives (Report Payload)

| Candidate | URL | Category | Assessment / Reason |
|---|---|---|---|
| **AutoKaggle** | https://github.com/multimodal-art-projection/AutoKaggle | 多智能体 Kaggle 自动化系统 | 最接近的开源多智能体框架，5 智能体 6 阶段流水线，达到 0.85 validation submission rate；但公开文档未明确 CV 配置和 submission.csv 生成细节，状态机灵活性不如当前项目。 |
| **agentic-kaggle-skill** | https://github.com/FrankS-IntelLab/agentic-kaggle-skill | AI Agent Kaggle 比赛 Skill | 不是独立编排系统，而是 Claude Code/Hermes 的 skill；但包含经过实战验证的 `make_folds.py`、OOF 追踪模式和 submission endgame 校验文档，是最佳直接复用来源。 |
| **AutoGluon** | https://auto.gluon.ai/ | 经典 AutoML 库 | 头部开源 AutoML 库，多模型集成与堆叠效果好；但属于黑盒 AutoML，不提供多智能体编排层和可读代码生成，可作为 Model_Trainer 的可选后端。 |
| **PyCaret** | https://pycaret.org/ | 低代码 AutoML 平台 | 低代码 AutoML 平台，原生支持显式 fold 配置和 CV 指标追踪，但仍为流水线黑盒；可作为数据预处理和模型搜索的参考后端。 |
| **FLAML** | https://github.com/microsoft/FLAML | 轻量级 AutoML 库 | 微软轻量高效超参数调优库，功能范围局限于模型搜索与调优，无法替代端到端编排系统。 |

## Other Candidates & Projects Seen in Research

- **kaggle-Agent** (https://github.com/MSNP1381/kaggle-Agent): LLM 驱动的 Kaggle 挑战自动化项目，基于智能体规划与代码生成。
- **H2O AutoML** (https://pypi.org/project/h2o/): 企业级成熟黑盒 AutoML 解决方案。
- **TPOT** (https://github.com/EpistasisLab/tpot): 基于遗传规划的 scikit-learn 流水线优化库。
- **LuciferML** (https://github.com/d4rk-lucif3r/LuciferML): 半自动化机器学习库。
- **repo2nb-cli** (https://github.com/repo2nb/repo2nb-cli): 代码上传并转换 Kaggle/Colab Notebook 的轻量 CLI 工具。
