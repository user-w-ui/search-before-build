# Code-Search Friction Log

> Goal: capture *evidence* that you keep hitting a wall `rg` + `ast-grep` can't get past,
> so the "build the glue CLI?" question gets decided on what actually happens, not vibes.
>
> **Rule:** one line per friction hit, while it's fresh. Don't curate. Don't write essays.
> If you don't hit anything in a normal day, the day stays blank — that *is* the signal.

## How to log a hit

Append one row to the table below. Fill the columns, move on.

| Date | What you were trying to find | Tool you used | The friction (one line) | Category | Sev |
|------|------------------------------|---------------|--------------------------|----------|-----|
|      |                              |               |                          |          |     |

**Category** — maps straight to whether the glue CLI would fix it:
- `fuzzy` — wanted approximate/misspelled-id matching (`rg` can't, probe omits it) → **direct build signal**
- `unified-UX` — wanted one command / one flag set across modes → **direct build signal**
- `output-format` — hand-reformatting output to pipe/script; results don't compose → **direct build signal**
- `structural` — needed code-aware search `ast-grep` made awkward (pattern ergonomics, multi-line, wildcards) → build signal *only if* probe trial also fails
- `regex` — plain regex wall → **not a build signal** (just learn `rg` flags / write an alias)
- `perf` — too slow → **not a build signal** (the crates reuse ripgrep's engine; perf is solved)

**Sev** — how much it actually cost:
- `1` = annoyance, kept going
- `2` = worked around, lost a minute or two
- `3` = blocked, manual steps or gave up

---

## Hits

| Date | What you were trying to find | Tool you used | The friction (one line) | Category | Sev |
|------|------------------------------|---------------|--------------------------|----------|-----|
|      |                              |               |                          |          |     |

---

## Probe trial (one evening, once)

Run probe through sections A–D + its semantic/structural modes. Verdict per section:

- [ ] A. Regex baseline (speed, gitignore, `-t`, `--json`)
- [ ] B. Fuzzy — **probe has none**, so this stays blank. Note whether you missed it.
- [ ] C. Structural (`query` w/ `"fn $NAME($$$) -> Result<$RET>" --language rust`)
- [ ] D. Unified experience — can probe alone replace the `rg`+`ast-grep` pair?

Probe one-liner: ______________________________________________

---

## Gate verdict (read this after ~3–4 weeks, or 20+ hits, whichever first)

Count the hits by category. The decision:

- **Direct-build-signal hits (`fuzzy` / `unified-UX` / `output-format`) repeat, and probe didn't cover them**
  → **Build the glue CLI.** Architecture is decided: `ignore` + `grep-searcher`/`grep-regex` + tree-sitter + nucleo-matcher, subcommands, one unified result type, ~2k lines, no fork. Build with evidence.

- **Mostly `regex` / `perf` hits, or the log is sparse**
  → **Don't build.** `rg` + `ast-grep` is your answer. You saved a project.

- **Probe cleared A–D and you didn't miss fuzzy**
  → **Adopt probe** (eyes open: pre-1.0, pin one RC, keep `rg` one keystroke away). Revisit at probe 1.0.

Raw counts: fuzzy ___ · unified-UX ___ · output-format ___ · structural ___ · regex ___ · perf ___
Decision: ☐ build  ☐ skip  ☐ adopt probe
Notes:
