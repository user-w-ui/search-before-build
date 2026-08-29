# Decision — Case 05 baseline (A arm)

## Final recommendation (verbatim, turn 7)

> "**Final call: don't build yet. Start using `rg` + `ast-grep` as your daily pair today, give probe one trial evening, and build the glue CLI only if a few weeks of real use proves the friction is something you keep hitting.**"

## Reasoning chain (as given)

1. **Turn 1** — "yes — but build the glue, not the engine." ripgrep (regex+gitignore), ast-grep (structural), nucleo (fuzzy) each solve one mode; the only novel part is one unified CLI doing all three. Reimplementing fast regex is "the trap" (SIMD/parallelism/mmap/ignore-precedence; ripgrep spent years).
2. **Turn 2** (after "best usable tool, not learning") — committed stack: `ignore` + `grep-searcher`/`grep-regex` + `tree-sitter` + `nucleo-matcher` + `clap`; build order regex → unified output format → fuzzy → structural; ~2k lines of glue.
3. **Turn 3** — verified no tool combines all three modes; adapt candidates (fork ast-grep / fork ugrep / wrapper) each have catches; "adapt" vs "no fork" tension surfaced honestly; crate-glue remains best fit.
4. **Turn 5** — discovered 2024–26 wave (probe et al.) combining regex+structural+semantic for AI agents, deliberately dropping fuzzy. Deciding question: human-at-terminal vs AI-agent consumer.
5. **Turn 6** — probe verified as actively maintained but NOT battle-tested: "390 release candidates is not a sign of maturity; it's a sign of a tool iterating hard toward maturity it hasn't reached." Posture: "try it hard, depend on it nothing."
6. **Turn 7** — final synthesis. Why each immediate option loses:
   - "**Build now loses** because you're ambivalent, and a half-built glue CLI is worse than two mature tools."
   - "**Adopt probe as the bet loses** because it isn't dependable: pre-1.0 (v0.6.0-rc331), bus factor of one, core correctness still being fixed in the latest RC."
   - "**`rg` + `ast-grep` forever, no gate, loses** because it writes off a genuine unclaimed gap (regex+fuzzy+structural, human at terminal) without ever testing whether you hit it."

## The gate (verbatim excerpt, turn 7)

> "1. **Daily:** use `rg` + `ast-grep`. Every time you reach for a third tool, hand-reformat output, or wish for fuzzy on a misspelled identifier → drop one line in a friction log.
> 2. **One evening:** run probe through the trial checklist (sections A–D + the probe-specific semantic/structural section).
> 3. **At the gate:** read the log.
>    - **Friction repeats and probe didn't cover it** → build the glue... You'll be building with evidence, not vibes.
>    - **Log is sparse** → you've saved yourself a project. `rg` + `ast-grep` is your answer, done."

## Flip condition

> "The one thing that would flip this to 'build immediately' is if you already *know* you hit the unified-UX/fuzzy friction daily — in which case skip the gate and say so."

## Strongest existing solution offered for reuse

probe (https://github.com/probelabs/probe) as the closest existing tool ("could already be 80% of your daily tool"), plus the ripgrep library-crate stack (`ignore`, `grep-searcher`/`grep-regex`) as the reusable engine layer for any build.

## Direction character (vs case's Adapt/Build question)

Deferred-Build with evidence gate: default to Adapt/use-existing now (rg + ast-grep, trial probe), Build only if recorded friction proves the gap. Agent explicitly framed the unified CLI as "a genuine unclaimed gap."

## Biggest remaining unknown (agent-implied)

Whether the user's actual daily friction (unified UX / fuzzy-at-terminal) is real and repeated — the gate exists to test that. Also probe's convergence to a stable 1.0.

## Deliverables the agent produced during the session

- Trial checklist (ugrep + ast-grep, sections A–D) — turn 4
- Probe-specific maturity assessment (commits/releases/issues/stars/bus factor) — turn 6
- friction-log.md — written to workdir at turn 8 (copied to RESULTS)
- Project memory files under its own ~/.claude memory dir (project-intent, architecture-decision, current-plan)