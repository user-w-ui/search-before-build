# Search source catalog

This is the maintained catalog of common anonymous research sources. Read it before external research, then select only sources that match the functional fingerprint. Do not query every source by default.

## Contents

- [Routing rule](#routing-rule)
- [GitHub](#github)
- [npm](#npm)
- [Ecosyste.ms Packages](#ecosystems-packages)
- [Official MCP Registry](#official-mcp-registry)
- [Maven Central](#maven-central)
- [crates.io](#cratesio)
- [Hugging Face Hub](#hugging-face-hub)
- [arXiv](#arxiv)
- [Adding a user-provided source](#adding-a-user-provided-source)

## Routing rule

| Need | Prefer |
| --- | --- |
| Open-source repositories or code | GitHub |
| JavaScript/Node packages | npm |
| Cross-ecosystem package metadata and dependency signals | Ecosyste.ms |
| Ready-made MCP tools for an Agent | Official MCP Registry |
| JVM artifacts | Maven Central |
| Rust crates | crates.io |
| Models, datasets, or Spaces | Hugging Face |
| Research papers and preprints | arXiv |

Use ordinary web search for products, SaaS, app stores, documentation, or discovery outside these catalogs. Use catalog results for discovery, then verify strong candidates from their primary project pages and implementation evidence.

All commands below were successfully executed anonymously on 2026-07-12. Replace literal query values and URL-encode them. Respect rate limits and identify the client with a useful `User-Agent` for HTTP APIs.

## GitHub

**Main content:** Public repositories, source code, README files, licenses, releases, issues, activity, stars, forks, and archived state.

**Use when:** Looking for open-source products, implementations, reusable code, or repository-level evidence. Prefer a detected GitHub MCP/connector. Read [github-retrieval.md](github-retrieval.md) for capability detection, optional OAuth setup, API limits, and required downgrade wording.

```bash
curl -L -H "Accept: application/vnd.github+json" -H "X-GitHub-Api-Version: 2022-11-28" -H "User-Agent: search-before-build" "https://api.github.com/search/repositories?q=github-mcp-server+in:name&per_page=2"
curl -L -H "Accept: application/vnd.github+json" -H "X-GitHub-Api-Version: 2022-11-28" -H "User-Agent: search-before-build" "https://api.github.com/repos/github/github-mcp-server"
curl -L -H "Accept: application/vnd.github.raw+json" -H "X-GitHub-Api-Version: 2022-11-28" -H "User-Agent: search-before-build" "https://api.github.com/repos/github/github-mcp-server/readme"
```

Anonymous GitHub code search is not available. On rate-limit `403`, follow the GitHub-specific fallback instead of treating missing data as absence.

## npm

**Main content:** JavaScript and Node.js package names, descriptions, keywords, maintainers, versions, licenses, dates, and project links.

**Use when:** The requested capability could be an npm dependency, CLI, framework, plugin, or build tool. `npm search` is a broad text match; a maintainer name is useful discovery input but not a strict author filter.

```bash
npm search vite --json --searchlimit=3
npm search sindresorhus --json --searchlimit=3
```

## Ecosyste.ms Packages

**Main content:** Normalized package, version, maintainer, dependency, download, license, repository, and project-health metadata across npm, PyPI, crates.io, Maven, Go, RubyGems, NuGet, Packagist, and many other registries.

**Use when:** Resolving the same component across ecosystems, comparing maintenance/adoption signals, looking up a PURL, or listing packages by maintainer. It is better for exact/structured lookup than free-text discovery.

```bash
curl -L -H "User-Agent: search-before-build" "https://packages.ecosyste.ms/api/v1/packages/lookup?purl=pkg%3Anpm%2Fexpress"
curl -L -H "User-Agent: search-before-build" "https://packages.ecosyste.ms/api/v1/registries/crates.io/packages/serde"
curl -L -H "User-Agent: search-before-build" "https://packages.ecosyste.ms/api/v1/registries/npmjs.org/maintainers/sindresorhus/packages?per_page=2"
```

Do not use an undocumented `query=` parameter on the registry package-list endpoint; it does not perform keyword search. Official OpenAPI: `https://raw.githubusercontent.com/ecosyste-ms/packages/main/openapi/api/v1/openapi.yaml`.

## Official MCP Registry

**Main content:** Published MCP servers, descriptions, versions, repository identities, package/install metadata, and remote transports.

**Use when:** The user needs an existing Agent tool, connector, MCP server, or integration instead of new application code.

```bash
curl -L -H "User-Agent: search-before-build" "https://registry.modelcontextprotocol.io/v0.1/servers?search=filesystem&limit=3"
curl -L -H "User-Agent: search-before-build" "https://registry.modelcontextprotocol.io/v0.1/servers?search=io.github.github%2Fgithub-mcp-server&version=latest&limit=3"
```

Use `metadata.nextCursor` from a response for pagination when needed. API schema: `https://registry.modelcontextprotocol.io/openapi.json`.

## Maven Central

**Main content:** JVM artifacts, group IDs, artifact IDs, versions, packaging, classifiers, and repository coordinates.

**Use when:** Searching Java, Kotlin, Scala, Clojure, Android, Maven, or Gradle dependencies.

```bash
curl -L -H "User-Agent: search-before-build" "https://search.maven.org/solrsearch/select?q=guice&rows=3&wt=json"
curl -L -H "User-Agent: search-before-build" "https://search.maven.org/solrsearch/select?q=g%3Acom.google.inject%20AND%20a%3Aguice&rows=3&wt=json"
curl -L -H "User-Agent: search-before-build" "https://search.maven.org/solrsearch/select?q=g%3Aorg.apache.maven*&rows=3&wt=json"
```

Use `g:` for group/organization and `a:` for artifact name. Official guide: `https://central.sonatype.org/search/rest-api-guide/`.

## crates.io

**Main content:** Rust crates, descriptions, versions, owners, categories, keywords, downloads, licenses, repository links, and dependency metadata.

**Use when:** The project is written in Rust or a reusable Rust crate could satisfy the need. The API examples are the default anonymous path. If Cargo is already installed, its official `cargo search` command is also suitable; do not install Rust merely to search.

```bash
curl -L -H "User-Agent: search-before-build (repository research)" "https://crates.io/api/v1/crates?q=serde&per_page=3"
curl -L -H "User-Agent: search-before-build (repository research)" "https://crates.io/api/v1/crates/serde"
curl -L -H "User-Agent: search-before-build (repository research)" "https://crates.io/api/v1/crates?page=1&per_page=3&sort=downloads"
```

## Hugging Face Hub

**Main content:** Models, datasets, Spaces, model/dataset cards, tags, authors, licenses, downloads, likes, files, and update activity.

**Use when:** The need involves ML models, embeddings, inference, training data, benchmarks, demos, or a reusable AI application. Public resources can be searched without login; gated/private content cannot.

With the official `hf` CLI available:

```bash
hf models ls --search bert --author google --limit 3 --format json
hf datasets ls --search code --limit 3 --format json
```

With the official Python client available:

```bash
python -c "from huggingface_hub import HfApi; print([m.id for m in HfApi().list_models(search='whisper', author='openai', limit=3)])"
```

Do not install `huggingface_hub` automatically during normal research. Fall back to the Hub's public web/API surface when neither official client is present.

## arXiv

**Main content:** Research-paper metadata, titles, abstracts, authors, categories, submission/update dates, journal references, DOIs, and PDF links. Responses are Atom XML.

**Use when:** Looking for algorithms, academic precedents, evaluations, benchmarks, or recent research—not ordinary software packages.

```bash
curl -L -H "User-Agent: search-before-build/0.1 (repository research)" "https://export.arxiv.org/api/query?search_query=ti%3A%22retrieval%20augmented%20generation%22&start=0&max_results=3"
curl -L -H "User-Agent: search-before-build/0.1 (repository research)" "https://export.arxiv.org/api/query?search_query=au%3AHinton_G&start=0&max_results=3"
curl -L -H "User-Agent: search-before-build/0.1 (repository research)" "https://export.arxiv.org/api/query?search_query=cat%3Acs.AI%20AND%20all%3Aagent&start=0&max_results=3&sortBy=submittedDate&sortOrder=descending"
```

Wait at least three seconds between repeated calls, keep result pages small, and cache identical queries. Official manual: `https://info.arxiv.org/help/api/user-manual.html`.

## Adding a user-provided source

The user may request another source. Add it only after checking its official documentation and successfully running every example. Preserve this format:

````markdown
## <Source name>

**Main content:** <What it indexes and which metadata it returns.>

**Use when:** <The request types that justify querying it.>

```bash
<1–3 tested, read-only, anonymous calls>
```

<Authentication, rate-limit, coverage, or freshness caveats.>
````

Prefer official, read-only, anonymous interfaces. If authentication is required, state it and obtain consent before configuration; never silently add credentials or dependencies. Record the verification date when updating commands.
