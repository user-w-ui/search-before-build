# Conversation and decision rules

## Essential understanding before research

Establish these three items in priority order:

1. **Problem and need**: why the user wants to do this, what need exists, and which real problem it should solve.
2. **Core product or project**: what the main thing is, its primary function, and where its core value comes from.
3. **Delivery form**: whether the result is, for example, an open-source repository, plugin, Skill, MCP server, software product, or paper.

Use the user's request, conversation, and supplied material first. Mark each item internally as fact, inference, or unknown. A clear, unambiguous inference is sufficient; do not ask the user to repeat or confirm it. The delivery form is often obvious from phrases such as “我要做一个插件” or “我想写一篇论文”; ask about it only when multiple plausible forms would materially change the assessment or search.

Try to establish all three essentials before research. If five questions have been exhausted while an essential remains unclear, stop asking and continue from the best current understanding. Build the functional fingerprint from established facts and reasonable inferences, mark the unresolved item as unknown, broaden the search where needed, and lower confidence in conclusions affected by the gap. Do not invent the missing information.

## Secondary questions

Once all three essentials are clear, stop asking if the decision and search can already be grounded. Otherwise, use the remaining question budget sparingly for secondary information that could change the recommendation or search, such as:

- who will use it and in what situation;
- how the problem is handled today and what trouble remains;
- how it differs from familiar alternatives;
- why an existing product or approach is unacceptable;
- hard constraints on deployment, data, cost, or maintenance.

For questions about alternatives, you may name a few widely known, functionally similar examples from general model knowledge without live research. Present them only as illustrative prompts, not verified competitors, and avoid precise or time-sensitive feature claims. Research and verification happen later.

## How to ask

Ask one short, concrete question per turn. Prefer wording such as:

- “你为什么想做这件事，现实里最想解决的是什么问题？”
- “这个项目最核心要提供什么能力？”
- “你认为它真正有价值的部分是什么？”
- “你最终想把它做成什么形式？”（仅在无法推断时询问）
- “你现在是怎么解决这个问题的？”
- “为什么不直接使用 <熟悉的相似方案>？”

Keep clarification turns brief: one sentence confirming the current understanding, optionally one sentence naming the decisive unknown, then the question. Do not announce the workflow, add headings, or explain every missing field.

Do not ask the user to provide “用户画像”, “核心价值主张”, “市场细分信息”, “商业闭环”, or another product-management abstraction. Use the user's language. Explain unfamiliar terms briefly.

Ask no more than five questions. Five is not a quota. Stop early once the essentials, decision, and search can be grounded; never ask a secondary question merely because question budget remains. After the fifth question, continue the assessment and research with explicit unknowns instead of asking more or stopping.

## Necessity gates

Judge these gates without a numeric score:

1. A concrete problem or need exists.
2. The core product, function, and value address that problem.
3. The intended delivery form fits the need.
4. The current workaround or familiar alternatives leave meaningful trouble.
5. Building something new is plausibly better than adopting or adapting existing work.

For each gate, label the basis as:

- **事实**: directly provided or verified.
- **推断**: reasonably derived; state why.
- **未知**: not established.

## Recommendation meanings

- **Build**: verified need plus a meaningful gap that existing options do not cover.
- **Adapt**: a close solution exists and modifying it is cheaper or safer than starting over.
- **Use existing**: an existing product already covers the important need with acceptable cost and limits.
- **Stop**: no demonstrated need, no meaningful gain over the current workaround, or costs clearly exceed the benefit.

Choose exactly one. Do not hide behind “it depends”; put dependencies under unknowns. The recommendation is advice, not a gate.
