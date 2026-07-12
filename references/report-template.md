# Competitor report template

Write one report per competitor. Keep the report strictly about the competitor and its comparison with the current project. Do not include need clarification, necessity gates, Build/Stop decisions, MVP advice, or the earlier conversation.

Use this exact section order:

```markdown
# <竞品名称>

官方地址：[<项目或产品名称>](<primary URL>)

## 简介

<用一小段话说明竞品的定位、主要使用者和工作方式。>

## 与 <当前项目名称> 的对比

| 维度 | <竞品名称> | <当前项目名称> |
| --- | --- | --- |
| 核心定位 | ... | ... |
| 主要使用者 | ... | ... |
| 核心工作流 | ... | ... |
| 运行与使用方式 | ... | ... |
| 最重要的功能 | ... | ... |
| 扩展与集成 | ... | ... |
| 数据、部署与限制 | ... | ... |
| 维护与成熟度 | ... | ... |
| 许可证或价格 | ... | ... |
| 主要优势 | ... | ... |
| 主要局限 | ... | ... |

## 值得 <当前项目名称> 关注的设计

1. **<设计或机制>**：<已经验证的工作方式，以及它为什么值得关注。>

## 可复用或参考的启发

- <可以直接采用、试验或借鉴的具体做法。>
- <需要改造的部分，或不应照搬的边界。>

## 一句话总结

> <准确说明竞品与当前项目最重要的区别。>

## 资料来源

检索说明：<说明是否使用 GitHub 专属深度检索工具，以及无法访问或降级的渠道。>

- [<主要来源>](<URL>)
```

## Format rules

- Preserve the exact heading order. Do not add “你想解决什么”, “这个需求真的需要开发吗”, a verdict section, or an MVP section.
- Add or remove comparison rows only when a row materially affects the comparison. Keep the three columns and compact cells.
- Describe verified current behavior. Distinguish released, planned, inferred, and unverified capabilities.
- Use primary sources and date time-sensitive facts in the relevant cell or source note. Never cite a search-result page.
- When GitHub MCP or an equivalent structured GitHub tool was unavailable, include the exact anonymous-search limitation statement from `github-retrieval.md` under “资料来源”.
- Explain unavoidable technical terms briefly. Do not use product-management jargon.
- When several competitors are researched, create a separate canonical report for each competitor. Do not combine competitors into extra table columns.
