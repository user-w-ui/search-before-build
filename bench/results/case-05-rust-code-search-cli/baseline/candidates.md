# Candidates — Case 05 baseline (A arm)

Candidates the agent actually mentioned, in order of appearance. URLs are as the agent gave them.

## Core candidates (turn 1–2)

| Name | URL | Agent's characterization |
| --- | --- | --- |
| ripgrep | (not given; well-known) | "already IS blazing-fast Rust regex over large codebases with .gitignore support", "de-facto standard", best-in-class regex+gitignore; publish engine as library crates (`ignore`, `grep-searcher`, `grep-regex`) |
| ast-grep | https://ast-grep.github.io/ (fetched), https://ast-grep.github.io/guide/quick-start.html | "already does tree-sitter structural search in Rust"; best structural search, clean rule language, but no fuzzy and minimal regex/text layer |
| nucleo-matcher | https://docs.rs/nucleo-matcher (fetched) | "the engine behind the Helix editor", "faster than fzf/skim"; gives algorithm+scoring+Pattern/Atom API out of the box |

## Landscape table (turn 3)

| Name | URL | Agent's characterization |
| --- | --- | --- |
| ugrep | https://github.com/Genivia/ugrep (fetched, incl. MANUAL.md) | regex + approximate/fuzzy + boolean + TUI + hex in one binary; zero structural/AST awareness; "genuinely good"; adding tree-sitter = C++ fork, not small patch |
| semgrep | — | structural, but static-analysis/lint product, "not a fast daily search CLI" |
| fzf / skim / nucleo | — | fuzzy filters, not code searchers |

## Adapt candidates (turn 3)

| Name | URL | Agent's characterization |
| --- | --- | --- |
| Fork/extend ast-grep | — | smallest distance to goal, stays Rust; catch: fork of active project |
| Fork/extend ugrep | — | regex+fuzzy done; catch: C++, hardest layer to add |
| Wrapper (rg + ast-grep + nucleo) | — | three processes, no shared result model, "cosmetic" one-tool experience |

## The "new wave" (turn 5, discovered via its own WebSearch/WebFetch)

| Name | URL | Agent's characterization |
| --- | --- | --- |
| probe (probelabs) | https://github.com/probelabs/probe (fetched) | "the closest thing to your spec": ripgrep-speed text + tree-sitter structural + boolean query + BM25/TF-IDF ranking + code-block extraction + LSP; "deliberately no fuzzy"; pre-1.0 v0.6.0-rc331, ~948 commits, ~390 releases, ~696 stars, 63 forks, single maintainer, correctness still being fixed |
| cocoindex-code | — | Rust, AST-based, MCP-integrated, context for AI agents |
| codanna | — | same category |
| codegraph-rust | — | same category |
| SeaGOAT | — | local semantic (embedding) search + call graphs |
| grepai | — | local semantic search |

## Also mentioned (sources section, turn 5)

| Name | URL |
| --- | --- |
| GitHub code-search topic | https://github.com/topics/code-search (fetched) |

## Reuse stack recommended for building (turn 2–3)

`ignore` + `grep-searcher`/`grep-regex` (ripgrep's library crates), `tree-sitter` + language grammars, `nucleo-matcher`, `clap`.

Note: hypergrep (the 2026 newcomer the case notes reference) was NOT mentioned by the baseline arm.