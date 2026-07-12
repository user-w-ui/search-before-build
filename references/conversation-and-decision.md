# Conversation and decision rules

## What must be understood

Use information the user already supplied. Ask only when a missing answer could change the recommendation:

- Who will use this?
- What specific problem has actually occurred?
- When and where does it occur?
- How is it handled today?
- What real trouble remains if nothing is built?
- Is this a personal tool or a public product?
- Which single capability matters most?

## How to ask

Ask one short, concrete question per turn. Prefer wording such as:

- “这是谁会用的？”
- “你现在是怎么解决这个问题的？”
- “这个问题你遇到过几次？”
- “不做这个工具，会带来什么实际麻烦？”
- “你最想解决的是哪一步？”
- “这是你自己使用，还是准备给别人使用？”

Keep clarification turns brief: one sentence confirming the current understanding, optionally one sentence naming the decisive unknown, then the question. Do not announce the workflow, add headings, or explain every missing field.

Do not ask the user to provide “用户画像”, “核心价值主张”, “市场细分信息”, “商业闭环”, or another product-management abstraction. Use the user's language. Explain unfamiliar terms briefly.

Ask no more than five questions. Stop early once the decision and search can be grounded. If important details remain after five questions, continue with explicit unknowns and lower confidence.

## Necessity gates

Judge these gates without a numeric score:

1. A concrete user exists.
2. The problem has occurred or has credible direct evidence.
3. The current workaround causes meaningful trouble.
4. The most important capability is clear.
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
