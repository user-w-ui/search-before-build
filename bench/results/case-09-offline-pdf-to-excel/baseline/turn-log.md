# Turn log

Run: `case-09-offline-pdf-to-excel`, arm `baseline`

This is an agent-self-recorded evidence log for a direct Codex subagent run. It is not a platform-exported raw transcript. The only product context used was the quoted request in the first user turn recorded in `session.jsonl`. No clarification was needed.

## Timestamps

- Run start, local: `2026-09-03T16:37:03.4594083+08:00`
- Run start, UTC: `2026-09-03T08:37:03.4632749Z`
- Research cutoff, local: `2026-09-03T16:44:59.6779639+08:00`
- Research cutoff, UTC: `2026-09-03T08:44:59.6816220Z`
- Per-call web timestamps were not exposed by the native web tool, so no per-call times are fabricated.

## Tool activity

- `web__run`: 22 calls.
- `web__run` calls containing `search_query`: 11 batches, 40 exact queries.
- `web__run` calls containing `open`: 11 batches, 74 open requests in total (52 reference-based opens and 22 direct URL opens).
- `exec_command` through `functions.exec`: 7 read-only/setup calls (timestamps, bench root listing, target directory creation, and format inspection of `bench/README.md`/`bench/metrics.mjs`).
- No Claude CLI, plugin, skill, MCP download/configuration, delegated agent, or external application was used.
- No file under `bench/real` or historical content under `bench/results` was read.

## Exact search queries

### Batch W01

1. `official Camelot PDF table extraction documentation scanned PDFs text-based PDF`
2. `official Tabula PDF table extraction Linux CSV Excel scanned PDF`
3. `official pdfplumber table extraction documentation OCR scanned PDF`
4. `official OCRmyPDF documentation OCR layer scanned PDFs offline`

### Batch W02

1. `official Docling PDF table extraction OCR local offline documentation`
2. `official Microsoft Table Transformer table extraction model card PDF images OCR`
3. `official Tesseract OCR documentation command line local offline Linux`
4. `official LibreOffice Calc CSV XLSX import documentation`

### Batch W03

1. `open source Linux desktop PDF table extraction GUI offline export CSV Excel Tabula Excalibur`
2. `GitHub open source Linux PDF table extraction GUI scanned OCR spreadsheet`
3. `official Excalibur PDF table extraction web interface Camelot preview export`
4. `official OCRFeeder Linux OCR tables spreadsheet export`

### Batch W06

1. `Anchor local AI data extraction open source offline PDF tables official`
2. `official gImageReader Linux open source PDF table extraction export CSV`
3. `official Paperwork Linux document manager OCR offline PDF export tables`
4. `official OCRmyPDF installation Debian Tesseract Ghostscript offline`

### Batch W08

1. `site:docling-project.github.io/docling export tables xlsx csv DataFrame Docling`
2. `site:github.com/docling-project/docling xlsx export table csv`
3. `site:github.com/tabulapdf/tabula releases Linux desktop table preview CSV Excel`
4. `site:github.com/camelot-dev/camelot financial tables accuracy parsing report export Excel CSV`

### Batch W09

1. `official PDF Arranger GitHub features Linux GTK PDF utility open source`
2. `official PDFsam Basic Linux open source PDF utility features`
3. `official Paperwork Linux document manager OCR project export`
4. `official PDF Studio Linux PDF table extraction Excel offline`

### Batch W11

1. `site:anchor.aidenpaleczny.com Linux Anchor local AI data extraction download`
2. `Anchor local AI data extraction GitHub Linux PDF spreadsheet`
3. `"Anchor" "Local AI Data Extraction" Linux`

### Batch W12

1. `official OCRmyPDF license MPL-2.0 GitHub`
2. `official Docling license MIT GitHub`
3. `official Camelot license MIT GitHub`
4. `official pdfplumber license MIT GitHub`

### Batch W13

1. `Linux open source PDF to Excel offline scanned table extraction user request GitHub issue`
2. `site:github.com PDF table extraction scanned CSV Excel offline Linux issue`
3. `bank statement PDF table extraction offline Linux open source`

### Batch W17

1. `site:docling-project.github.io/docling installation hardware requirements model download size offline`
2. `site:docling-project.github.io/docling OCR table extraction model artifacts path offline`
3. `site:github.com/docling-project/docling models download offline CPU requirements`

### Batch W18

1. `CVPR PubTables-1M table structure recognition financial tables benchmark official paper`
2. `FinTabNet financial table extraction benchmark official paper table transformer`
3. `TabSniper bank statement table detection structure recognition paper`

## Open/fetched URLs

The URL strings below are reproduced from actual native `web__run` search/open result data. Some are fetched page URLs and some are links surfaced by an opened page; the exact reference IDs and result excerpts are preserved in `session.jsonl`. Direct URL opens were then repeated for the key candidates so the candidate evidence is directly fetchable. `Internal error` means the native web tool returned that fetch status; it is preserved rather than treated as a successful read.

- https://camelot-py.readthedocs.io/en/stable/
- https://camelot-py.readthedocs.io/en/latest/user/faq.html
- https://github.com/camelot-dev/camelot
- https://github.com/camelot-dev/camelot/blob/master/docs/user/advanced.rst
- https://github.com/camelot-dev/camelot/blob/master/docs/user/how-it-works.rst
- https://github.com/camelot-dev/camelot/blob/master/camelot/core.py
- https://github.com/camelot-dev/camelot/blob/master/CHANGELOG.md
- https://tabula.technology/
- https://github.com/tabulapdf/tabula
- https://github.com/tabulapdf/tabula/releases
- https://github.com/jsvine/pdfplumber/blob/stable/README.md
- https://ocrmypdf.readthedocs.io/en/latest/cookbook.html
- https://github.com/ocrmypdf/ocrmypdf
- https://browse.dgit.debian.org/ocrmypdf.git/tree/docs/installation.md?id=ac6fc046a3ee0a1fb887a640a618cdd5a67c82af
- https://manpages.debian.org/unstable/ocrmypdf/ocrmypdf.1.en.html
- https://packages.debian.org/bookworm/ocrmypdf
- https://docling.ai/
- https://github.com/docling-project/docling/blob/main/docs/reference/cli.md
- https://docling-project.github.io/docling/_generated/examples/export_tables/
- https://docling-project.github.io/docling/reference/docling_document/
- https://docling-project.github.io/docling/reference/pipeline_options/
- https://github.com/microsoft/table-transformer/blob/main/README.md?plain=1
- https://excalibur-py.readthedocs.io/en/master/
- https://gimagereader.com/download/
- https://github.com/gImageReader-OCR
- https://github.com/pdfarranger/pdfarranger
- https://github.com/pdfarranger/pdfarranger/wiki/User-Manual
- https://pdfsam.org/pdfsam-basic/
- https://openstan.org/
- https://github.com/futuraeleven/moneylens
- https://github.com/stexz01/pdfcsv
- https://github.com/Bhanusrimattey/excelfrompdf
- https://github.com/Iamakashgaur/pdf-workbench
- https://anchor.aidenpaleczny.com/
- https://caopensource.in/pdf-to-excel/
- https://github.com/Suhani180/DocSheet-AI
- https://arxiv.org/abs/2412.12827
- https://openaccess.thecvf.com/content/CVPR2022/papers/Smock_PubTables-1M_Towards_Comprehensive_Table_Extraction_From_Unstructured_Documents_CVPR2022.pdf
- https://arxiv.org/abs/2303.00716
- https://books.libreoffice.org/en/GS75/GS7503-GettingStartedWithCalc.html
- https://help.libreoffice.org/latest/mk/text/scalc/guide/csv_files.html

## Research sequence and observations

1. W01-W03 established the baseline landscape: Tabula/Camelot/Excalibur provide local table extraction and preview for text PDFs; OCRmyPDF/Tesseract provide local OCR; no one component covered the whole request.
2. W04-W05 opened the primary project documentation and a direct implementation example. The direct implementation included native/scanned/mixed routing, Tesseract, preview, XLSX/CSV, and reconciliation, but also stated supplier-specific limitations.
3. W06-W07 checked local OCR and Debian packaging. OCRmyPDF is packaged for Debian and adds a searchable OCR layer; gImageReader is a local Tesseract GUI, but neither is a table-to-spreadsheet workflow.
4. W08-W10 checked current model/export details and possible host utilities. Docling can export detected tables through pandas to CSV/HTML; PDF Arranger and PDFsam are maintained local PDF utilities whose documented core scopes are page operations.
5. W11-W12 checked a current close competitor and licenses. Anchor has the requested source highlighting, confidence flags, and Excel/CSV export, but its published system requirements list Windows and Apple Silicon macOS only, with a beta Elastic License 2.0 release.
6. W13-W16 found several small, domain-specific implementations and verified Tabula/Camelot maintenance and integration notes.
7. W17-W20 checked offline model setup, the bank-statement research literature, and Calc's date/number import warnings.
8. W21-W22 directly fetched the candidate URLs used in `candidates.md` and `decision.md`.
