# Candidates — Case 05 B-arm (plugin) · Rust code search CLI

Final candidate list from the decoded brief (`competitors` array) and the wrap-up message. The kernel ranked 6 unique candidates from 7 retrieval requests; the brief's competitor deep-dive covers 3.

## From the brief's competitors array

| Name | URL | Category | Plugin characterization (summary) |
| --- | --- | --- | --- |
| ripgrep | https://github.com/BurntSushi/ripgrep | Ready-to-use product + reusable library crates | "The standard fast Rust regex search tool... natively respecting .gitignore... Its engine is also published as library crates (ignore, grep-searcher, grep-regex), letting a new CLI reuse the hard parts without forking." Best-in-class on the must-have; no fuzzy, no structural. |
| ast-grep | https://github.com/ast-grep/ast-grep | Ready-to-use product | "A Rust CLI for structural (AST) code search, lint, and rewrite using tree-sitter patterns... The closest existing solution to your structural nice-to-have." No plain regex mode, no fuzzy. Capabilities verified from ast-grep.github.io primary page. |
| nucleo-matcher | https://github.com/helix-editor/nucleo (crate: https://crates.io/crates/nucleo-matcher) | Reusable component (library crate) | "A high-performance Rust fuzzy matching library, faster than fzf/skim/fuzzy-matcher, used by the Helix editor. It is a library, not a CLI... Smith-Waterman scoring... handles Unicode graphemes better." |

## Kernel-ranked candidates not deep-dived in the brief

| Name | URL | Kind | Kernel rank | Notes |
| --- | --- | --- | --- | --- |
| ripgrep (merged with ignore crate) | https://github.com/BurntSushi/ripgrep | repo+package | 1 | 2 observations merged by stable identity (repo + `pkg:cargo/ignore`); finalScore 0.98 |
| probe | https://github.com/probelabs/probe | repo | 2 | "AI-friendly semantic code search engine... Combines ripgrep. Rust." 696 stars |
| ast-grep | https://github.com/ast-grep/ast-grep | repo | 3 | 15,685 stars |
| nucleo-matcher | https://github.com/helix-editor/nucleo | package | 4 | 1,200 stars |
| comby | https://github.com/comby-tools/comby | repo | 5 | "Code rewrite tool for structural search and replace... Written in OCaml." 2,671 stars |

## Researched but dropped

- **semble_rs** (johunsa/semble_rs README was fetched during "deep verification") — appeared in research as an already-combined Rust tool, but never made the kernel input or final brief.
- **fuzzy-matcher** (https://crates.io/crates/fuzzy-matcher) — in kernel input as an alternative fuzzy crate; superseded by nucleo-matcher.

## Discovery note

- hypergrep (2026-era new project) was **not** found by the plugin (0 mentions in the transcript) — the discovery surface did not reach it.
- All candidates were found via GitHub anonymous API + crates.io + primary pages, not via generic web search (which returned nothing usable).