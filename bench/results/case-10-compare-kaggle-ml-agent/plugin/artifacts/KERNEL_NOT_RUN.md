# Case 10 · Kernel Execution Note

The decision kernel (`dist/cli.js`) was not invoked during this benchmark run.

## Reason Observed

The agent directly constructed the structured `report-input.json` containing the synthesized comparison dimensions, capability matrix, competitor details, notable designs, reusable lessons, and final recommendation (`Build`), and directly invoked `scripts/render-report.mjs` to render the interactive `brief.html`.
