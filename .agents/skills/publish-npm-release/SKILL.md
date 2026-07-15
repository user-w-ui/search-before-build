---
name: publish-npm-release
description: "Publish a completed npm package from the current repository. Use when code changes are finished and npm authentication is ready, and Codex should inspect the registry, synchronize release versions, validate, commit, tag, push, and publish a new stable npm version."
---

# Publish an npm release

Treat invocation as authority to perform the complete stable release workflow, including a Git commit, annotated tag, remote push, and `npm publish`. The caller has already completed product changes and updated npm authentication.

## Version policy

1. Read `package.json` to obtain the package name and local version. Read `AGENTS.md`, package scripts, and existing release scripts before changing anything.
2. Run `npm whoami`, then query the registry for the package's `latest` version and complete published-version list. Handle a 404 as a first release.
3. Select the target version from registry evidence, never by incrementing an arbitrary local value:
   - Keep the local version when it is valid SemVer, unpublished, and greater than npm `latest`.
   - Otherwise use the next patch version after npm `latest`.
   - If the caller explicitly requests `minor` or `major`, increment that component from npm `latest` instead.
   - Stop for prereleases unless the caller explicitly supplies the intended npm dist-tag. Do not publish a prerelease as `latest` by default.
4. Update `package.json` and every current release-metadata surface that repository validation requires to equal the target version. Prefer a repository-provided version-sync command. Otherwise inspect exact-version references and update only manifests or runtime client metadata, never historical documentation, fixtures, or changelogs.

## Validate and commit

1. Run all release-relevant checks documented by `AGENTS.md`, package scripts, and existing release scripts. Include repository tests, syntax checks, plugin validation when present, `npm pack --dry-run`, and `git diff --check`.
2. Stop before committing if any validation fails. Diagnose and fix only release/version issues; do not alter completed product behavior without asking.
3. Review `git status --short`. Stage only the caller's completed changes plus the release-version updates. Stop if unrelated or ambiguous changes cannot be separated safely.
4. Commit with `Release v<target-version>` if the target-version changes are not already committed. Push the current branch and require its push to succeed before tagging.

## Tag and publish

1. Require a clean working tree and confirm the current branch is not detached.
2. Refuse to reuse, move, delete, or force-push an existing `v<target-version>` tag.
3. Create `git tag -a v<target-version> -m "Release v<target-version>"` at current `HEAD`.
4. Run any repository release verifier after tagging. It must confirm that version metadata matches and that the tag resolves to `HEAD`.
5. Push the tag, then use `git ls-remote --tags origin` to confirm the remote contains it before publishing.
6. Run `npm publish` without an npm dist-tag for a stable release. Never confuse npm dist-tags with Git tags.
7. Verify `npm view <package>@<target-version> version` and inspect npm dist-tags. Report the package name, published version, commit, Git tag, validations, and npm verification result.

## Stop conditions

Stop without publishing if npm authentication fails, the target npm version already exists, version metadata cannot be synchronized, validation fails, branch/tag push fails, or remote tag verification fails. Do not use `npm version`, `git tag -f`, `git push --force`, or npm unpublish as a fallback.
