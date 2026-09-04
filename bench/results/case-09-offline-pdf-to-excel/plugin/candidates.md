# Candidates

| Candidate | Layer | Verified fit | Adoption and limits |
| --- | --- | --- | --- |
| Camelot | Python parser | Text based PDF table extraction; MIT | Mature reusable seam; OCR, preview, edits, and packaging remain |
| Tabula | Desktop/Java extractor | Region based table selection for text PDFs | Closest desktop interaction; scan path and integration cost remain |
| pdfplumber | Python PDF geometry library | Detailed character/line/rectangle access | Useful fallback for custom layout logic; not a complete table UI |
| OCRmyPDF | OCR component | Adds local searchable text layer to scanned PDFs | Strong preprocessing seam; does not recover table structure alone |
| Excalibur | Local web extraction UI | Table selection and local web workflow around Camelot | Reusable UI ideas; scan and cell editing coverage incomplete |
| Intellifill OCR | Desktop OCR project | Claims offline OCR, validation, Excel and CSV exports | Potential reference; small and recent, behavior requires source validation |
| Table Transformer models | Local ML models | Detection and structure recognition paths for tables | Optional scan/layout component; CPU cost and accuracy unknown |
