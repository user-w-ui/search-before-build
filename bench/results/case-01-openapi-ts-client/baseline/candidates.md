# Candidates — Case 01 baseline (A arm)

Candidates the agent actually named in its final answer, with its characterization (verbatim where possible). All URLs are those the agent itself printed.

| Candidate | URL given by agent | Agent's characterization |
| --- | --- | --- |
| openapi-typescript (drwpow) + openapi-fetch | https://github.com/drwpow/openapi-typescript ; https://github.com/hey-api/openapi-fetch | "types + typed fetch client"; "~8.3k⭐, Vercel-sponsored, very mature"; fetch-only ("axios via wrap"); recommended as pilot #2 "if you want minimal runtime weight and are fetch-centric" |
| @hey-api/openapi-ts | https://github.com/hey-api/openapi-ts | "full SDK"; "millions of weekly dl, used by Vercel/PayPal"; "CLI, full typed SDKs, axios+fetch, configurable output, plugin ecosystem (20+ plugins), modern, heavily adopted"; PRIMARY recommendation to pilot first — "closest 1:1 match to your plan" |
| swagger-typescript-api (acacode) | https://github.com/acacode/swagger-typescript-api | "full client"; "~4.1k⭐, mature"; OpenAPI 3.0 + 2.0; axios+fetch |
| orval | https://github.com/orval-labs/orval | "full client + hooks"; "~6.4k⭐, v8, needs Node 22.18+"; recommended "if your frontends lean on React Query/SWR/Zod and you want MSW mocks" |
| openapi-generator (OpenAPITools, JVM) | https://github.com/OpenAPITools/openapi-generator | "full client"; "7.25.0, used by PayPal/IBM, 23k+ commits"; "OpenAPI 3.0, 3.1 beta"; JVM fallback: "The JVM dependency is a cost in a Node-only shop"; also noted "(+ Angular, jQuery, rxjs…)" clients |
| oazapfts | https://github.com/oazapfts/oazapfts | "smaller, single-file, fetch-only — included for completeness" |

## Coverage vs. plan's own list

- Plan's "related tools we already know about": swagger-codegen (NOT re-evaluated by the agent — silently dropped), openapi-generator (re-verified via GitHub fetch), openapi-typescript (re-verified).
- NOT discovered by the baseline agent: commercial SaaS generators (Fern, Speakeasy) — the offline/no-SaaS constraint is respected in its table ("Fully offline / no SaaS ✅ (npm pkg)") but the agent never surfaced any SaaS option to reject. It apparently did not know or did not consider them.
- Missing vs. the B-arm routing table: no npm-registry lookup, no Maven Central coordinates, no Ecosyste.ms. openapi-generator was characterized correctly as JVM/Java 11+ but with no install-cost detail beyond "Java 11+" and "JVM dependency is a cost".

## Overlap note

All 6 candidates are open-source repos the agent knew about by name; all were verified by fetching their GitHub pages (evidence-level: primary pages, not search snippets). Only the coverage of `@hey-api/openapi-ts`'s docs page (openapi-ts.pages.dev) came from outside GitHub.