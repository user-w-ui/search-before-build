from __future__ import annotations

from .common import ROOT, read_json, read_skill, read_text


def validate() -> None:
    package = read_json("package.json")
    assess = read_skill("search-before-build-assess")[1]
    compare = read_skill("search-before-build-compare")[1]
    research_method = read_text("references/research-method.md")
    github_rules = read_text("references/github-retrieval.md")
    source_catalog = read_text("references/search-sources.md")

    setup_script = ROOT / "scripts" / "setup-github-mcp.mjs"
    assert setup_script.is_file()
    setup_text = setup_script.read_text(encoding="utf-8")
    assert (
        f'clientInfo: {{ name: "search-before-build-setup", version: "{package["version"]}" }}'
        in setup_text
    )
    assert "--read-only" in setup_text
    assert '"--toolsets", "repos"' in setup_text
    assert "GITHUB_PERSONAL_ACCESS_TOKEN" not in setup_text
    assert "api.github.com/repos/github/github-mcp-server/releases" not in setup_text
    assert 'run(candidate, ["stdio", "--help"])' in setup_text

    assert "本次未使用 GitHub 专属深度检索工具" in github_rules
    assert "当前环境无法完成外部检索" in research_method
    assert "当前环境无法完成外部检索" not in github_rules
    assert "api.github.com/search/repositories" in github_rules
    assert "Personal Access Token" in github_rules
    exposed_position = github_rules.index("tools already exposed")
    gh_position = github_rules.index("gh --version")
    offer_position = github_rules.index("offer the optional official MCP setup")
    assert exposed_position < gh_position < offer_position
    assert "gh auth status" in github_rules
    assert "Do not scan plugin directories" not in github_rules
    assert "relevant read-only call succeeds" in github_rules
    assert "Try the exposed route" in github_rules
    assert "If the calls fail" in github_rules
    assert "run a relevant read-only query" in github_rules
    assert "If any required check or query fails" in github_rules
    assert "enhancement intent, not installation consent" in github_rules
    assert "wait for explicit approval" in github_rules
    for exposed_route in (
        "a GitHub plugin or app",
        "a GitHub MCP server",
        "a GitHub connector or other built-in GitHub integration",
    ):
        assert exposed_route in github_rules
    for example_operation in (
        "search_repositories",
        "search_installed_repositories",
        "fetch_file",
        "get_file_contents",
        "get_repository",
        "search_code",
        "code_search",
    ):
        assert example_operation in github_rules
    assert "examples, not an exhaustive allowlist" in github_rules
    assert "do not treat an unfamiliar tool name as absence" in github_rules
    assert "capability checks, fallback order, optional setup" in research_method
    assert "explicit user approval" in research_method
    assert "Stop only when every external route is unavailable" in research_method
    assert "Generic Web search is not a prerequisite" in research_method
    assert "If generic Web search is unavailable" in research_method
    assert "name the specialized routes used" in research_method
    assert "explain the resulting coverage limits" in research_method
    assert "Stop only when every external route is unavailable" in research_method

    for source in (
        "GitHub",
        "npm",
        "Ecosyste.ms",
        "Official MCP Registry",
        "Maven Central",
        "crates.io",
        "Hugging Face Hub",
        "arXiv",
    ):
        assert f"## {source}" in source_catalog
    assert "Do not query every source by default" in source_catalog
    assert "Adding a user-provided source" in source_catalog
    assert "Follow [github-retrieval.md]" in source_catalog
    for canonical_detail, duplicated_detail in (
        ("api.github.com/search/repositories", "api.github.com/search/repositories"),
        ("api.github.com/repos/", "api.github.com/repos/"),
        ("code-search REST endpoint requires authentication", "Anonymous GitHub code search"),
        ("On `403` caused by rate limiting", "rate-limit `403`"),
    ):
        assert canonical_detail in github_rules
        assert duplicated_detail not in source_catalog
    for detailed_github_term in (
        "search_repositories",
        "search_installed_repositories",
        "get_file_contents",
        "gh --version",
    ):
        assert detailed_github_term in github_rules
        assert detailed_github_term not in assess
        assert detailed_github_term not in compare
        assert detailed_github_term not in research_method
        assert detailed_github_term not in source_catalog
