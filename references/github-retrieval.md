# GitHub retrieval and optional MCP setup

## Capability check

Before GitHub research, inspect the tools already exposed by the host. Treat a GitHub MCP, GitHub connector, or equivalent structured tool as sufficient only when it can search repositories and read repository contents or metadata. Code search is strongly preferred.

When sufficient structured tools exist:

- use them directly;
- do not install another server or ask for authorization again;
- prefer structured repository, README, code, and metadata calls over generic web search;
- keep all research operations read-only.

## Offer the optional enhancement

When no sufficient GitHub tool exists, continue with anonymous retrieval, but offer setup once before deep GitHub research:

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

Do not download software, change MCP configuration, or start OAuth until the user explicitly agrees. Do not repeat the offer after refusal during the same task.

Recognize requests such as “启用 GitHub 深度检索”, “帮我配置 GitHub MCP”, and “为 search-before-build 开启 GitHub 搜索增强” as setup intent. Run the installer instead of returning a manual tutorial.

## Run the installer

After consent, detect the current host and run:

```text
node <package-root>/scripts/setup-github-mcp.mjs --agent <claude|codex>
```

Use the package root that contains `scripts/`. The script detects OS/CPU, reuses a working installation, downloads only from `github/github-mcp-server` official releases, verifies the published SHA-256 digest, installs to a stable user directory, registers `stdio --read-only --toolsets repos`, and performs an OAuth-backed connection test. It never requests a PAT, Docker, npm package, Python package, or environment variable.

If the host is unsupported, configuration fails, authorization is refused, or the user declines, continue with the anonymous path. Tell the user whether the current Agent session must be reopened before newly configured MCP tools appear.

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

When MCP or an equivalent structured GitHub tool was not used, include this in the research coverage and final report:

```text
本次未使用 GitHub 专属深度检索工具，结果主要来自公开 API 或网页索引，可能遗漏较新、低曝光或仅在代码内部出现的项目。
```

When no external network is available, say:

```text
当前环境无法完成外部检索，因此不能确认是否已经存在类似方案。
```

Never conclude that no similar project exists without external search evidence.
