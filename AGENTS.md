# Repository Guidelines

## Project Structure & Module Organization

This repository is a dual-agent skill package, not a compiled application. `.claude-plugin/plugin.json` and `.codex-plugin/plugin.json` expose the shared workflows in `skills/`. `search-before-build-assess` evaluates ideas, `search-before-build-compare` examines existing work, and `search-before-build-research` performs candidate research and optional GitHub enhancement. Shared rules belong in `references/`; the one-time installer is `scripts/setup-github-mcp.mjs`. Keep shared skill instructions platform-neutral. `tests/validate_plugin.py` checks structure and behavioral invariants. Generated reports belong in `docs/search-before-build/<topic>/<competitor>.md`.

## Build, Test, and Development Commands

There is no build step. Run these commands from the repository root:

```bash
claude plugin validate --strict .
python tests/validate_plugin.py
claude --plugin-dir /path/to/search-before-build
```

The first command validates the Claude manifest and skill metadata. The second checks both manifests, skill boundaries, reference files, and report structure. The third loads the Claude package for an interactive smoke test. Invoke `/search-before-build:search-before-build-assess <idea>` or `/search-before-build:search-before-build-compare <path>` after loading it. Validate the Codex manifest with Codex's plugin validator before publishing a Codex marketplace entry.

## Coding Style & Naming Conventions

Use UTF-8, LF line endings, four spaces for Python, and two spaces for JSON indentation. Skill directories and names use lowercase kebab-case. Keep `SKILL.md` instructions imperative, concise, and plain-language. Refer to package resources by their package-relative path, such as `references/research-method.md`; do not use a host-specific root variable. Put reusable detail one level deep in `references/`. Do not add product-management jargon or infer competitor capabilities from names, popularity, or search snippets.

## Testing Guidelines

Add assertions to `tests/validate_plugin.py` whenever behavior or report contracts change. Test filenames use `test_` or `validate_` prefixes. Before submitting, run both validation commands, `node --check scripts/setup-github-mcp.mjs`, and a smoke test. Normal research is read-only; MCP download and configuration may run only after explicit user consent. Only `assess` and `compare` may write competitor reports.

## Commit & Pull Request Guidelines

History uses short, imperative, sentence-case subjects, for example `Refine competitor report workflow and template`. Keep each commit focused. Pull requests should explain the user-visible change, list validation performed, and include a sample prompt/output when conversation or report behavior changes. Link related issues and call out any new tools, network access, or file-writing behavior.
