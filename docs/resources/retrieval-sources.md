# 检索来源归类目录

本目录只收录两类来源，目的是把用户需要提前配置的内容压到最低：

- **匿名（免鉴权）**：直接调用，无需 API key、无需注册、无需登录。
- **免费注册**：需要注册账号拿一个免费 API key，但有免费层，不产生强制付费。

付费-only 的来源不收录。本插件不维护一整套检索生态，检索是可替换的廉价输入层；每个"信息来源类别"只要有一个可用工具即可。

每个来源条目含三部分：**调用方式**（查询输入需要什么）、**返回结构样例**（真实抓取的精简结构）、**关键字段**（为后续归一化聚合做参考）。

## 复用优先原则

调用顺序遵循"先复用、再兜底"，而不是"自己造"：

1. 宿主原生 web search（Claude 官方 `web_search`、Codex hosted search、OpenCode 内置 web search 等）可用 → 直接用，不重复配置。
2. 用户已装的 search MCP（Tavily / Exa / Brave 等）可用 → 直接用。
3. 以上都没有 → 走本目录里的匿名兜底命令。

这意味着"通用网页搜索"这类，本目录只提供匿名兜底；当宿主或已装 MCP 能覆盖时，本目录的那条命令甚至不会被触发。

## 渐进归一化观察字段

下面是整合层希望尽量提取的内部观察字段，不是外部工具必须满足的契约。原始返回始终按 `unknown payload` 接收；字段缺失只关闭相应的排序、去重或证据能力，不能导致整批失败。

| 字段 | 要求 | 说明与可能来源 |
| --- | --- | --- |
| `record_id` | 插件生成 | 本次运行内稳定标识，不要求来源提供 |
| `raw_ref` | 插件生成 | 指向原始 payload 或其中条目的位置，用于回溯核验 |
| `source_id` | 可选 | 来源类别；优先使用路由上下文，未知时保持为空 |
| `provider` | 可选 | 调用方提供的 hint 或已知 Profile，不从返回形状强行猜测 |
| `identities[]` | 可选 | PURL、GitHub `owner/repo`、DOI、arXiv ID、MCP 名称、规范化 URL 等 identity candidates |
| `title` | 可选 | `title` / `name` / `full_name` 等高置信度别名 |
| `url` | 可选 | `url` / `html_url` / `repository_url` / DOI 等可安全转换的地址 |
| `snippet` / `description` / `fragments` | 可选 | 摘要、README 片段、纯文本或 Markdown 内容 |
| `published_at` / `updated_at` | 可选 | 仅在能可靠解析时转成 ISO8601；缺失记为 unknown，不计 0 分 |
| `stars` / `downloads` / `citations` | 可选 | 采纳信号；缺失时跳过对应特征，不惩罚候选 |
| `language` / `ecosystem` / `license` | 可选 | 技术栈、生态和许可证观察值 |
| `provider_rank` / `provider_score` | 可选 | 只在来源明确提供或返回顺序可解释时记录，不跨来源直接混分 |
| `warnings[]` | 插件生成 | 缺字段、类型转换失败、未知结构或冲突等可观察降级信息 |

去重采用多级 identity：PURL / DOI / arXiv / MCP 名称等精确身份优先，其次是 GitHub 仓库和规范化 URL。只有 URL 时可以按 URL 合并；没有稳定 identity 时只保留运行内 `record_id`，不做激进跨源合并。`source_id + provider` 也不自动等于独立证据，仍需检查它们是否指向同一原始页面或相互转载。

## 总览表

| 信息来源类别 | 鉴权方式 | 主力来源 | 覆盖内容 |
| --- | --- | --- | --- |
| 通用网页搜索（产品/SaaS/讨论/文档） | 匿名 | DuckDuckGo HTML | 网页索引、产品主页、社区讨论 |
| 通用网页搜索 | 免费注册 | Brave / Tavily / Serper / Exa | 同上，质量更高、agent 友好 |
| 源码与仓库 | 匿名 | GitHub 公开 REST | 公开仓库、README、issues、license |
| 源码与仓库 | 免费注册（OAuth） | GitHub MCP | 深度检索（code search 等），需用户同意 |
| 包注册中心（跨生态元数据） | 匿名 | Ecosyste.ms Packages | npm/PyPI/crates/Maven/Go/RubyGems/NuGet/Packagist |
| 包注册中心（语言直连） | 匿名 | npm / crates.io / Maven Central | 单语言包元数据，可作补充与校验 |
| Agent 工具与 MCP 服务 | 匿名 | Official MCP Registry | 已发布的 MCP server |
| 模型、数据集与 AI 工件 | 匿名 | Hugging Face Hub | 模型、数据集、Spaces |
| 学术论文与预印本 | 匿名 | arXiv | 预印本、算法、基准 |
| 正式发表与 DOI | 匿名 | Crossref / OpenAlex | 正式发表论文、引用网络 |
| 社区真实需求信号 | 匿名 | Hacker News Algolia | "有没有人讨论过这个痛点" |
| 百科与概念背景 | 匿名 | Wikipedia REST | 概念定义、技术背景快速核对 |
| 内容提取与一手验证 | 匿名 | Jina Reader | 任意网页转 markdown，核验候选 |
| 文档检索（宿主侧） | 免费注册 | Context7 | 库/框架的官方文档片段 |
| 代码搜索（宿主侧） | 免费注册 | grep.app | 跨仓库代码模式搜索，补 GitHub 匿名无 code search |

下面按类别给出经过验证的匿名调用示例 + 真实返回结构。免费注册类只列端点与结构要点。

---

## 通用网页搜索（产品/SaaS/讨论/文档）

### DuckDuckGo HTML（匿名）

**调用方式**：`GET https://html.duckduckgo.com/html/?q=<url编码查询>`。Header 需浏览器 UA（否则易被拒）。无 recency 参数，无分页参数（靠 `s` 偏移）。返回 HTML，需解析 `.result__a`（标题+href）、`.result__snippet`（摘要），并解码 `uddg=` 重定向参数得到真实 URL。

```bash
curl -s -A "Mozilla/5.0 (compatible; search-before-build/0.1)" \
  "https://html.duckduckgo.com/html/?q=vite+build+tool"
```

**返回结构样例**（解析后，每条结果）：

```text
href(uddg): //duckduckgo.com/l/?uddg=https%3A%2F%2Fvite.dev%2Fguide%2Fbuild&rut=...
title: Building for Production | Vite
snippet: Building for Production When it is time to deploy your app for production, simply run the vite build
```

**关键字段**：`title`（`.result__a` 文本）、`url`（解码 `uddg=` 参数）、`snippet`（`.result__snippet` 文本）。无日期、无采纳信号。`url` 需 URL 解码 `uddg` 值。已验证：200，10 条结果。

### 宿主原生 web search（复用优先，代表：本会话 websearch 工具）

**调用方式**：宿主暴露的 web search 工具，输入 `query` + `numResults`。无需自建。

**返回结构样例**（websearch 工具，query="vite build tool"）：

```json
{
  "results": [
    { "url": "https://vite.dev/guide", "title": "Getting Started | Vite",
      "publish_date": null,
      "excerpts": ["Vite ... is a build tool that aims to provide a faster ... HMR ..."] },
    { "url": "https://www.hostinger.com/tutorials/what-is-vite/", "title": "What is Vite? ...",
      "publish_date": "2026-06-12", "excerpts": ["..."] }
  ],
  "session_id": "ses_..."
}
```

**关键字段**：`url`、`title`、`publish_date`（可空）、`excerpts`（片段数组）。注意：宿主原生搜索是"复用优先"层，不归我们维护，但其返回同样映射进归一化 schema（`source_id=web`、`provider=host`）。

### Tavily（免费注册，宿主侧代表：tavily_search 工具）

**调用方式**：`query` + `max_results` + `search_depth`(`basic`/`fast`/`advanced`)。需 `tvly-` key（宿主已装 MCP 时由宿主管理）。

**返回结构样例**（tavily_search，query="vite build tool"）：

```json
{
  "query": "vite build tool",
  "answer": null,
  "results": [
    { "url": "https://codeanywhere.com/.../vite-...", "title": "Vite: The JavaScript Build Tool...",
      "content": "## What is Vite?\n\nAt its core, Vite ... is a modern build tool created by Evan You ...",
      "score": 0.9008183, "raw_content": null, "id": "d0f27a-00" }
  ],
  "response_time": 0.19, "request_id": "...", "auth_mode": "keyed"
}
```

**关键字段**：`url`、`title`、`content`（较长正文，比 snippet 信息量大）、`score`（相关性分数，0–1，可做初排）、`answer`（可选合成答案）。这是 agent 友好型搜索的典型结构：自带 `score` 和 `content`，归一化时 `snippet` 取 `content` 截断、`stars` 留空、用 `score` 做相关性 rerank。

### Brave / Serper / Exa（免费注册）

- **Brave**：`X-Subscription-Token` header，返回 `{web:{results:[{title,url,description,age?,extra_snippets?}]}}`，`age` 可做时效。
- **Serper**：Google SERP 包装，返回 `{organic:[{title,link,snippet,position,date?}], ...}`。
- **Exa**：语义搜索，`{results:[{title,url,text?,publishedDate?,score?}]}`，`publishedDate` 做时效、`score` 做 rerank，擅长按意图找相似项目。

（以上结构来自各自官方文档；接入时以实测为准。）

---

## 源码与仓库

### GitHub 公开 REST（匿名）

**调用方式**：`GET https://api.github.com/search/repositories?q=<编码>&per_page=30`。Header：`Accept: application/vnd.github+json`、`X-GitHub-Api-Version: 2022-11-28`、`User-Agent`。匿名配额小、按源 IP 共享，看 `X-RateLimit-Remaining`。代码搜索 REST 需认证，**匿名不可用**。详细能力检查与回退见 `references/github-retrieval.md`。

**返回结构样例**（q=vite）：

```json
{
  "total_count": 384373,
  "incomplete_results": false,
  "items": [
    { "id": 257485422, "name": "vite", "full_name": "vitejs/vite",
      "description": "Next generation frontend tooling. It's fast!",
      "stargazers_count": 82563, "forks_count": 8684,
      "language": "TypeScript", "archived": false,
      "updated_at": "2026-08-28T06:28:20Z", "html_url": "https://github.com/vitejs/vite",
      "license": {...}, "topics": [...], "default_branch": "main", "score": 1.0 }
  ]
}
```

**关键字段**：`full_name`、`html_url`（→`url`）、`description`（→`snippet`/`description`）、`stargazers_count`（→`stars`）、`updated_at`/`pushed_at`（→`date`）、`language`、`license.spdx_id`、`archived`（废弃信号）、`topics`、`forks_count`。item 字段极多（70+），归一化只取上列。`total_count` 可做覆盖账本的"该类别结果总量"。

### GitHub MCP（免费注册，OAuth）

OAuth，无 PAT、无 Docker。仅作可选深度检索增强，且只在用户明确同意后配置。流程见 `references/github-retrieval.md`。返回结构取决于 MCP server 的工具 schema，归一化同样映射到 `source_id=repo`。

---

## 包注册中心（跨生态元数据）

### Ecosyste.ms Packages（匿名）

**调用方式**：`GET https://packages.ecosyste.ms/api/v1/packages/lookup?purl=pkg%3A<ecosystem>%2F<name>`（PURL 查询，精确解析同一组件）。或按注册中心列包：`/api/v1/registries/<registry>/packages/<name>`。Header：`User-Agent`。一个 API 覆盖 npm/PyPI/crates/Maven/Go/RubyGems/NuGet/Packagist。

**返回结构样例**（purl=npm/express）：

```json
[
  { "name": "express", "ecosystem": "npm",
    "description": "Fast, unopinionated, minimalist web framework",
    "licenses": ["MIT"], "normalized_licenses": ["MIT"],
    "repository_url": "https://github.com/expressjs/express",
    "latest_release_number": "...", "latest_release_published_at": "...",
    "versions_count": ..., "first_release_published_at": "...",
    "dependent_packages_count": ..., "downloads": ..., "downloads_period": "...",
    "rankings": {...}, "registry_url": "...", "purl": "pkg:npm/express",
    "registry": { "name": "npmjs.org", "ecosystem": "npm", ... } }
]
```

**关键字段**：`name`、`ecosystem`/`registry.name`（→`ecosystem`）、`description`（→`snippet`）、`repository_url`（→`url`，可交叉到 GitHub）、`normalized_licenses`（→`license`）、`latest_release_published_at`（→`date`）、`downloads`/`dependent_packages_count`（→`downloads` 采纳信号）、`rankings`。`purl` 是跨生态统一标识，适合去重时跨语言合并同一组件。

## 包注册中心（语言直连，补充与校验）

### npm search（匿名）

**调用方式**：`npm search <query> --json --searchlimit=N`。返回 JSON 数组。

**返回结构样例**（vite）：

```json
[
  { "name": "vite", "version": "8.2.2",
    "description": "Native-ESM powered web dev build tool",
    "keywords": ["build-tool","dev-server","framework","frontend","hmr","vite"],
    "publisher": {...}, "maintainers": [...],
    "license": "MIT", "date": "2026-08-20T04:14:39.107Z",
    "links": { "homepage": "https://vite.dev",
               "repository": "git+https://github.com/vitejs/vite.git",
               "npm": "https://www.npmjs.com/package/vite" } }
]
```

**关键字段**：`name`、`version`、`description`（→`snippet`）、`date`（→`date`）、`license`、`keywords`、`links.npm`（→`url`）、`links.repository`（→交叉到 repo）。注意 npm search 是宽文本匹配，非严格作者过滤。

### crates.io（匿名）

**调用方式**：`GET https://crates.io/api/v1/crates?q=<query>&per_page=N`。Header：`User-Agent`（必填，否则 403）。遇 429 退避。

**返回结构样例**（serde）：

```json
{
  "crates": [
    { "id": "serde", "name": "serde",
      "description": "A generic serialization/deserialization framework",
      "max_version": "1.0.229", "downloads": 1320386937,
      "repository": "https://github.com/serde-rs/serde",
      "documentation": "...", "homepage": "...",
      "keywords": [...], "categories": [...], "created_at": "...", "updated_at": "..." }
  ],
  "meta": { "total": ... }
}
```

**关键字段**：`name`、`description`（→`snippet`）、`repository`（→`url`）、`downloads`（→`downloads`）、`max_version`、`updated_at`（→`date`）。`license` 在 crate 列表里为 null（需查 `/api/v1/crates/<id>` 详情）。

### Maven Central（匿名）

**调用方式**：`GET https://search.maven.org/solrsearch/select?q=<query>&rows=N&wt=json`。偶有超时，重试即可。`g:` group、`a:` artifact 做精确。

**返回结构样例**（guice）：

```json
{
  "responseHeader": { "status": 0, "QTime": ... },
  "response": { "numFound": 979, "start": 0,
    "docs": [
      { "id": "org.openidentityplatform.commons:guice",
        "g": "org.openidentityplatform.commons", "a": "guice",
        "latestVersion": "2.3.0", "repositoryId": "central",
        "p": "pom", "timestamp": 1750337779639,
        "versionCount": 24, "text": [...], "ec": [".pom"] }
    ] },
  "spellcheck": {...}
}
```

**关键字段**：`g`+`a`（group+artifact = 坐标，→`name`/`title`）、`latestVersion`、`timestamp`（毫秒，→`date` 需转 ISO）、`versionCount`、`p`（packaging）。`numFound` 做覆盖总量。描述/仓库链接需二次查询 `/solrsearch/select?q=g:... AND a:...&core=gav`。

---

## Agent 工具与 MCP 服务

### Official MCP Registry（匿名）

**调用方式**：`GET https://registry.modelcontextprotocol.io/v0.1/servers?search=<query>&limit=N`。Header：`User-Agent`。用 `metadata.nextCursor` 分页。OpenAPI：`https://registry.modelcontextprotocol.io/openapi.json`。

**返回结构样例**（search=filesystem，注意嵌套）：

```json
{
  "servers": [
    { "server": {
        "$schema": "...", "name": "com.pulsemcp/remote-filesystem",
        "description": "MCP server for remote filesystem operations on cloud storage ...",
        "repository": { "url": "https://github.com/pulsemcp/mcp-servers",
                        "source": "github", "subfolder": "experimental/remote-filesystem" },
        "version": "0.1.2", "packages": [...] },
      "_meta": {...} }
  ],
  "metadata": { "nextCursor": "...", "count": ... }
}
```

**关键字段**：注意每项是 `{server:{...}, _meta:{...}}` 包裹，真实字段在 `server` 子对象内：`name`（→`title`，形如 `org/name`）、`description`（→`snippet`）、`repository.url`（→`url`）、`version`、`packages`（安装方式）。`id` 字段在该 schema 下常为 null，用 `name` 做主键。

---

## 模型、数据集与 AI 工件

### Hugging Face Hub（匿名）

**调用方式**：模型 `GET https://huggingface.co/api/models?search=<query>&limit=N`；数据集 `/api/datasets?search=...`；Spaces `/api/spaces?search=...`。`hf` CLI 或 `huggingface_hub` 客户端可用时优先；否则走公共 Web API。公共资源免登录可搜；gated/private 不可。不要自动安装客户端。

**返回结构样例**（models，search=bert）：

```json
[
  { "_id": "621ffdc036468d709f174338", "id": "google-bert/bert-base-uncased",
    "modelId": "google-bert/bert-base-uncased",
    "likes": 2743, "trendingScore": 4, "downloads": 86510509,
    "tags": ["transformers","pytorch","tf","jax","bert","fill-mask","en",
             "arxiv:1810.04805","license:apache-2.0",...],
    "pipeline_tag": "fill-mask", "library_name": "transformers",
    "createdAt": "2022-03-02T23:29:04Z", "private": false }
]
```

**关键字段**：`id`/`modelId`（→`title`，形如 `org/model`）、`tags` 内含 `license:xxx`/`arxiv:xxx`/语言/框架（→`license`、可交叉到 arXiv）、`downloads`/`likes`（→采纳信号）、`pipeline_tag`（任务类型）、`createdAt`（→`date`）。URL 规则：`https://huggingface.co/<modelId>`。数据集端点结构类似，字段有 `datasetId`/`tags`/`downloads`。

---

## 学术论文与预印本

### arXiv（匿名）

**调用方式**：`GET https://export.arxiv.org/api/query?search_query=<query>&start=0&max_results=N`。`search_query` 支持 `ti:`(标题)、`au:`(作者)、`cat:`(分类)、`all:`。返回 **Atom XML**。重复调用间隔 ≥3 秒，缓存相同查询。手册：`https://info.arxiv.org/help/api/user-manual.html`。

**返回结构样例**（ti:"retrieval augmented generation"）：

```xml
<feed xmlns="http://www.w3.org/2005/Atom">
  <entry>
    <id>http://arxiv.org/abs/2305.06983v2</id>
    <title>Active Retrieval Augmented Generation</title>
    <summary>Despite the remarkable ability of large language models ...</summary>
    <updated>2023-10-22T00:11:13Z</updated>
    <published>2023-05-11T17:13:40Z</published>
    <author><name>...</name></author>  <!-- 多个 author -->
    <link href="https://arxiv.org/abs/2305.06983v2" rel="alternate"/>
    <link href="https://arxiv.org/pdf/2305.06983v2" rel="related" type="application/pdf"/>
  </entry>
</feed>
```

**关键字段**：`title`、`summary`（abstract，→`snippet`/`description`）、`id`/`link[rel=alternate]`（→`url`）、`published`/`updated`（→`date`）、`author/name`（作者数）。`id` 形如 `http://arxiv.org/abs/<arxivId>v<n>`，归一化时可提取 arxivId 与 HF `tags` 里的 `arxiv:xxx` 交叉。

## 正式发表与 DOI

### Crossref（匿名）

**调用方式**：`GET https://api.crossref.org/works?query=<query>&rows=N`。建议加 `mailto=` 进 polite pool 提升速率。返回 JSON。

**返回结构样例**（query=retrieval augmented）：

```json
{
  "status": "ok",
  "message-type": "work-list",
  "message": {
    "items": [
      { "DOI": "10.1002/9781394374717.ch03",
        "title": ["Retrieval-Augmented Generation"],
        "container-title": ["Advanced Retrieval-Augmented Generation"],
        "type": "other", "publisher": "Wiley",
        "published": { "date-parts": [[2026, 6, 30]] },
        "is-referenced-by-count": ..., "URL": "https://doi.org/10.1002/...",
        "license": [...], "issued": {...} }
    ]
  }
}
```

**关键字段**：`DOI`（→`url` 用 `https://doi.org/<DOI>`，可交叉）、`title[0]`（数组，→`title`）、`container-title[0]`（期刊/书名）、`published.date-parts`（→`date`，需从 `[[Y,M,D]]` 拼 ISO）、`is-referenced-by-count`（→`citations`）、`type`、`URL`。补 arXiv：arXiv 只有预印本，Crossref 覆盖正式发表。

### OpenAlex（匿名，有日额度）

**调用方式**：`GET https://api.openalex.org/works?search=<query>&per-page=N&mailto=<email>`。匿名有每日 API budget，超了等 UTC 午夜重置；加 `mailto=` 提升额度。

**返回结构样例**（结构来自官方文档与首次响应；实测时 IP 日额度已耗尽返回 429，非鉴权失败）：

```json
{
  "meta": { "count": ..., "per_page": ..., "next_cursor": "..." },
  "results": [
    { "id": "https://openalex.org/W...",
      "doi": "https://doi.org/10....",
      "title": "...",
      "publication_year": 2024,
      "cited_by_count": 123,
      "authorships": [ { "author": {...}, "institutions": [...] } ],
      "concepts": [...], "type": "...", "publication_date": "2024-..." }
  ]
}
```

**关键字段**：`id`、`doi`（→`url`，与 Crossref 交叉去重）、`title`、`publication_year`/`publication_date`（→`date`）、`cited_by_count`（→`citations`）、`authorships`、`concepts`（主题分类）。`meta.count` 做覆盖总量，`meta.next_cursor` 翻页。比 Crossref 现代，有引用网络。

---

## 社区真实需求信号

### Hacker News Algolia（匿名）

**调用方式**：`GET https://hn.algolia.com/api/v1/search?query=<query>&hitsPerPage=N`。按时间排序用 `tags=story` + `numericFilters=created_at_i>...`。免 key。

**返回结构样例**（query=vite）：

```json
{
  "hits": [
    { "objectID": "47360730", "title": "Vite 8.0 Is Out",
      "url": "https://vite.dev/blog/announcing-vite8",
      "points": 560, "num_comments": 202,
      "created_at": "2026-03-13T04:36:40Z", "created_at_i": 1741834599,
      "author": "kothariji", "_tags": ["story","author_...","year_2026"] }
  ],
  "nbHits": ..., "page": 0, "nbPages": ..., "hitsPerPage": 2
}
```

**关键字段**：`title`、`url`（外链，→`url`）、`points`/`num_comments`（→采纳信号，反映社区关注度）、`created_at`/`created_at_i`（→`date`）、`author`、`objectID`（HN 主键）。用途：necessity check——验证"有没有人讨论过这个痛点/做过这个想法"。无 `url` 的帖子是 Ask/Show HN（正文在 HN 站内）。

---

## 百科与概念背景

### Wikipedia REST（匿名）

**调用方式**：`GET https://<lang>.wikipedia.org/api/rest_v1/page/summary/<title>`。多语言换 lang 子域。

**返回结构样例**（summary）：

```json
{
  "type": "standard", "title": "Retrieval-augmented generation",
  "displaytitle": "Retrieval-augmented generation",
  "description": "Type of information retrieval using LLMs",
  "extract": "Retrieval-augmented generation (RAG) is a technique that enables ...",
  "extract_html": "...",
  "content_urls": { "desktop": { "page": "https://en.wikipedia.org/wiki/..." },
                    "mobile": { "page": "..." } },
  "timestamp": "...", "pageid": ...
}
```

**关键字段**：`title`、`extract`（→`snippet`/`description`）、`content_urls.desktop.page`（→`url`）、`description`。用途：需求澄清期的快速概念核对。无采纳信号。全文用 `/api/rest_v1/page/html/<title>` 或 wikitext。

---

## 内容提取与一手验证

### Jina Reader（匿名）

**调用方式**：`GET https://r.jina.ai/<目标URL>`。把任意网页转 markdown，免 key（有速率限制；更高速率需 key）。这是**验证层**不是发现层——拿到候选 URL 后，用它把主页/文档转成干净 markdown 供 LLM 从原文核验。

```bash
curl -sL "https://r.jina.ai/https://example.com"
```

**返回结构样例**：

```text
Title: Example Domain

URL Source: https://example.com/

Published Time: Tue, 18 Aug 2026 20:06:42 GMT

Warning: This is a cached snapshot of the original page, consider retry with caching opt-out.

Markdown Content:
This domain is for use in documentation examples without needing permission. Avoid ...
```

**关键字段**：纯文本，`Title:`、`URL Source:`、`Published Time:`（→`date`，可空）、`Markdown Content:`（→`description`/`raw`，一手正文）。`Warning:` 行需注意（缓存快照，重要核验应加 `X-Cache-Control: no-cache` 重取）。归一化 `source_id=page`、`provider=jina`。

---

## 文档检索（宿主侧，复用优先）

### Context7（免费注册，宿主侧工具）

**调用方式**：先 `resolve-library-id`（libraryName + query）拿到 `/org/project` ID，再 `query-docs`（libraryId + query）取文档片段。无需自建。

**返回结构样例**：

- resolve 阶段：列表 `[{Title, "Context7-compatible library ID": "/vitejs/vite", Description, "Code Snippets": 1306, "Source Reputation": High, "Benchmark Score": 83.81, Versions:[...]}]`
- query 阶段：多个片段，每个含 `### 标题` + `Source: <github 文件 URL>` + 代码块/说明

```text
### Configure Vite conditionally based on command and mode
Source: https://github.com/vitejs/vite/blob/main/docs/config/index.md
import { defineConfig } from 'vite'
export default defineConfig(({ command, mode }) => { ... })
```

**关键字段**：`Source` URL（→`url`，可交叉验证到 GitHub）、标题、代码/说明正文（→`description`）。用途：核验某库"某能力是否存在 + 怎么用"，比 web 搜索更权威（直接取自官方文档/仓库）。归一化 `source_id=page`、`provider=context7`、`raw` 保留片段。

---

## 代码搜索（宿主侧，补 GitHub 匿名缺口）

### grep.app（免费，宿主侧工具）

**调用方式**：宿主侧 `grep-app_searchGitHub` 工具，输入字面代码模式（`query`，如 `defineConfig`）+ 可选 `language`/`repo`/`path`。GitHub 匿名 REST **不支持**代码搜索（需认证），grep.app 免费补这个缺口。

**返回结构样例**（query="defineConfig", language=TypeScript）：

```json
[
  { "Repository": "withastro/astro",
    "Path": "packages/astro/src/types/public/config.ts",
    "URL": "https://github.com/withastro/astro/blob/main/.../config.ts",
    "License": "Unknown",
    "Snippets": [
      { "Line": 111, "Text": "* A list of hostnames ... import { defineConfig } from 'astro/config'; ..." }
    ] }
]
```

**关键字段**：`Repository`（→`title`/可交叉到 GitHub repo）、`URL`（→`url`，含行锚点）、`Path`、`Snippets[].Text`（→`snippet`，带行号）、`License`。用途：验证"某模式/某 API 在真实代码里怎么用、哪些项目在用"，是 adaptable/reusable 路径的代码级证据。归一化 `source_id=repo`、`provider=grepapp`、`url` 用返回的 blob URL。

---

## 维护约定

- 新增来源前，先确认其鉴权档位（匿名 / 免费注册），并实测匿名调用成功。
- 免费额度数字会随时间变化，文中额度仅为大致量级，以各服务官方当前政策为准。
- 每个信息来源类别只要有一个可用工具即可；同类别新增来源只在"主力不可用且新源有明显优势"时才替换。
- 所有来源的原始返回都映射进"归一化目标字段"那套 schema，再进入去重/时效/交叉验证管线。原始条目保留在 `raw` 字段以备回溯。
