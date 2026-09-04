# Coverage — Case 11 B-arm (plugin) · Deep Research Agent Compare

## 1. Search Coverage Summary (from Brief)

| Source / Platform | Status | Detail |
| --- | --- | --- |
| **GitHub** | used (anonymous REST) | Anonymous REST API: queried repos for `deep research agent citation`, `LangGraph research agent report`, `resumable workflow state checkpoint`. Inspected repos for `tarun7r/deep-research-agent`, `Agents365-ai/scholar-deep-research`, `agentset-ai/agentset`. |
| **Web Search** | used | 13 queries covering AI research assistants, fine-grained citation tracking, conflict detection frameworks, LangGraph checkpointing, cost guardrails, and hosted tool capabilities (Perplexity, Scite, etc.). |
| **arXiv API** | used | Queried `export.arxiv.org/api/query` for deep research agent architectures, citation attribution, and knowledge conflict handling. Retrieved 165 matching papers (e.g. APEx, HypoSearch, DualStake). |
| **Package Registries (npm / PyPI)** | used | Queried npm search and Ecosyste.ms PyPI API for research agent packages and cost guardrail utilities (`shekel`, `agent-cost-guardrails`). |

---

## 2. Actual Executed Search Queries & Commands (Session Ledger)

### GitHub API Queries (curl)
- `https://api.github.com/search/repositories?q=deep+research+agent+citation&per_page=30`
- `https://api.github.com/repos/agentset-ai/agentset`
- `https://api.github.com/repos/tarun7r/deep-research-agent`
- `https://api.github.com/search/repositories?q=LangGraph+research+agent+report&per_page=20`
- `https://api.github.com/repos/Agents365-ai/scholar-deep-research`
- `https://api.github.com/search/repositories?q=resumable+workflow+state+checkpoint&per_page=15`

### WebSearch Queries
- `AI research assistant citation tracking evidence-based reports`
- `open source deep research agent multi-step workflow citation`
- `self-hosted AI research assistant local deployment private documents`
- `agentset.ai open source RAG platform citations deep research`
- `scholar-deep-research Agents365 citation tracking literature review`
- `OpenAI deep research o1 resumable structured output`
- `Perplexity API citations source links research`
- `LangGraph checkpointing persistent state resume workflow`
- `AG2 autogen framework DeepResearchAgent capabilities features`
- `conflict detection multiple sources disagreement AI research tools`
- `LangChain research agent budget control cost limits tokens`
- `site:github.com tarun7r deep-research-agent README features`
- `site:github.com agentset-ai agentset citation tracking self-hosted`

### Academic & Package Registry Queries
- `https://export.arxiv.org/api/query?search_query=all%3A%22deep+research+agent%22+OR+all%3A%22citation+tracking%22&start=0&max_results=5&sortBy=submittedDate&sortOrder=descending`
- `npm search "research agent" --json --searchlimit=10`
- `https://packages.ecosyste.ms/api/v1/registries/pypi.org/packages?per_page=10&page=1`

---

## 3. Decision Kernel Execution Summary

- **Retrieval requests submitted**: 6 requests (host-web: 4, github: 1, arxiv: 1)
- **Failed requests**: 0
- **Normalized records**: 19 records
- **Unique candidates scored**: 19
- **Returned candidates**: 8
- **Duplicate observations merged**: 0 (conservative identity rules preserved distinctive web/repo records)
- **Must-have capability coverage**:
  - `fine-grained citation tracking with source links and dates`: candidate mention (`scholar-deep-research`)
  - `conflict detection across sources`: candidate mention (`ConflictRAG`)
  - `resumable multi-step workflows`: candidate mention (`LangGraph Checkpointing`)
  - `structured report output`: missing candidate mention in heuristic matcher (agent manually verified in brief)

---

## 4. Case Expectation vs Actual Observation

| Source | Case Requirement | Observed in Session |
| --- | --- | --- |
| **GitHub** | must | Yes — Anonymous REST API for baseline and candidate repos |
| **Web** | must | Yes — WebSearch across hosted products, capabilities, and frameworks |
| **arXiv / Papers with Code** | should | Yes — Direct arXiv API call + ConflictRAG / LLM conflict research |
| **npm / PyPI** | should | Yes — Searched package registries for guardrails and agent packages |
| **Official Docs** | must | Yes — LangGraph, Scite, Perplexity docs verified |
