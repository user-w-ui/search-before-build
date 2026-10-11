# Repository Guidelines

## Project Structure & Module Organization

This repository is a multi-host skill package, not a compiled application. `.claude-plugin/plugin.json` (Claude Code), `.codex-plugin/plugin.json` (Codex, installed by `bin/install.mjs`), `index.js` (OpenCode, skill ids `search-before-build-<skill>`), the `pi` key in `package.json`, and the root `plugin.json` (Agent Plugins) expose the shared workflows in `skills/`: `assess` evaluates an idea or an existing project from whatever material the user supplies, and `quick-search` gives a fast, preliminary look at what already exists. Their internal candidate-research workflow lives in `references/research-method.md`; source-specific rules live in the other files under `references/`. The one-time installer is `scripts/setup-github-mcp.mjs`; the temporary result viewer is rendered by `scripts/render-report.mjs` from `assets/report-viewer.html`. Keep shared skill instructions platform-neutral; naming host-specific tools is fine only as non-exhaustive examples of a capability. `tests/validate_plugin.py` checks structure and behavioral invariants. Persisted reports are optional and belong in `docs/search-before-build/<topic-slug>/<competitor-slug>.md` only after an explicit user request.

## Build, Test, and Development Commands

The decision kernel in `src/` builds to `dist/` with `npm run build`; commit the rebuilt `dist/` with kernel changes. Run these commands from the repository root:

```bash
claude plugin validate --strict .
python tests/validate_plugin.py
npm test
claude --plugin-dir /path/to/search-before-build
```

The first command validates the Claude manifest and skill metadata. The second checks the manifests, skill boundaries, reference files, report structure, and showcase. The third runs the kernel and host tests. The fourth loads the Claude package for an interactive smoke test. Invoke `/search-before-build:assess <idea or path>` or `/search-before-build:quick-search <idea>` after loading it. Validate the Codex manifest with Codex's plugin validator before publishing a Codex marketplace entry.

For a focused local check, pass one or more contract groups to the Python validator: `package`, `skills`, `github`, `report`, or `showcase`. Running it without arguments remains the full validation entrypoint.

## Coding Style & Naming Conventions

Use UTF-8, LF line endings, four spaces for Python, and two spaces for JSON indentation. Skill directories and names use lowercase kebab-case. Keep `SKILL.md` instructions imperative, concise, and plain-language. Write every package-resource path relative to the file that contains it: `../../references/research-method.md` from a `SKILL.md`, `../scripts/render-report.mjs` from a reference, and a bare file name between references. Name user-project paths as being in the user's current project, and keep temporary paths as `<temp>/...` or `<run-dir>/...`. Do not use a host-specific root variable. Put reusable detail one level deep in `references/`. Do not add product-management jargon or infer competitor capabilities from names, popularity, or search snippets.

## Testing Guidelines

Add assertions to `tests/validate_plugin.py` whenever behavior or report contracts change. Test filenames use `test_` or `validate_` prefixes. Before submitting, run both validation commands, `npm test`, `node --check scripts/setup-github-mcp.mjs`, `node --check scripts/render-report.mjs`, and a smoke test. Normal research is read-only; MCP download and configuration may run only after explicit user consent. Only `assess` may render the temporary viewer or write explicitly requested competitor reports.

## Commit & Pull Request Guidelines

History uses short, imperative, sentence-case subjects, for example `Refine competitor report workflow and template`. Keep each commit focused. Pull requests should explain the user-visible change, list validation performed, and include a sample prompt/output when conversation or report behavior changes. Link related issues and call out any new tools, network access, or file-writing behavior.
