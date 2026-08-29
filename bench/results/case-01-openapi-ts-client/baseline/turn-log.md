# Turn Log — Case 01 baseline (A arm, no plugin)

## Turn 1 — START @ 2026-08-29 13:20:14

SENT (stdin): I have a plan for a CLI tool that generates typed TypeScript API clients from OpenAPI specs. I'd like you to compare my plan against what already exists before I spend more time on it. Here is the plan: ./plan.md

Agent asked clarifying questions: NONE. It went straight to research.

> NOTE: raw claude stdout captured via Tee-Object contained console-encoding artifacts (checkmark glyphs lost). The transcript below is extracted from session.jsonl (authoritative UTF-8).

### Assistant full text (from session.jsonl, model=glm-5.2)

I'll start by reading your plan, and in parallel research what already exists in the OpenAPI → TypeScript client generation space.

The web search came back empty. Let me fetch the actual project pages for the main existing tools in parallel so I can give you an accurate comparison rather than relying on memory.

I have a clear picture from the plan and the research. Let me verify two plan-specific features (watch mode and CI staleness) across the leading Node-based tools before I write up the comparison, since those are items #4 and #5 in your plan and I don't want to misstate them.

I read your plan and checked the current landscape of OpenAPI→TypeScript generators. Here's the comparison.

## Bottom line

**Don't build this.** Your plan is almost a feature-for-feature description of at least four actively maintained, heavily-adopted tools — and your own constraint says you'd rather adopt than build. The two "hard" unknowns you listed (`$ref` across split files, axios+fetch codegen) are solved problems in all of them. The only plan item none of them ship as a built-in command is the CI staleness check, and that's a 3-line `git diff --exit-code` step, not a reason to write a generator.

## How the candidates map to your plan

| Requirement in your plan | openapi-typescript + openapi-fetch | @hey-api/openapi-ts | swagger-typescript-api | orval | openapi-generator (JVM) |
|---|---|---|---|---|---|
| OpenAPI 3.x JSON/YAML | ✅ | ✅ | ✅ (3.0 + 2.0) | ✅ (3.x + Swagger 2) | ✅ (3.0, 3.1 beta) |
| Request/response models + path fns + query types | types + typed fetch client | full SDK | full client | full client + hooks | full client |
| Configurable output / naming | ✅ | ✅ (20+ plugins) | ✅ | ✅ | ✅ |
| HTTP client choice (axios **and** fetch) | fetch only (axios via wrap) | ✅ both | ✅ both | ✅ both | ✅ both (+ Angular, jQuery, rxjs…) |
| `--watch` mode | not built-in | not confirmed | not confirmed | not confirmed | not built-in |
| CI staleness fail | not built-in | not built-in | not built-in | not built-in | not built-in |
| Fully offline / no SaaS | ✅ (npm pkg) | ✅ (npm pkg) | ✅ (npm pkg) | ✅ (npm pkg) | ✅ (JAR, Java 11+) |
| `$ref` across split files | ✅ (bundles) | ✅ | ✅ | ✅ | ✅ |
| Maturity / adoption | ~8.3k★, Vercel-sponsored, very mature | millions of weekly dl, used by Vercel/PayPal | ~4.1k★, mature | ~6.4k★, v8, needs Node 22.18+ | 7.25.0, used by PayPal/IBM, 23k+ commits |

A note on the contradictions I hit while fetching: GitHub commit counts reported for `@hey-api/openapi-ts` ranged from ~35 to ~8,800 depending on which page section loaded (the project was recently reorganized into the Hey API monorepo). I'm confident about the adoption signal — millions of weekly npm downloads, used by Vercel and PayPal — but I'd treat the exact commit number as unreliable. Verify version/maintenance directly on npm before pinning.

## Your three "Unknowns" — already solved

- **`$ref` resolution across split specs.** Every generator above resolves internal and external `$ref`s. openapi-typescript explicitly bundles multi-file specs. This is table stakes, not a research project.
- **Idiomatic axios *and* fetch.** hey-api, swagger-typescript-api, orval, and openapi-generator all generate for both. openapi-typescript+openapi-fetch is fetch-only (axios would need a thin adapter).
- **Union/nullable → TypeScript.** Handled by all of them (OpenAPI 3.0 `nullable` and 3.1 `null`-in-type-arrays both map to TS unions). Edge cases exist in pathological specs but it's not a blocker.

## The two "missing" features are non-issues

- **`--watch`:** rarely a built-in flag in any of these. The standard pattern is wrapping the CLI with a file watcher — `nodemon --watch specs/ --exec "openapi-ts …"` or `onchange`. One line; not worth owning a generator for.
- **CI staleness check (your plan item #5):** no tool ships a dedicated command, and none needs to. The universal pattern is: run the generator in CI, then `git diff --exit-code -- generated/`. If the committed client differs from the freshly generated one, the step fails. This is the same mechanism `openapi-typescript`, `prettier`, and every codegen project documents. You get it for free.

## Recommendation

1. **Pilot `@hey-api/openapi-ts` on one microservice first** — it's the closest 1:1 match to your plan (CLI, full typed SDKs, axios+fetch, configurable output, plugin ecosystem, modern, heavily adopted). If its generated output and conventions fit your 40-service world, you're done.
2. **If you want minimal runtime weight and are fetch-centric**, pilot **openapi-typescript + openapi-fetch** instead — it generates types plus a tiny typed fetch layer, very mature, Vercel-backed.
3. **If your frontends lean on React Query/SWR/Zod and you want MSW mocks**, that's **orval**'s sweet spot.
4. **Keep `openapi-generator` (JVM) as a fallback** only if you need non-TypeScript generators too, or if a specific 3.1 feature isn't yet supported by the TS-native tools. The JVM dependency is a cost in a Node-only shop.

The only thing worth building yourself is a **thin internal wrapper config** — a shared `openapi-ts.config.ts` plus a small script that enforces your company-wide naming/output conventions across all 40 services and wires the `git diff --exit-code` CI step. That's configuration on top of someone else's generator, not a generator. Your two weeks of exploration have essentially already validated the market; the next step is a half-day spike on one real spec, not more planning.

**Sources:**
- [openapi-typescript (drwpow)](https://github.com/drwpow/openapi-typescript) / [openapi-fetch](https://github.com/hey-api/openapi-fetch)
- [@hey-api/openapi-ts](https://github.com/hey-api/openapi-ts)
- [swagger-typescript-api (acacode)](https://github.com/acacode/swagger-typescript-api)
- [orval](https://github.com/orval-labs/orval)
- [openapi-generator (OpenAPITools)](https://github.com/OpenAPITools/openapi-generator)
- [oazapfts](https://github.com/oazapfts/oazapfts) (smaller, single-file, fetch-only — included for completeness)

--- END TURN 1 @ 2026-08-29 13:22:44 (complete; agent gave final recommendation, no further turns needed) ---

## Monitoring note
Total run ~2.5 min (13:20:14 → 13:22:44), well under the 3-minute monitoring cadence, so no periodic process checks were needed. No timeouts, no wrap-up turn, no anomalies in execution.
