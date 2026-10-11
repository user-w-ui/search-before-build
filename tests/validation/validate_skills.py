from __future__ import annotations

from .common import ROOT, assert_package_paths_resolve, read_skill, read_text


def validate() -> None:
    assess_meta, assess = read_skill("assess")
    research_method = read_text("references/research-method.md")
    decision_kernel = read_text("references/decision-kernel.md")
    search_sources = read_text("references/search-sources.md")

    assert_package_paths_resolve()
    assert assess_meta["name"] == "assess"
    for retired in (
        "search-before-build-assess",
        "search-before-build-compare",
        "search-before-build-research",
    ):
        assert not (ROOT / "skills" / retired).exists(), retired
    quick_meta, quick = read_skill("quick-search")
    assert quick_meta["name"] == "quick-search"
    for meta in (assess_meta, quick_meta):
        description = meta["description"]
        assert "\n" not in description and ": " not in description, meta["name"]

    assert "at most five information-seeking questions" in assess.lower()
    assert "ask one question per turn" in assess.lower()
    assert "do not narrate the workflow or use headings" in assess.lower()
    assert "intent model" in assess.lower()
    assert "five is a ceiling, not a target" in assess.lower()
    assert "never ask the user to repeat information" in assess.lower()
    assert "never ask about what the supplied material already answers" in assess.lower()
    assert "surface function and delivery form" in assess.lower()
    assert "material, user-answerable unknown" in assess.lower()
    assert "match the user's language and demonstrated level of expertise" in assess.lower()
    assert "continue from the best current understanding" in assess.lower()
    assert "confirmation does not count toward the five-question limit" in assess.lower()
    assert "stop the turn and wait" in assess.lower()
    assert "do not research until the user confirms" in assess.lower()
    assert "Do not create files during clarification or the necessity check" in assess
    assert "Do not begin implementation" in assess
    assert "Do not modify source code, plans, or unrelated documentation" in assess
    assert "prefer codebase knowledge-graph tools for code discovery" in assess.lower()
    assert "fall back to read-only file inspection" in assess
    assert "promotional images, Stars, or popularity as proof of functional similarity" in assess
    assert "implemented, planned, or unknown" in assess
    assert "research-readiness conditions" in assess
    # The merged skill no longer offers an opt-in alignment step.
    assert "align first" not in assess.lower()
    assert "compare directly" not in assess.lower()
    ordered_steps = (
        "Read the supplied material and build the prioritized intent brief",
        "Ask only about the gaps the material leaves",
        "present the concise pre-research understanding summary",
        "Give a short necessity check in the conversation",
        "Convert the confirmed understanding into a functional fingerprint",
        "Read and execute all of `../../references/research-method.md`",
        "key comparison at the same product or technical layer",
        "Act as the sole final decision-maker for the assessment",
        "Render the result to the shared temporary HTML viewer",
    )
    step_positions = [assess.index(step) for step in ordered_steps]
    assert step_positions == sorted(step_positions)
    assert "including the project's current state when material was supplied" in assess
    assert "whether continuing on the current path is still worth the investment" in assess

    assert "normal research is read-only" in research_method.lower()
    assert "references/decision-kernel.md" in assess
    assert "decision-kernel.md" in research_method
    assert "candidate_mention" in decision_kernel
    assert "cannot prove that a capability is supported" in decision_kernel
    assert "at most one targeted follow-up round" in decision_kernel
    assert "operating-system temporary directory" in decision_kernel
    assert "do not install dependencies during a research request" in decision_kernel.lower()
    assert "only exception" in research_method.lower()
    assert "github-retrieval.md" in research_method
    assert "search-sources.md" in research_method
    assert "select only sources relevant" in research_method.lower()
    assert "explicit user approval" in research_method.lower()
    assert "docs/search-before-build/<topic-slug>/<competitor-slug>.md" in assess
    assert "read and execute all of `../../references/research-method.md`" in assess.lower()
    assert "sole final decision-maker" in assess.lower()
    assert "recommendation meanings" in assess.lower()
    assert "key comparison" in assess.lower()
    assert "do not relabel capabilities independently" in assess.lower()
    assert "github deep-search enhancement intent" in assess.lower()
    assert "references/github-retrieval.md" in assess
    assert "report the capability or setup result and stop" in assess.lower()
    assert (
        "standalone request to enable, configure, or improve github deep search"
        in assess_meta["description"].lower()
    )
    assert "Do not put a Build, Adapt, Use existing, or Stop verdict" in research_method
    verdict_contract = "`Build`, `Adapt`, `Use existing`, or `Stop`"
    assert verdict_contract in assess
    assert verdict_contract not in research_method
    assert "${CLAUDE_PLUGIN_ROOT}" not in assess
    assert "$ARGUMENTS" not in assess
    assert "search-before-build:research" not in assess

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
        assert f"`{value}`" not in quick
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
    assert "## Source coverage ledger" in research_method
    assert "Before the first external call" in research_method
    assert "ready-to-use, adaptable, reusable, and no-build paths" in research_method
    assert "A bare `not necessary` or `irrelevant` is not a sufficient reason" in research_method
    source_triggers = (
        "JavaScript, Node.js, npm package, CLI, or plugin",
        "Python library, script, notebook, or data pipeline",
        "JVM, Java, Kotlin, or Android",
        "Rust implementation or dependency",
        "Agent tool, connector, or MCP server",
        "ML model, OCR, embeddings, training data, or local inference",
        "algorithm, academic evidence, benchmark, or literature workflow",
    )
    for trigger in source_triggers:
        assert trigger in research_method
    assert "ordinary Web search is required unless unavailable" in research_method
    assert "at least two differently worded discovery queries" in research_method
    assert "every candidate in the key comparison has at least one primary page read" in research_method
    assert "dated maintenance signal" in research_method
    assert "record maintenance as unknown instead of guessing" in research_method
    assert "route-and-language audit" in research_method
    assert "anonymous web fallback" in research_method.lower()
    assert "html.duckduckgo.com" in search_sources
    assert "https://huggingface.co/api/models?search=" in search_sources
    assert "## Hacker News Algolia" in search_sources
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
    intent_dimensions = (
        "Trigger and situation",
        "Current approach and pain",
        "Desired outcome",
        "Core capability and boundaries",
        "Difference from alternatives",
        "Proposed approach and delivery form",
        "Hard constraints",
    )
    intent_positions = [conversation_rules.index(item) for item in intent_dimensions]
    assert intent_positions == sorted(intent_positions)
    assert "A clear, unambiguous inference is sufficient" in conversation_rules
    assert "solution hypothesis" in conversation_rules
    assert "Do not start research merely because the surface function" in conversation_rules
    assert "foreseeable, answerable by the user" in conversation_rules
    assert "change the candidate set, capability comparison, or recommendation" in conversation_rules
    assert "If five information-seeking questions have been exhausted" in conversation_rules
    assert "continue from the best current understanding" in conversation_rules
    assert "mark unresolved items as unknown" in conversation_rules
    assert "broaden the search where needed" in conversation_rules
    assert "lower confidence in affected conclusions" in conversation_rules
    assert "Five is not a quota" in conversation_rules
    assert "highest expected information gain" in conversation_rules
    assert "Match the user's wording and demonstrated level of expertise" in conversation_rules
    assert "widely known, functionally similar examples" in conversation_rules
    assert "without live research" in conversation_rules
    assert "contrast prompts" in conversation_rules
    assert "Do not present them as verified competitors" in conversation_rules
    assert "conserving questions is not more important than grounding an expensive search" in conversation_rules
    assert "does not count toward the five information-seeking questions" in conversation_rules
    assert "Stop the turn and wait for the user's response" in conversation_rules
    assert "must not introduce as its biggest unknown" in conversation_rules
    channel = conversation_rules[conversation_rules.index("### Question channel"):conversation_rules.index("## Pre-research confirmation")]
    for host_tool in ("AskUserQuestion", "request_user_input", "`question` in OpenCode"):
        assert host_tool in channel
    assert "examples, not an exhaustive list" in channel
    assert "tool-discovery mechanism" in channel
    assert "Put one decision topic in each call" in channel
    assert "Each call counts as one information-seeking question" in channel
    assert "do not invent an answer" in channel
    assert "it is not a confirmation" in channel
    assert "Fall back to plain text" in channel
    assert "ask exactly one question per turn" in channel
    assert "through the question channel above" in conversation_rules
    assert "question channel" in assess.lower()
    assert "material, foreseeable, user-answerable question" in conversation_rules

    # quick-search is a light, chat-only first look; it never reaches a verdict.
    assert "初步" in quick
    assert "Ask at most one question" in quick
    assert "question channel" in quick.lower()
    assert "reduced-depth mode" in quick
    assert "references/research-method.md" in quick
    assert "references/search-sources.md" in quick
    assert "references/github-retrieval.md" in quick
    for heavy_reference in ("report-viewer.md", "report-template.md", "decision-kernel.md"):
        assert heavy_reference not in quick, heavy_reference
    for verdict in ("`Build`", "`Adapt`", "`Use existing`", "`Stop`", "Use existing"):
        assert verdict not in quick, verdict
    assert "Do not create files, render a viewer, save reports" in quick
    assert "suggest running the `assess` skill" in quick
    assert "${CLAUDE_PLUGIN_ROOT}" not in quick
    assert "$ARGUMENTS" not in quick
    reduced = research_method[research_method.index("## Reduced-depth mode"):]
    assert "`quick-search` runs the reduced-depth mode" in research_method
    for rule in (
        "Skip the decision kernel, the four pools",
        "at most three routes, counting Web search as one",
        "Search in Chinese and English",
        "at most five candidates",
        "dated maintenance signal",
        "never that nothing similar exists",
        "Do not offer the MCP setup in this mode",
    ):
        assert rule in reduced, rule

    forbidden_jargon = ("用户画像", "核心价值主张", "市场细分信息", "商业闭环")
    for phrase in forbidden_jargon:
        assert phrase not in assess
        assert phrase not in quick
        assert phrase in conversation_rules
