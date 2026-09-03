# Decision — Case 11 B-arm (plugin, compare skill)

- **Session**: `4648c1bf-836c-4ab0-94e4-3a41a1089276`
- **Run Dir**: `C:\Users\QC\AppData\Local\Temp\search-before-build\runs\sbb-compare-20260903-143456-23d7`
- **Rendered Brief**: `C:\Users\QC\AppData\Local\Temp\search-before-build\runs\sbb-compare-20260903-143456-23d7\brief.html`

---

## Final Recommendation (Verbatim Excerpt from Agent Output)

> **Recommendation: Adapt**
> 
> Your current AG2 DeepResearchAgent is a minimal wrapper (~100 lines) around the AG2 framework's built-in agent. Multiple open-source projects provide the specific citation tracking, conflict detection, and workflow features you need. **Adapting one of these is faster and more reliable than building from scratch.**

---

## Reason & Comparison Matrix (Verbatim Excerpt)

> ### Key Capability Gaps
> 
> | Capability | Your Current AG2 | Best Alternative |
> |---|---|---|
> | **Fine-grained citations** | ❌ Unsupported | ✅ scholar-deep-research: per-paper audit trails |
> | **Conflict detection** | ❌ Unsupported | ⚠️ ConflictRAG (needs implementation) |
> | **Resumable workflows** | ❌ Unsupported (max_turns=2) | ✅ tarun7r: LangGraph checkpointing |
> | **Structured reports** | ⚠️ Partial (text only) | ✅ Both: Markdown/HTML output |
> | **Budget control** | ❌ Unsupported | ⚠️ Extensible (LangSmith, shekel, cost-guardrails) |

---

## Recommended Path Forward & Reusable Seams (Verbatim Excerpt)

> 1. **Start with tarun7r/deep-research-agent as your base**
>    - Gets you citation tracking, resumability, and report generation immediately
>    - Python codebase matches yours
>    - LangGraph architecture is extensible
> 
> 2. **Integrate ConflictRAG concepts for your critical conflict detection requirement**
>    - Implement dual-perspective retrieval (query claim + negation)
>    - Add conflict classification before synthesis
>    - Surface contradictions explicitly in reports
> 
> 3. **Add budget controls via existing libraries**
>    - [shekel](https://github.com/arieradle/shekel) for `max_usd` limits
>    - [agent-cost-guardrails](https://github.com/sapph1re/agent-cost-guardrails) for LangGraph integration
> 
> 4. **Consider scholar-deep-research's citation chasing if academic depth matters**
>    - Their federated source approach could supplement web search
>    - Per-paper audit trails provide the rigor you need for investment memos

---

## Most Reusable Option & Biggest Remaining Unknown (Verbatim Excerpt)

> **Most Reusable Option**:
> `tarun7r/deep-research-agent` (LangGraph-based with citation backing and credibility scoring) or `Agents365-ai/scholar-deep-research` (8-phase pipeline with citation chasing).
> 
> **Biggest Remaining Unknown**:
> No surveyed open-source tool explicitly demonstrates conflict detection across contradicting sources in current releases. ConflictRAG provides the research framework (88.7% detection accuracy) but requires significant implementation work to integrate into a production system.
