# Coverage — Case 11 baseline (A arm)

Summary of evidence-gathering activity from `session.jsonl`.

---

## 1. Retrieval Activity Summary

- **Proactive inspection & search: YES** — The agent immediately inspected the repository code and executed external web searches without requiring user prompts or clarification questions.
- **Tool call counts**:
  - `Bash`: **4 calls** (path check, repository file enumeration, `ls -la`, sibling repo discovery in parent directory).
  - `Read`: **8 calls** (6 files in target repository + 2 files in sibling repositories `ag-ui/gpt-researcher` and `dataroom-research`).
  - `WebSearch`: **6 calls** across AG2 capabilities, open-source alternatives, GPT Researcher architecture, browser-use framework, LangChain Open Deep Research, and OpenAI Deep Research.
  - `Write`: **1 call** (`deep-research-agent-analysis.md`, 15.5 KB structured analysis report written into temporary workdir).
  - **Total tool calls**: **19**.

---

## 2. WebSearch Queries (in chronological order)

1. `AG2 DeepResearchAgent implementation features capabilities 2026`
2. `research agent open source alternatives GPT Researcher Perplexity comparison 2026`
3. `GPT Researcher architecture features citations fact checking implementation 2026`
4. `"browser-use" framework python web scraping agent capabilities 2026`
5. `LangChain Open Deep Research LangGraph implementation features`
6. `OpenAI deep research agent features pricing capabilities compared alternatives 2026`

---

## 3. Local Files Read

### Target Repository (`deep-research-agent`)
1. `D:\Learning\Agent\Auto_ML_Agent\build-with-ag2\deep-research-agent\README.md`
2. `D:\Learning\Agent\Auto_ML_Agent\build-with-ag2\deep-research-agent\main.py`
3. `D:\Learning\Agent\Auto_ML_Agent\build-with-ag2\deep-research-agent\backend.py`
4. `D:\Learning\Agent\Auto_ML_Agent\build-with-ag2\deep-research-agent\frontend.py`
5. `D:\Learning\Agent\Auto_ML_Agent\build-with-ag2\deep-research-agent\pyproject.toml`
6. `D:\Learning\Agent\Auto_ML_Agent\build-with-ag2\deep-research-agent\.env.example`

### Sibling Projects in Parent Directory (`build-with-ag2`)
7. `D:\Learning\Agent\Auto_ML_Agent\build-with-ag2\ag-ui\gpt-researcher\README.md`
8. `D:\Learning\Agent\Auto_ML_Agent\build-with-ag2\dataroom-research\README.md`

---

## 4. Source Platforms & Protocols Touched

| Source Platform | Reached? | Detail |
| --- | --- | --- |
| **Local File System** | Yes | 4 Bash commands, 8 Read operations across target repo and sibling repos |
| **Web Search** | Yes | 6 WebSearch calls covering OSS tools, frameworks, and commercial pricing |
| **GitHub API / REST** | No | No direct GitHub API calls (relied on WebSearch summaries and known GitHub repo links) |
| **arXiv / Academic Search** | No | No direct arXiv API queries |
| **Package Registries (npm / PyPI)** | No | No direct registry API queries |
| **Official Docs** | Partial | Quoted AG2 docs URL and OpenAI announcement URL via search results |
