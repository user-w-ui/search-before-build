# Candidates — Case 11 B-arm (plugin) · Deep Research Agent Compare

From the decision kernel ranking (`kernel-output.json`), decoded brief payload (`brief.html`), and final CLI response.

---

## 1. Primary Deep-Dive Competitors (from Decoded Brief)

| Name | URL | Category | Characterization & Assessment |
| --- | --- | --- | --- |
| **tarun7r/deep-research-agent** | https://github.com/tarun7r/deep-research-agent | Adaptable open-source project | Production-ready multi-agent system using LangGraph and LangChain. 4 specialized collaborative agents (planning, searching, analyzing, synthesizing). Native citation-backed reports with credibility scoring; built-in LangGraph checkpointing for pause/resume. Python codebase. MIT license (~184 stars). Top recommendation for adaptation. |
| **Agents365-ai/scholar-deep-research** | https://github.com/Agents365-ai/scholar-deep-research | Adaptable open-source project | Academic literature review system with an 8-phase pipeline (Discovery → Ranking → Retrieval → Citation chasing → Analysis → Self-critique → Synthesis → Reporting). Best-in-class citation infrastructure with per-paper audit trails, enforced citation anchoring, and 7 federated sources. MIT license (~26 stars, Apr 2026). Academic focus requires adaptation for general web research. |
| **Agentset** | https://github.com/agentset-ai/agentset | Adaptable open-source RAG platform | Comprehensive RAG platform supporting 22+ file formats, partition systems for private data boundaries, native citation chunk linking, and MCP server. TypeScript (~2,079 stars). Best component for the future private company document requirement. |
| **ConflictRAG (Research Framework)** | https://arxiv.org/search/?query=ConflictRAG | Reusable research component | Academic framework for conflict-aware RAG. Detects, classifies, and resolves knowledge conflicts with 88.7% F1 score using dual-perspective retrieval (querying claim + negation). Critical design pattern to integrate into the pipeline; requires custom implementation. |
| **LangGraph Checkpointing** | https://langchain-ai.github.io/langgraph/ | Reusable framework component | Built-in persistence layer saving graph state at every node transition; thread-based resume with `thread_id`. Satisfies long-running resumable research requirement (already used in tarun7r). |

---

## 2. Kernel-Ranked Candidates (Kernel Top 8)

| Rank | Identifier / Name | Kind | Final Score | Matched Capabilities / Notes |
| --- | --- | --- | --- | --- |
| 1 | `tarun7r/deep-research-agent` | repo | 0.8795 | Strong lexical fit, GitHub repo observation |
| 2 | `ConflictRAG` | web | 0.7170 | Matched `conflict detection across sources` |
| 3 | `deep-research-agent (tarun7r)` | web | 0.7990 | Web observation for tarun7r |
| 4 | `Conflicts Benchmark` | web | 0.6718 | Web observation for LLM conflict benchmarking |
| 5 | `Agents365-ai/scholar-deep-research` | repo | 0.6388 | GitHub repo observation for academic literature agent |
| 6 | `LangGraph Checkpointing` | web | 0.4622 | Matched `resumable multi-step workflows` |
| 7 | `scholar-deep-research (Agents365-ai)` | web | 0.5292 | Matched `fine-grained citation tracking with source links and dates` |
| 8 | `APEx: Distillation of Agent Procedural Experience...` | paper | 0.4773 | Recent arXiv research on adaptive deep research QA (2026-09-02) |

---

## 3. Additional Products & Academic Papers Evaluated

- **Hosted AI Research Platforms**:
  - `Scite` (https://scite.ai) — Smart citations classifying supporting vs. contradicting citations.
  - `Consensus` (https://consensus.app) — Evidence-weighted academic literature synthesis.
  - `Elicit` (https://elicit.com) — Literature review matrices.
  - `NotebookLM` — Document-grounded source notes.
  - `Perplexity` (https://docs.perplexity.ai) — Real-time web search with source links (evaluated against private boundary constraint).
- **Cost & Guardrail Components**:
  - `shekel` (https://github.com/arieradle/shekel) — Python token/cost limit guardrail.
  - `agent-cost-guardrails` (https://github.com/sapph1re/agent-cost-guardrails) — LangGraph cost controls.
- **Academic Research (arXiv)**:
  - `APEx` (arXiv:2026-09-02) — Procedural experience for deep research agents.
  - `HypoSearch / Explore Before Committing` (arXiv:2026-09-01) — Hypothesis-guided search branches.
  - `DualStake` (arXiv:2026-09-01) — Dual-path confidence calibration.
