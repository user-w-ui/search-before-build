# OpenAPI TypeScript Client Generator

## Status

Draft plan. Nothing implemented yet. ~2 weeks of part-time exploration so far.

## Problem

Our company runs more than 40 REST microservices. Each team documents its API
with OpenAPI 3.x specs, but frontend and backend teams still hand-write their
TypeScript API clients. Clients drift from the specs, query parameter names get
misspelled, and every API change triggers a manual sync effort across repos.

## Proposed solution

A CLI tool, `api-ts-gen`, that:

1. takes one or more OpenAPI 3.x JSON/YAML documents as input;
2. generates strongly typed TypeScript API clients — request/response models,
   path functions, and query-parameter types;
3. supports codegen configuration per project (output directory, HTTP client
   choice, naming conventions);
4. has a `--watch` mode that regenerates clients when spec files change;
5. can be embedded in CI to fail the build when generated clients are stale.

## Constraints

- Node.js / TypeScript stack; must run in our private network, fully offline.
- No external SaaS dependency for generation.
- We would much rather adopt an existing, maintained tool than build our own.

## Unknowns

- How to handle `$ref` resolution across split spec files.
- How to generate idiomatic code for both axios and fetch.
- Whether union/nullable OpenAPI types map cleanly to TypeScript.

## Related tools we already know about (unverified)

- swagger-codegen (seems old?)
- openapi-generator (Java-based, we think)
- openapi-typescript (heard of it, unsure of maturity)
