# Decision — Case 01 baseline (A arm)

## Final recommendation (verbatim)

> **Don't build this.** Your plan is almost a feature-for-feature description of at least four actively maintained, heavily-adopted tools ✅ and your own constraint says you'd rather adopt than build. The two "hard" unknowns you listed (`$ref` across split files, axios+fetch codegen) are solved problems in all of them. The only plan item none of them ship as a built-in command is the CI staleness check, and that's a 3-line `git diff --exit-code` step, not a reason to write a generator.

## Recommended path (verbatim, condensed)

1. **Pilot `@hey-api/openapi-ts` on one microservice first** — "it's the closest 1:1 match to your plan (CLI, full typed SDKs, axios+fetch, configurable output, plugin ecosystem, modern, heavily adopted). If its generated output and conventions fit your 40-service world, you're done."
2. If fetch-centric/minimal runtime: pilot **openapi-typescript + openapi-fetch** instead.
3. If frontends lean on React Query/SWR/Zod + MSW mocks: **orval**.
4. Keep **openapi-generator (JVM)** as fallback only for non-TypeScript needs or unsupported 3.1 features; "The JVM dependency is a cost in a Node-only shop."
5. Build only a **thin internal wrapper config** — "a shared `openapi-ts.config.ts` plus a small script that enforces your company-wide naming/output conventions across all 40 services and wires the `git diff --exit-code` CI step. That's configuration on top of someone else's generator, not a generator."

## Reasoning chain observed

1. Read plan.md (1 Read).
2. Searched (empty), then fetched GitHub pages for the 6 known tools to verify claims instead of relying on memory.
3. Checked plan items #4 (`--watch`) and #5 (CI staleness) explicitly: *"Let me verify two plan-specific features (watch mode and CI staleness) across the leading Node-based tools... since those are items #4 and #5 in your plan and I don't want to misstate them."*
4. Concluded the plan's three "Unknowns" are solved problems; `--watch` is a one-line wrapper pattern (`nodemon --watch specs/ --exec "openapi-ts …"` or `onchange`); CI staleness = `git diff --exit-code -- generated/`.
5. Offline/no-SaaS constraint respected: candidates ranked as npm packages (fully offline), JVM tool downgraded to fallback; no SaaS was offered at all.

## Notable gaps in the reasoning

- No clarifying questions asked (script answered nothing; user persona was never needed). The agent assumed scenario and constraints directly from the plan doc.
- No commercial SaaS (Fern/Speakeasy) surfaced — so the "SaaS = unsuitable" filtering was never exercised explicitly; the constraint was applied implicitly by only listing OSS.
- openapi-generator's Java runtime cost was flagged ("Java 11+", "JVM dependency is a cost") but with less depth than the B-arm routing table anticipates (no Maven coordinates, no install cost details).
- Evidence caveat self-reported: commit counts for @hey-api/openapi-ts conflicted across page sections; advised verifying on npm.