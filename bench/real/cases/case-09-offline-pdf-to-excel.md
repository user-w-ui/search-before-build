# Case 09 · 离线 PDF 表格转 Excel 工具（assess，Linux 桌面）

| 项 | 值 |
| --- | --- |
| 技能（B 臂） | `search-before-build-assess` |
| 模拟用户语言 | English |
| 补充材料 | 无 |
| 真实需求来源 | [LocalPDF Studio issue #21：offline PDF to Excel](https://github.com/Alinur1/LocalPDF_Studio/issues/21)（公开 feature request） |
| 对比焦点 | 表格结构还原、离线与隐私约束、Linux 桌面分发、OCR 与布局解析生态 |

## Source and assessment focus

The source request is from a user running a lightweight PDF suite completely offline on Debian 13. They need to extract financial tables, corporate reports, and bank/brokerage statements into LibreOffice Calc or Excel; existing Linux tools either lose column structure or upload documents to an online service. The requested feature is a dashboard block that exports structured tables to `.xlsx` or `.csv`, using layout-aware parsers such as Tabula where appropriate.

This case tests whether the agent compares the actual table-extraction layer—Camelot, Tabula, pdfplumber, OCR/table models, and desktop applications—rather than treating “PDF text extraction” as equivalent to preserving rows and columns. It also tests whether offline operation and scanned PDFs are separated as different technical paths.

## User prompt (use verbatim for both arms)

```text
I want to build a small Linux desktop tool that converts tables in PDFs into clean Excel or CSV files. I regularly receive bank statements, brokerage notes, and corporate reports; the current tools either scramble the columns or upload sensitive documents to a server. It should work fully offline on Debian, handle both text-based PDFs and scanned pages, let me preview the detected table before export, and preserve numbers and dates well enough for manual checking in LibreOffice Calc. I am considering adding this to an existing open-source PDF utility. Is it worth building?
```

## Clarification script (answer only if asked)

1. Document mix → `About 70% have selectable text and 30% are scans. Tables range from one page to 40 pages, usually with repeated headers and occasional merged cells.`
2. Accuracy and review → `The exported file is for analysis and reconciliation, not automatic accounting. I need a visual preview, cell-level edits, and a clear warning when OCR confidence is low.`
3. Environment and distribution → `Debian 13 on x86_64, no cloud account, and no GPU requirement. A local web UI bundled with the desktop app is fine if the files never leave the machine.`
4. Reuse preference → `I would rather integrate a mature parser or existing desktop project than maintain a new PDF engine. The missing piece may be the preview and export workflow.`
5. Pre-research confirmation (B arm) → `Confirmed.`

## B-arm routing observation table

| Source | Strength | Trigger |
| --- | --- | --- |
| GitHub | must | Open-source PDF desktop tools, table extractors, OCR pipelines |
| PyPI / package registries | must | Camelot, Tabula wrappers, pdfplumber, OCR/table models and version/platform data |
| web (host/DDG fallback) | must | Commercial converters and official offline/privacy claims |
| Official documentation | must | Verify supported PDF types, merged cells, OCR, export formats, and Linux support |
| Hugging Face Hub | optional | Table-structure and document-understanding models for scanned PDFs |

## Evidence to record

- [ ] Candidate list: desktop applications, libraries, and OCR/table models with links and a capability-level description.
- [ ] Separate text-PDF extraction from scanned-PDF OCR; record evidence for merged cells, repeated headers, numeric/date preservation, and `.xlsx` export.
- [ ] Verify offline behavior, Linux packaging, licenses, and whether a candidate silently depends on a remote API.
- [ ] Identify the smallest reusable seam: parser, preview/edit grid, export layer, or document queue.
- [ ] Source coverage and query terms in both arms; note whether A arm relies on generic “PDF converter” lists.
- [ ] B-arm kernel: deduplicate the same parser across PyPI/GitHub/web and preserve warnings for candidates that only extract plain text.
- [ ] Final recommendation and evidence excerpts from both arms.

## Comparison focus

1. Which arm recognizes that table structure and scanned-page OCR are separate requirements?
2. Does either arm find an existing offline Linux tool that can be adapted, and does it verify the claim from documentation or only a search snippet?
3. Are privacy, licensing, packaging, and preview/review workflow reflected in the recommendation?
4. Is the proposed scope an adoptable integration around mature parsers, or an unjustified attempt to build a new PDF engine?

