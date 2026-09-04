# Coverage

研究日期：2026-09-04。目标语言：简体中文；中文和英文查询均已执行。

| 路由 | 状态 | 证据与限制 |
| --- | --- | --- |
| 宿主 Web（中文） | used | 发票 OCR、中文票制、验真、交通票据和本地部署检索。 |
| 宿主 Web（英文） | used | Chinese VAT invoice OCR、self-hosted reimbursement、Outlook/Excel workflow 检索。 |
| GitHub | used | FP、Invoice Manager、Auromix expense-reimbursement-skill、PaddleOCR 主仓库/文档。 |
| PyPI | used | paddleocr 与 invoice2data 的分发、版本、许可证和平台元数据。 |
| Hugging Face Hub | limited | 触达 invoice-extraction 模型索引；未将通用/非中文模型当作中文增值税能力。 |
| ModelScope | limited | 进行了中文模型检索，但不足以支持具体模型、许可证或票种结论。 |
| 国家税务总局查验平台 | used | 核验代码、号码、日期、金额、验证码、五年范围和每日五次限制。 |
| npm | skipped | 指纹未触发 JavaScript/Node 组件需求；项目运行形态是 Windows/Linux 本地 Python/OCR。 |
| Maven Central / crates.io / MCP Registry / arXiv / Hacker News | skipped | 指纹没有 JVM、Rust、Agent 工具、论文算法或公共需求讨论触发条件。 |

主来源核验包括 FP README、Invoice Manager README、PaddleOCR PP-StructureV3 文档、invoice2data 文档/PyPI、百度/阿里云/腾讯云官方 OCR 文档、Outlook/Excel 官方连接器文档和国家税务总局查验平台。云 API 的字段覆盖不被推断为本地或合规支持。

内核统计：16 requests；0 failed；23 normalized records；8 duplicate observations merged；15 unique candidates；8 returned candidates；missing must-have capability mentions = 0。
