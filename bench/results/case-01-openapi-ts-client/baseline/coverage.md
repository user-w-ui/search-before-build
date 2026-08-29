# Coverage — Case 01 baseline (A arm)

What the agent actually did to gather evidence (from session.jsonl transcript).

## Retrieval activity summary

- **Proactive search: YES** — the agent chose to research on its own before answering; no nudging.
- WebSearch: **4 calls**, WebFetch: **9 calls**, Read: **1 call** (the plan.md itself). Total evidence-gathering tool calls: 14.
- **Critical finding: all 4 WebSearch calls returned EMPTY result sets.** The tool responses contained only the search prompt echo + a "REMINDER: You MUST include the sources above..." boilerplate with zero actual sources. The agent itself observed this for the first search: *"The web search came back empty. Let me fetch the actual project pages for the main existing tools in parallel so I can give you an accurate comparison rather than relying on memory."* The remaining 3 searches were aimed at plan-specific features (`--watch`, CI staleness) and also returned nothing; the agent then verified those features by direct page fetches instead.
- **Discovery was therefore model-knowledge-driven, verification was page-driven**: the agent picked candidate repos from its own knowledge and fetched their GitHub pages to verify. Only one non-GitHub page was opened (the hey-api docs site).

## WebSearch queries (in order)

1. `OpenAPI TypeScript client generator tools 2026 openapi-typescript oazapfel hey-api orval` — empty (note the "oazapfel" typo for oazapfts)
2. `orval --watch mode regenerate spec change openapi` — empty
3. `hey-api openapi-ts watch mode offline standalone no SaaS required` — empty
4. `openapi-generator-cli --watch flag staleness check git diff CI generated client` — empty

## WebFetch URLs (in order)

1. https://github.com/hey-api/openapi-typescript
2. https://github.com/hey-api/openapi-fetch
3. https://github.com/hey-api/openapi-ts
4. https://github.com/orval-labs/orval
5. https://github.com/acacode/swagger-typescript-api
6. https://github.com/OpenAPITools/openapi-generator
7. https://github.com/drwpow/openapi-typescript
8. https://openapi-ts.pages.dev/ (hey-api docs)
9. https://github.com/oazapfts/oazapfts

## Source platforms touched

- GitHub (repo pages): 8 fetches — the only primary-source platform used
- hey-api docs site (openapi-ts.pages.dev): 1 fetch
- npm registry: NOT touched (npm download numbers were quoted but no npm page was fetched)
- Maven Central: NOT touched
- Web search engine (whatever the built-in WebSearch backs onto): 4 attempts, 0 usable results
- Commercial SaaS sites (Fern/Speakeasy): NOT touched, not mentioned

## Data-quality note

The agent flagged its own evidence issue: GitHub commit counts for `@hey-api/openapi-ts` "ranged from ~35 to ~8,800 depending on which page section loaded (the project was recently reorganized into the Hey API monorepo)", and advised treating the exact commit number as unreliable and verifying on npm. So even its page-fetch evidence was partial/noisy, and it acknowledged that.