# Repository Guidelines

## Project Structure & Module Organization

This repository is a Claude Code plugin, not a compiled application. `.claude-plugin/plugin.json` is the plugin manifest. Each user workflow lives in `skills/<name>/SKILL.md`: `assess` evaluates new ideas, `compare` examines an existing plan or prototype, and the hidden `research` skill performs read-only candidate research. Shared rules belong in `references/`; keep detailed procedures there instead of duplicating them across skills. `tests/validate_plugin.py` checks structure and behavioral invariants. Generated competitor reports belong in `docs/should-i-build/<topic>/<competitor>.md`, not in the plugin source folders.

## Build, Test, and Development Commands

There is no build step. Run these commands from the repository root:

```bash
claude plugin validate --strict .
python tests/validate_plugin.py
claude --plugin-dir /path/to/should-i-build
```

The first command validates the Claude manifest and skill metadata. The second checks visibility, read-only boundaries, reference files, and report structure. The third loads the plugin for an interactive smoke test. Invoke `/should-i-build:assess <idea>` or `/should-i-build:compare <path>` after loading it.

## Coding Style & Naming Conventions

Use UTF-8, LF line endings, four spaces for Python, and two spaces for JSON indentation. Skill directories and names use lowercase kebab-case. Keep `SKILL.md` instructions imperative, concise, and plain-language. Use `${CLAUDE_PLUGIN_ROOT}` for paths inside the plugin. Put reusable detail one level deep in `references/`. Do not add product-management jargon or infer competitor capabilities from names, popularity, or search snippets.

## Testing Guidelines

Add assertions to `tests/validate_plugin.py` whenever behavior or report contracts change. Test filenames use `test_` or `validate_` prefixes. Before submitting, run both validation commands and manually smoke-test the affected slash command. Research must remain file-system read-only; only `assess` and `compare` may write competitor reports.

## Commit & Pull Request Guidelines

History uses short, imperative, sentence-case subjects, for example `Refine competitor report workflow and template`. Keep each commit focused. Pull requests should explain the user-visible change, list validation performed, and include a sample prompt/output when conversation or report behavior changes. Link related issues and call out any new tools, network access, or file-writing behavior.
