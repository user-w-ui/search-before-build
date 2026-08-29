# Coverage — Case 05 B-arm (plugin) · Rust code search CLI

## Brief's coverage array (verbatim from decoded brief)

| Source | Status | Detail |
| --- | --- | --- |
| GitHub | used | Anonymous REST API: repo search + READMEs for ast-grep, ripgrep, comby, probe. No authenticated gh CLI or GitHub MCP available. |
| crates.io | used | Searched fuzzy matcher, tree-sitter, gitignore, and grep library crates; verified ignore and grep-searcher download counts. |
| Primary project pages | used | Fetched ast-grep.github.io and the nucleo README for capability verification. |
| Generic web search | limited | Returned no usable results; specialized routes (GitHub API, crates.io, primary pages) carried the evidence. |

## Actual queries observed in transcript (curl commands)

- GitHub search repos: `https://api.github.com/search/repositories?...` (code search cli)
- GitHub raw READMEs: ast-grep, ripgrep, probe, semble_rs (`Accept: application/vnd.github.raw+json`)
- crates.io: `?q=code search&per_page=8&sort=downloads`, `?q=fuzzy matcher&per_page=6`, `?q=grep&per_page=10`
- WebFetch: ast-grep.github.io (structural/regex/fuzzy/language/binaries), nucleo README (library vs CLI, fuzzy, users)
- WebSearch: "ripgrep vs ast-grep vs fzf code search CLI comparison 2025" — no usable results
- Capability check: `gh --version` / `gh auth status` → not installed / not authed; no GitHub MCP exposed → anonymous API fallback (per `github-retrieval.md` routing)

## Kernel coverage (from kernel-output.json)

- `retrieval.requests`: 7 · `failedRequests`: 0 · `normalizedRecords`: 7 · `rejectedRecords`: 0 · `warnings`: []
- `metrics`: uniqueCandidates 6, returnedCandidates 5, duplicateObservationsMerged 1
- Capability coverage check: both must-have capabilities ("fast regex search over large codebases", "respect .gitignore") flagged `missing` at candidate level → `evidence.level: weak`, `needsFollowUp: true` (agent resolved this in the brief via manual verification of ripgrep's native gitignore support)

## Routing vs case expectation (crates.io trigger)

Case expected crates.io as **must** (Rust fingerprint). Confirmed: the agent explicitly said "Rust is the implementation language, which triggers the crates.io route" and queried crates.io for code-search, fuzzy-matcher, and grep library crates. GitHub = used; web = must but effectively limited (DDG-style search gave nothing); Ecosyste.ms = optional, **not** used.