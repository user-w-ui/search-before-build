# Case 09 plugin turn log

- User prompt invoked verbatim from `bench/real/cases/case-09-offline-pdf-to-excel.md`.
- Clarification 1: About 70% have selectable text and 30% are scans. Tables range from one page to 40 pages, usually with repeated headers and occasional merged cells.
- Clarification 2: The exported file is for analysis and reconciliation, not automatic accounting. I need a visual preview, cell-level edits, and a clear warning when OCR confidence is low.
- Clarification 3: Debian 13 on x86_64, no cloud account, and no GPU requirement. A local web UI bundled with the desktop app is fine if the files never leave the machine.
- Clarification 4: I would rather integrate a mature parser or existing desktop project than maintain a new PDF engine. The missing piece may be the preview and export workflow.
- Pre-research summary: confirmed.
- Research completed after confirmation; no further clarification was necessary.
- Recommendation: Adapt.
