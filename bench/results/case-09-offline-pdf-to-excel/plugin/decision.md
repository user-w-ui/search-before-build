# Decision

## Recommendation: Adapt

The need is concrete: sensitive financial PDFs are currently either structurally scrambled or sent to servers, and the user requires offline operation plus a human review loop. Mature components already cover the hard extraction layers: Camelot or Tabula for text PDFs, OCRmyPDF for local OCR preprocessing, and optional table-structure models for scans. The smallest defensible scope is an integration around these components with page/region selection, visual preview, cell-level edits, confidence warnings, repeated-header handling, and validated XLSX/CSV export.

### Necessity gates

- Concrete problem: fact.
- Core function addresses it: fact from the prompt.
- Offline Debian delivery fits the constraint: inference supported by local parser/OCR options.
- Existing alternatives leave meaningful trouble: fact from the prompt; exact comparative accuracy is unknown.
- New engine is better than reuse: inference; the evidence favors adapting mature parsers and a review layer.

### Reusable option

Use Camelot as the primary text-PDF seam, OCRmyPDF plus a local OCR/table-structure path for scans, and borrow Tabula/Excalibur interaction patterns for region selection and preview.

### Remaining unknowns

Accuracy on representative bank and brokerage statements, CPU performance on Debian 13, exact dependency packaging, and trustworthy cell-level OCR confidence require a local sample evaluation.
