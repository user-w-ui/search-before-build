# Candidates — Case 11 baseline (A arm)

Candidates the agent mentioned in its final answer and in its generated report (`deep-research-agent-analysis.md`), along with its characterization.

---

## 1. Primary Open-Source & Sibling Candidates

| Candidate | URL / Location | Agent's Characterization |
| --- | --- | --- |
| **GPT Researcher** | https://github.com/assafelovic/gpt-researcher | "Most mature, 95.2% DOI accuracy, 20+ page reports from hundreds of PDFs, academic database integration (Semantic Scholar, arXiv), multiple research cycles, retrieval-augmented fact-checking, production-ready. Available as ChatGPT Deep Research backend." **Primary recommendation for adaptation.** |
| **Sibling project: `ag-ui/gpt-researcher`** | `D:\Learning\Agent\Auto_ML_Agent\build-with-ag2\ag-ui\gpt-researcher` | "Significantly more advanced: 7-stage pipeline (Chief Editor → Editor → Researcher → Reviewer → Revisor → Writer → Publisher), real-time streaming UI via AG-UI protocol, state snapshots for progress tracking, already 60% complete." |
| **LangChain Open Deep Research** | https://github.com/langchain-ai/open-deep-research | "Built on LangGraph, three-phase supervisor pattern (Scope → Research → Write), multi-provider support, MCP integration, customizable models/prompts/report structure, state persistence via checkpointing, fine-grained deterministic + agentic workflow mixing. Highly customizable." |
| **Stanford STORM** | Academic project (no URL given) | "Academic research focus, focus on scholarly literature, structured knowledge synthesis." |
| **Sibling project: `dataroom-research`** | `D:\Learning\Agent\Auto_ML_Agent\build-with-ag2\dataroom-research` | Sibling research agent project in parent directory inspected via Read tool. |

---

## 2. Hosted / Commercial Alternatives

| Candidate | URL / Provider | Pricing / Features / Assessment |
| --- | --- | --- |
| **OpenAI Deep Research** | https://openai.com/index/introducing-deep-research/ | "$200/mo unlimited or $20/mo for 10 queries. 40+ sources, 1M+ tokens, API available ($10/$40 per million tokens). Best for ChatGPT Pro users." |
| **Google Gemini Deep Research** | Google One AI Premium | "~$20/mo (best value). Gmail/Drive/Docs integration, 54.6% on Humanity's Last Exam. Best for Google Workspace users." |
| **Perplexity Deep Research** | Perplexity AI | "$200/mo unlimited (free tier available). Similar to OpenAI, cost-conscious users." |
| **Claude Max (Research)** | Anthropic | "$100/mo bundled with Claude Code/Codex, $1.30-$1.54/task. Best for developers." |
| **Elicit 2.0** | Elicit | "$12/mo (student). Academic focus, predictable pricing. Best for researchers, students." |

---

## 3. Underlying Libraries & Frameworks Evaluated

| Component | Provider / Ecosystem | Assessment |
| --- | --- | --- |
| **AG2 DeepResearchAgent** | `ag2[browser-use,openai]` (https://docs.ag2.ai/docs/blog/2025-02-13-DeepResearchAgent/index) | Underlying framework for target repo. Provides browser-use integration, dynamic tool calling, 128k context, structured report generation. However, current target repo only wraps `.run(max_turns=2)` without custom logic. |
| **browser-use framework** | Python library (79,000+ stars) | "Autonomous web interaction via Chromium CDP. Excellent technology, but target implementation adds no custom automation logic beyond AG2 wrapper." |

---

## Comparison vs Case Expectations

- **Code-backed baseline**: Yes, inspected all 6 files in target repo (`README.md`, `main.py`, `backend.py`, `frontend.py`, `pyproject.toml`, `.env.example`).
- **Open-source alternatives**: GPT Researcher, LangChain Open Deep Research, Stanford STORM.
- **Hosted alternatives**: OpenAI Deep Research, Gemini Deep Research, Perplexity, Claude Max, Elicit 2.0.
- **Fact-checking and citation**: Focused on GPT Researcher's 95.2% DOI accuracy claim and RAG cross-validation.
- **Local / Sibling discovery**: Discovered and evaluated user's existing `ag-ui/gpt-researcher` sibling repo on local disk.
