from __future__ import annotations

from .common import ROOT, read_skill, read_text


def validate() -> None:
    assess_meta, assess = read_skill("search-before-build-assess")
    compare_meta, compare = read_skill("search-before-build-compare")
    research_method = read_text("references/research-method.md")

    assert {assess_meta["name"], compare_meta["name"]} == {
        "search-before-build-assess",
        "search-before-build-compare",
    }
    assert not (ROOT / "skills" / "search-before-build-research").exists()

    assert "at most five questions" in assess.lower()
    assert "ask one question per turn" in assess.lower()
    assert "do not narrate the workflow or use headings" in assess.lower()
    assert "three essential facts" in assess.lower()
    assert "five is a ceiling, not a target" in assess.lower()
    assert "never ask the user to repeat or confirm" in assess.lower()
    assert "continue from the best current understanding" in assess.lower()
    assert "continue with explicit unknowns" in assess.lower()
    assert "Do not create files during clarification or the necessity check" in assess
    assert "Do not begin implementation" in assess
    necessity_position = assess.index("Give a short necessity check in the conversation")
    assess_research_position = assess.index(
        "Read and execute all of `references/research-method.md`"
    )
    assess_recommendation_position = assess.index(
        "Act as the sole final decision-maker for idea assessment"
    )
    assert necessity_position < assess_research_position < assess_recommendation_position

    assert "Do not modify source code, plans, or unrelated documentation" in compare
    assert "Prefer codebase knowledge-graph tools for code discovery" in compare
    assert "fall back to read-only file inspection" in compare
    baseline_position = compare.index("Establish the project baseline")
    fingerprint_position = compare.index(
        "Turn the baseline into the functional fingerprint"
    )
    compare_research_position = compare.index(
        "Read and execute all of `references/research-method.md`"
    )
    assert baseline_position < fingerprint_position < compare_research_position

    assert "normal research is read-only" in research_method.lower()
    assert "only exception" in research_method.lower()
    assert "github-retrieval.md" in research_method
    assert "search-sources.md" in research_method
    assert "select only sources relevant" in research_method.lower()
    assert "explicit user approval" in research_method.lower()
    assert "docs/search-before-build/<topic-slug>/<competitor-slug>.md" in assess
    assert "docs/search-before-build/<topic-slug>/<competitor-slug>.md" in compare
    assert "read and execute all of `references/research-method.md`" in assess.lower()
    assert "read and execute all of `references/research-method.md`" in compare.lower()
    assert "sole final decision-maker" in assess.lower()
    assert "sole final decision-maker" in compare.lower()
    assert "recommendation meanings" in assess.lower()
    assert "recommendation meanings" in compare.lower()
    assert "key comparison" in compare.lower()
    assert "do not relabel capabilities independently" in compare.lower()
    for skill in (assess, compare):
        assert "github deep-search enhancement intent" in skill.lower()
        assert "references/github-retrieval.md" in skill
        assert "report the capability or setup result and stop" in skill.lower()
    assert (
        "standalone request to enable, configure, or improve github deep search"
        in assess_meta["description"].lower()
    )
    assert (
        "github deep-search enhancement request includes"
        in compare_meta["description"].lower()
    )
    assert "Do not put a Build, Adapt, Use existing, or Stop verdict" in research_method
    verdict_contract = "`Build`, `Adapt`, `Use existing`, or `Stop`"
    assert verdict_contract in assess
    assert verdict_contract in compare
    assert verdict_contract not in research_method
    for skill in (assess, compare):
        assert "${CLAUDE_PLUGIN_ROOT}" not in skill
        assert "$ARGUMENTS" not in skill
        assert "search-before-build:research" not in skill

    for reference in (
        "conversation-and-decision.md",
        "research-method.md",
        "report-template.md",
        "report-viewer.md",
        "github-retrieval.md",
        "search-sources.md",
    ):
        assert (ROOT / "references" / reference).is_file(), f"missing reference: {reference}"

    support_enums = ("native", "partial", "extensible", "unsupported", "unverified")
    for value in support_enums:
        assert f"`{value}`" in research_method
        assert f"`{value}`" not in assess
        assert f"`{value}`" not in compare
    assert "without translating them" in research_method
    assert "Do not translate them there" in research_method

    evidence_fields = (
        "**Functional fingerprint**",
        "**Search coverage**",
        "**Candidates**",
        "**Key comparison**",
        "**Reusable parts**",
        "**Unknowns**",
    )
    evidence_positions = [research_method.index(field) for field in evidence_fields]
    assert evidence_positions == sorted(evidence_positions)
    assert (
        "Build four pools: ready-to-use products, adaptable projects, reusable components, "
        "and the current no-build workaround"
        in research_method
    )
    assert (
        "Do not infer functionality from a name, snippet, topic tag, directory name, Stars, "
        "or download count"
        in research_method
    )
    enum_definitions = (
        "**`native`**: directly supported in the normal product flow",
        "**`partial`**: covers only part of the requirement or has a material limitation",
        "**`extensible`**: a documented extension path exists; name the required work",
        "**`unsupported`**: reliable evidence shows the capability is absent or incompatible",
        "**`unverified`**: evidence is insufficient. Never silently convert this to `unsupported`",
    )
    for definition in enum_definitions:
        assert definition in research_method

    conversation_rules = read_text("references/conversation-and-decision.md")
    essential_items = (
        "Problem and need",
        "Core product or project",
        "Delivery form",
    )
    essential_positions = [conversation_rules.index(item) for item in essential_items]
    assert essential_positions == sorted(essential_positions)
    assert "A clear, unambiguous inference is sufficient" in conversation_rules
    assert "ask about it only when multiple plausible forms" in conversation_rules
    assert "If five questions have been exhausted" in conversation_rules
    assert "continue from the best current understanding" in conversation_rules
    assert "mark the unresolved item as unknown" in conversation_rules
    assert "broaden the search where needed" in conversation_rules
    assert "lower confidence in conclusions affected by the gap" in conversation_rules
    assert "use the remaining question budget sparingly" in conversation_rules
    assert "Five is not a quota" in conversation_rules
    assert "widely known, functionally similar examples" in conversation_rules
    assert "without live research" in conversation_rules
    assert "illustrative prompts, not verified competitors" in conversation_rules
    assert "never ask a secondary question merely because question budget remains" in conversation_rules
    assert "continue the assessment and research with explicit unknowns" in conversation_rules

    forbidden_jargon = ("用户画像", "核心价值主张", "市场细分信息", "商业闭环")
    for phrase in forbidden_jargon:
        assert phrase not in assess
        assert phrase not in compare
        assert phrase in conversation_rules
