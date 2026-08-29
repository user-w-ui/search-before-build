# Decision — Case 01 B arm (plugin, compare skill) — Post-fix Re-run

Session: 8dbfd2fe-741c-4d2a-ac71-6f9ce6a3387f | run: 20260829T084138-3d34

## Final recommendation (verbatim from CLI answer)

> Recommendation: **Use existing** — adopt **openapi-typescript + openapi-fetch** instead of building `api-ts-gen`.

## Reason (verbatim)

> The problem this plan solves — typed TS clients that don't drift from OpenAPI specs in offline CI — is already covered by multiple mature, MIT-licensed, actively-maintained tools (all pushed within the last week). Building would duplicate a solved, high-maturity problem, and you've said you'd much rather adopt than build. The kernel merged cross-source duplicates (openapi-generator observed across GitHub/Maven/web, `observationCount: 3`) and surfaced 23 unique candidates — 8 ranked, with **zero must-have capabilities lacking a candidate mention**.

## Most reusable option (verbatim)

> **Primary: openapi-typescript + openapi-fetch** (openapi-ts/openapi-typescript, MIT, 8.3k★, v7.13.0, pushed 2026-08-26)
> - Matches every must-have: OpenAPI 3.0 + 3.1 (incl. discriminators, oneOf/anyOf/allOf); local/remote schema input; `npx` CLI, no SaaS.
> - **Directly satisfies your plan's step 5**: `--check` verifies generated types are up-to-date and fails the build on drift — the exact CI-staleness behavior you planned to build.
> - openapi-fetch is a 6 kB type-safe fetch client (body/query/path/response).
>
> **Strongest alternative: orval** (MIT, 6.4k★) — the one to switch to if you need **native axios AND fetch** or React Query/SWR hooks, since it resolves your "dual axios+fetch output" unknown natively.

(Brief's `reusableOption` field: "openapi-typescript + openapi-fetch (openapi-ts/openapi-typescript, MIT). Pair with orval if axios or React Query hooks are later required.")

## Biggest remaining unknown (verbatim)

> **Split/multi-file `$ref`**: no leading tool exposes native $ref-across-split-specs as a CLI flag; the documented path is a Redocly bundle step before generation. **This is the biggest unknown** — check it against your real specs first.

(Brief's `biggestUnknown`: "Whether the team's specs use split/multi-file $ref that needs a Redocly bundle step before generation; no leading tool exposes this as a native CLI flag.")

## Brief location

Absolute path of rendered brief (parent = run-dir):
`C:\Users\QC\AppData\Local\Temp\search-before-build\runs\20260829T084138-3d34\brief.html`
(run-dir parent: `C:\Users\QC\AppData\Local\Temp\search-before-build\runs`)

## Bottom line (verbatim)

> don't build. Run `openapi-typescript --check` against one of your real specs this week; if split-`$ref` or axios-output bites, that single test tells you whether to stay with openapi-typescript or move to orval — and that's far cheaper than implementing your plan.