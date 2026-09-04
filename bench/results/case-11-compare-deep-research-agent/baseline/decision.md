# Decision — Case 11 baseline (A arm)

---

## 1. Final Recommendation (Verbatim from Assistant Output)

> ## Bottom Line: **Not Worth Continuing Development**
>
> Your current implementation is a ~100-line wrapper around AG2's `DeepResearchAgent` with a basic Streamlit UI. It's missing critical features that production research tools require:
>
> - ❌ No research planning or task decomposition
> - ❌ No citation management or verification
> - ❌ No fact-checking or cross-source validation
> - ❌ No state persistence or resume capability
> - ❌ Limited to 2 turns (not really "deep" research)
>
> ## Key Finding: You Already Have Something Better
>
> **Your sibling project `ag-ui/gpt-researcher`** is significantly more advanced:
> - 7-stage pipeline (Chief Editor → Editor → Researcher → Reviewer → Revisor → Writer → Publisher)
> - Real-time streaming UI with progress tracking
> - Proper integration with GPT Researcher (95.2% citation accuracy)
> - Production-ready architecture
>
> ...
>
> ## Recommended Path: Adapt GPT Researcher
>
> **Why:**
> - Your `ag-ui/gpt-researcher` is already 60% complete
> - GPT Researcher is battle-tested and production-ready
> - 2-4 weeks to meaningful extensions vs. 12-16 weeks rebuilding basics
>
> **Differentiation Opportunities:**
> 1. **Vertical specialization** - Finance, healthcare, legal research workflows
> 2. **Enterprise features** - SSO, audit logs, compliance tracking
> 3. **Team collaboration** - Shared workspaces, annotations, review workflows
> 4. **Advanced fact-checking** - Confidence scoring, source reputation weighting
> 5. **Hybrid search** - Combine web + private document stores
>
> ## What to Salvage: Almost Nothing
>
> The FastAPI + Streamlit pattern is reusable but trivial. Everything else is too basic. The browser-use framework integration is good technology, but you're not adding any custom logic beyond what AG2 provides.
>
> ...
>
> **My recommendation: Archive this project and invest your time extending the `ag-ui/gpt-researcher` implementation with domain-specific capabilities that differentiate you from generic research tools.**

---

## 2. Reasoning Chain Observed

1. **Local Repository Inspection**: Checked `deep-research-agent` structure and code. Found only 35 lines of actual logic (`main.py` 40 lines, `backend.py` + `frontend.py` 59 lines), wrapping AG2's experimental `DeepResearchAgent` with a hardcoded `max_turns=2` and no custom tools/logic.
2. **Local Context Discovery**: Explored parent directory `D:\Learning\Agent\Auto_ML_Agent\build-with-ag2` and identified existing sibling implementations (`ag-ui/gpt-researcher` and `dataroom-research`).
3. **Web Search on Alternatives**: Searched for AG2 capabilities, open-source leaders (GPT Researcher, LangChain Open Deep Research, Stanford STORM), and hosted pricing (OpenAI, Gemini, Perplexity, Claude Max, Elicit).
4. **Comprehensive Analysis Report**: Generated a 15.5 KB structured document `deep-research-agent-analysis.md` detailing technical comparison matrices, browser-use integration assessments, reusable components, decision matrices, and an estimated effort of 11-17 weeks to rebuild vs 2-4 weeks to extend GPT Researcher.
5. **Clear Actionable Call**: Recommend **Adapt** (specifically advising to adapt GPT Researcher / extend the existing `ag-ui/gpt-researcher` sibling project).

---

## 3. Observations & Comparison Notes

- **Clarification Stage**: The baseline agent did **not** ask any clarifying questions from the Case 11 clarification script; it directly analyzed the repository and made its recommendation based on general deep-research requirements.
- **Code-backed Baseline**: Strong code inspection of the target repo and local sibling projects.
- **Seams & Adaptability**: Accurately identified that the target repo provides almost no reusable novel logic beyond a trivial FastAPI/Streamlit wrapper, and pointed to concrete architecture paths for adaptation.
- **Citation & Verification**: Relied on public benchmark claims (e.g. GPT Researcher 95.2% DOI accuracy) via search rather than deep paper retrieval.
