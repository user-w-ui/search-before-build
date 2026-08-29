# Decision — Case 05 B-arm (plugin) · Rust code search CLI

## Final recommendation (verbatim)

> **Recommendation: Adapt**
>
> "Your must-have — fast regex over large repos with `.gitignore` — is already solved best-in-class by **ripgrep**, which you already use. Reimplementing that engine from scratch is the expensive, low-odds part of your idea (competing with ripgrep's SIMD/parallel/mmap tuning is a multi-year chase). But ripgrep publishes its engine as **library crates**, so you can get your unified standalone CLI without maintaining a fork: depend on ripgrep's crates for the regex+gitignore baseline, then add the two layers ripgrep lacks.
>
> - **Structural** — `tree-sitter`, model your pattern UX on **ast-grep** (which already does this natively in Rust).
> - **Fuzzy** — **nucleo-matcher** (faster than fzf/skim, used by Helix) rather than writing a scorer yourself.
>
> That's a 'build the glue, reuse the engines' project — real, useful, and tractable — instead of 'rewrite ripgrep.'"

## Main reason (verbatim)

From the decoded brief's `recommendation.reason`:
> "Your must-have (fast regex over large repos with .gitignore) is already best-in-class solved by ripgrep, which publishes its engine as library crates. Depend on those crates instead of reimplementing regex from scratch, and add the fuzzy (nucleo-matcher) and structural (tree-sitter) layers on top to get your unified standalone CLI without maintaining a fork."

Necessity check result (wrap-up message): concrete need = fact; delivery form fits = fact; familiar alternatives leave trouble = **only partially** (ripgrep covers the must-have perfectly; gap is purely the fuzzy+structural combo — an inference). Build is justified "only if you accept crate reuse rather than a from-scratch engine."

## Most reusable option (verbatim)

> "ripgrep library crates: `ignore` (gitignore-aware walker, 164M downloads) and `grep-searcher` / `grep-regex` (the fast line-regex engine, 13.6M downloads)."

## Biggest remaining unknown (verbatim)

> "Whether you will accept depending on ripgrep crates as the regex+gitignore foundation. If you insist on zero ripgrep dependency and reimplement the engine, the must-have becomes a multi-year performance chase against ripgrep with little likelihood of matching it."

(Wrap-up message: "If you insist on **zero ripgrep dependency** and reimplement the regex engine, the recommendation flips toward *Stop/Use existing*.")

## Other unknowns recorded in brief

1. Whether you accept depending on ripgrep crates (ignore + grep-searcher) vs zero-ripgrep from-scratch engine.
2. Cross-platform binary distribution for ast-grep not explicitly confirmed on its primary page.
3. Whether the unified one-CLI experience justifies the glue work over using ripgrep + ast-grep + a fuzzy picker separately.