---
name: quick-search
description: Quickly check whether something like a described tool, product, library, or coding idea already exists, and list the closest existing options with a clearly marked preliminary view. Use when the user asks whether something like X exists, wants existing alternatives or prior work fast, or wants a light look before deciding anything. For a full decision on whether to build or keep building, use assess instead.
---

# Quick Search for Existing Solutions

Find out quickly what already exists. Be candid, brief, and easy to understand. This is a first look, not a decision.

Paths to package files in this skill are relative to the directory containing this `SKILL.md`; resolve them to absolute paths before reading or running them.

## Rules

- Do not run a clarification round, a pre-research confirmation, or a necessity check. Infer what to search for from the request, the conversation, and any supplied material, and state that understanding at the top of the answer.
- Ask at most one question, and only when the core task cannot be inferred at all. Ask it through the question channel in `../../references/conversation-and-decision.md`, then stop the turn and wait.
- Read `../../references/research-method.md` and follow its reduced-depth mode. Read `../../references/search-sources.md`, and for any GitHub search read `../../references/github-retrieval.md`.
- Normal research is read-only. Do not create files, render a viewer, save reports, or offer to install or configure anything.
- Do not judge what a candidate does from its name, a search snippet, Stars, or download counts.
- Match the user's language and demonstrated level of expertise. Use accurate everyday language.

## Answer

1. **Understanding**: one or two sentences on what was searched for and any assumption made.
2. **Candidates**: at most five, closest first. For each, say what it is, how well it fits the need, a dated maintenance signal (or that maintenance is unknown), and a link to its primary page.
3. **Coverage**: the routes checked, plus any limitation statement the references require.
4. **Preliminary view**: label it as preliminary and pick exactly one, in the user's language:
   - **Ready to use**: an existing option already covers the need;
   - **Adaptable**: an existing project could be modified to fit;
   - **Reusable parts**: a component removes much of the work, but nothing covers the whole need;
   - **Nothing close in N routes**: nothing close turned up in the N routes checked, which does not prove that nothing exists.

   In Chinese, use 初步 and these labels: 已有现成可用的, 有可改造的项目, 有可复用的组件, 在检查过的 N 个来源里没找到接近的. Add one sentence of reason. Do not phrase the view as a decision to build, adapt, use, or stop.
5. When the view depends on an important unknown, or the decision would cost real time or money, suggest running the `assess` skill for a full assessment.
