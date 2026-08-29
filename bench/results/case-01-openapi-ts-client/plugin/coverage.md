# Coverage — Case 01 B arm (plugin, compare skill) — Post-fix Re-run

## Sources queried (retrieval requests fed to kernel, n=9, all success)

From `artifacts/kernel-input.json` `retrievals` and session evidence:

1. npm — `openapi-typescript` (package) → 6 results
2. npm — `openapi-codegen` (package) → 2 results
3. GitHub REST search — `openapi ts client` (repo) → 9 repos
4. GitHub REST search — `openapi-generator` (repo) → 2 repos
5. Maven Central — `org.openapitools:openapi-generator` (package) → 2 artifacts
6. host-web — Fern (web) → 1 result
7. host-web — Speakeasy (web) → 1 result
8. host-web — openapi-ts docs (web) → 3 results
9. host-web — openapi-generator docs (web) → 2 results

Additional session evidence (verification fetches, not kernel retrievals):
- WebFetch (27): openapi-ts.dev (8 pages incl. sitemap.xml), orval.dev, kubb.dev, heyapi.dev, openapi-generator.tech (2), fern.build / buildwithfern.com (4), speakeasy.com (2), github.com (3)
- WebSearch (4): "openapi typescript client generator offline CLI 2026 openapi-typescript vs orval vs kubb", "openapi-generator typescript generator requires java runtime offline", "openapi-typescript 3.1 nullable union types $ref external split file bundle", "speakeasy openapi typescript SDK generator CLI local offline open source"
- Bash curl (3): Ecosyste.ms npm wrapper lookup (packages.ecosyste.ms/api/v1/packages/lookup?purl=pkg:npm/@openapitools/openapi-generator-cli), Ecosyste.ms Maven Central lookup (packages.ecosyste.ms/api/v1/registries/mavencentral/packages/org.openapitools/openapi-generator), raw README fetch

## New-route audit (fix-verification #3)

| Route | Actually queried? | Evidence |
|---|---|---|
| Ecosyste.ms Packages | YES | 2 curl calls to packages.ecosyste.ms (npm-wrapper lookup + mavencentral registry); responses visible in session; results used in merge for openapi-generator npm wrapper |
| Hacker News Algolia | NO | Only occurrence of hn.algolia.com in session is the example inside `references/search-sources.md` (doc content, not an executed command). Agent routed the HN/necessity check to web search instead; no hn.algolia curl/WebFetch executed |

## GitHub retrieval method

Anonymous GitHub REST search API (unauthenticated). `gh` CLI not installed; no GitHub MCP tools exposed in session. Agent explicitly noted the fallback and its limitation ("newer or low-visibility repos may be underrepresented").

## Web-record projection audit (fix-verification #1)

kernel-output candidates with `kind=web`:
- url:https://openapi-ts.dev/openapi-fetch (rank 1, "openapi-fetch")
- url:https://openapi-ts.dev/cli (rank 2, "openapi-typescript CLI")
- github:speakeasy-api/speakeasy (rank 7, kind=web)
- github:fern-api/fern (rank 8, kind=web)

→ Web-derived records ARE projected (pre-fix: all web records dropped). 4 of 8 ranked candidates are web-kind.

## Kernel coverage contract

All 3 must-have capabilities have `candidate_mention` status (0 missing):
- Generate TypeScript types from OpenAPI 3.x specs → 6 candidate mentions
- Offline local generation in CI → 2 candidate mentions
- Type-safe query parameters and request/response models → 3 candidate mentions