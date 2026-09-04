# Environment

- Date: 2026-09-04 (Asia/Shanghai; research timestamps are UTC).
- Arm: B / plugin.
- Workflow: `search-before-build:search-before-build-assess`.
- Language: English product input and output.
- Working scope: only the Case 07 plugin result directory.
- Web route: `web__run` search/open, successful for product pages, Immich documentation, GitHub-indexed pages, npm/PyPI pages, and arXiv discovery.
- GitHub route: exposed authenticated read-only GitHub app; repository search, metadata, file/README, and issue reads succeeded. No GitHub setup or mutation was performed.
- Registry routes: npm metadata via `npm view`; PyPI metadata via the public PyPI JSON endpoint; no packages installed.
- Kernel: packaged `dist/cli.js` ran successfully with a fresh OS temp run directory.
- Viewer: packaged `render-report.mjs` rendered `brief.html` in the same fresh OS temp run directory.
- Claude CLI was not used.
