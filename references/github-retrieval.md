# GitHub retrieval and optional MCP setup

## Capability check

Before GitHub research, use this order. A route is usable only after a relevant read-only call succeeds; names and descriptions are discovery hints, not proof of availability.

1. Inspect the tools already exposed in the current Agent session. Before concluding that GitHub access is unavailable, explicitly check the exposed tool list for each common route:
   - a GitHub plugin or app;
   - a GitHub MCP server;
   - a GitHub connector or other built-in GitHub integration.

   Look at tool names and descriptions. Common repository-search functions include `search_repositories`, `search_installed_repositories`, or similarly described GitHub repository search. Common content and metadata readers include `fetch`, `fetch_file`, `get_file_contents`, `get_repository`, or similarly described README/file/repository readers. Code-search functions such as `search`, `search_code`, or `code_search` are strongly preferred when exposed. These names are examples, not an exhaustive allowlist: do not treat an unfamiliar tool name as absence when its description provides the same GitHub operation.

   Try the exposed route with repository search and repository content or metadata reading needed for the current task. If the calls fail, require authorization that is unavailable, or cannot support the research, continue to step 2. If they succeed, use the route directly, record which integration supplied it, keep all calls read-only, and do not offer another server.
2. When no exposed route works, check GitHub CLI availability with `gh --version` and existing authentication with `gh auth status`, then run a relevant read-only query. Suitable commands include `gh search repos`, `gh repo view`, `gh api` with its default `GET`, and `gh search code`. If any required check or query fails, continue to step 3. Do not start login, change authentication or configuration, or modify GitHub data during normal research.
3. When neither route works, tell the user that no GitHub dedicated deep-retrieval route is currently usable, then offer the optional official MCP setup once.

## Offer the optional enhancement

```text
当前没有检测到 GitHub 深度检索能力。

是否自动配置 GitHub 官方 MCP Server？

启用后将：
- 自动下载 GitHub 官方 MCP 程序；
- 自动写入当前 Agent 的 MCP 配置；
- 只启用仓库检索与读取能力，并强制只读；
- 首次连接时打开 GitHub 授权页面；
- 不要求创建 Personal Access Token、安装 Docker，或手动编辑配置。

你只需要确认安装，并在浏览器中登录 GitHub 后授权。
```

Requests such as “启用 GitHub 深度检索”, “帮我配置 GitHub MCP”, and “为 search-before-build 开启 GitHub 搜索增强” express enhancement intent, not installation consent. Complete the capability check first. If an existing route works, report that enhancement is already available. Otherwise, show the offer above and wait for explicit approval; do not download software, change configuration, or start OAuth before approval, and do not repeat the offer after refusal during the same task.

## Run the installer

After consent, detect the current host and run:

```text
node <package-root>/scripts/setup-github-mcp.mjs --agent <claude|codex>
```

Use the package root that contains `scripts/`. The script detects OS/CPU, reuses a working installation, downloads only from `github/github-mcp-server` official releases, verifies the published SHA-256 digest, installs to a stable user directory, registers `stdio --read-only --toolsets repos`, and performs an OAuth-backed connection test. It never requests a PAT, Docker, npm package, Python package, or environment variable.

If the host is unsupported, configuration fails, authorization is refused, or the user declines, continue with the anonymous path below. Tell the user whether the current Agent session must be reopened before newly configured MCP tools appear.

## Anonymous public REST path

Use an HTTP-capable host tool. Send these headers on every request:

```text
Accept: application/vnd.github+json
X-GitHub-Api-Version: 2022-11-28
User-Agent: search-before-build
```

Use only public endpoints:

```text
GET https://api.github.com/search/repositories?q=<encoded-query>&per_page=30
GET https://api.github.com/repos/<owner>/<repo>
GET https://api.github.com/repos/<owner>/<repo>/readme
GET https://api.github.com/repos/<owner>/<repo>/license
GET https://api.github.com/repos/<owner>/<repo>/issues?state=open&per_page=10
```

The repository response provides description, topics, default branch, stars, forks, update/push timestamps, archived status, and usually SPDX license metadata. Request the README with `Accept: application/vnd.github.raw+json` when raw Markdown is useful. GitHub's code-search REST endpoint requires authentication; never claim anonymous code search.

Inspect HTTP status and `X-RateLimit-Remaining`/`X-RateLimit-Reset`. Anonymous search and core API quotas are small and shared by source IP. On `403` caused by rate limiting, do not interpret missing data as absence. Fall back in this order:

1. `site:github.com` web search and official repository pages;
2. normal web search;
3. explicit unknowns.

Anonymous mode accesses only public repositories. Never imply access to private repositories, the user's account, or personal data.

## Required coverage statement

When neither an exposed structured GitHub tool nor the authenticated GitHub CLI was used, include this in the research coverage and final report:

```text
本次未使用 GitHub 专属深度检索工具，结果主要来自公开 API 或网页索引，可能遗漏较新、低曝光或仅在代码内部出现的项目。
```

Never conclude that no similar project exists without external search evidence.
