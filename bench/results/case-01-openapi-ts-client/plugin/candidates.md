# Candidates — Case 01 B arm (plugin, compare skill) — Post-fix Re-run

Session run dir: `C:\Users\QC\AppData\Local\Temp\search-before-build\runs\20260829T084138-3d34`
Sources: final CLI answer + decoded brief (`artifacts/brief-decoded.json`).

## Ranked candidates (kernel-output top 8)

| Rank | Name | URL | kind | observationCount |
|---|---|---|---|---|
| 1 | openapi-fetch | https://openapi-ts.dev/openapi-fetch | web | 1 |
| 2 | openapi-typescript CLI | https://openapi-ts.dev/cli | web | 1 |
| 3 | OpenAPITools/openapi-generator | https://openapi-generator.tech/ | repo | 3 (merged github+maven+web) |
| 4 | openapi-ts/openapi-typescript | https://github.com/openapi-ts/openapi-typescript | package | 2 (merged npm+github) |
| 5 | kubb-labs/kubb | https://kubb.dev/ | repo | 1 |
| 6 | astahmer/typed-openapi | https://github.com/astahmer/typed-openapi | repo | 1 |
| 7 | Speakeasy | https://github.com/speakeasy-api/speakeasy | web | 1 |
| 8 | Fern | https://github.com/fern-api/fern | web | 1 |

Metrics: uniqueCandidates=23, returnedCandidates=8, duplicateObservationsMerged=3, requests=9, failedRequests=0, normalizedRecords=28, rejectedRecords=0.

## Brief competitors (7, from decoded report)

- openapi-typescript + openapi-fetch | https://openapi-ts.dev | Lightweight type + fetch client generator
- orval | https://orval.dev | Full client + hooks generator (axios/fetch)
- Hey API | https://heyapi.dev | SDK generator with plugin ecosystem
- kubb | https://kubb.dev | Codegen meta-framework (plugin-based)
- OpenAPI Generator | https://openapi-generator.tech | Cross-language JVM generator (breadth)
- Fern | https://github.com/fern-api/fern | Cloud-default SDK generator (SaaS)
- Speakeasy | https://github.com/speakeasy-api/speakeasy | Local CLI SDK generator (multi-language)

## Other candidates seen during research (not in top 8)

- orval (orval-labs/orval, https://orval.dev) — ranked outside kernel top-8 but named in final answer as strongest alternative
- Hey API (@hey-api/openapi-ts, https://heyapi.dev)
- acacode/swagger-typescript-api
- ferdikoomen/openapi-typescript-codegen
- microsoft/kiota
- @openapi-codegen/cli / @openapi-codegen/typescript
- OpenAPITools/openapi-generator-cli
- Redocly bundle (mentioned as $ref-bundling prerequisite, not a candidate)