# Decision — Case 04 baseline arm

## Final recommendation (verbatim)

Turn 1, opening paragraph:

> "Short answer: the *organizing* part is worth solving, but it's mostly
> already solved by existing tools — and the *reading* part, which is the
> thing you actually care about, is a habit problem that a new app probably
> won't fix. So before you build anything, let me split your idea in two."

Recommendation verbatim:

> "**My recommendation: a 2-week test before any building.** Pick one existing
> tool (Readwise Reader if you want AI auto-tagging + cross-device; Raindrop.io
> if you want more of a bookmark-organizer feel) and actually use it for two
> weeks. Set one daily reminder."

Decision rule offered (turn 1):

> "If you start reading — the habit was the issue, the tool was fine, and you
> just saved yourself a big build. Done. / If auto-categorization genuinely
> turns out to be the missing piece ... *then* it's worth building"

## Strongest existing solution identified

**Readwise Reader** (no URL given). Reason chain:

1. Auto-categorization is "the part a tool genuinely solves" — Reader does
   "AI-assisted tagging into categories as you save" and syncs phone/laptop.
2. The reminder job is better handled by the phone's built-in reminders app
   than by any read-later app: "you don't need an app for this *at all*."
3. The single most effective feature is a prune rule, not categories: "archive
   or delete if it's been sitting >2 weeks" / "ruthless 'archive or delete if
   it's been sitting >2 weeks' rule, not fancier categories."

## Biggest remaining unknown (as the agent framed it)

The user's real bottleneck: whether the failure is the habit or the tooling.

> "The danger of building your own app here is that you'll spend weeks
> perfecting categories and reminders, then discover you still don't read —
> because the bottleneck was never organization."

The 2-week test is explicitly designed to resolve this unknown before any build.

## If built (contingency, turn 2)

> "For a non-programmer I'd use a no-code stack (Softr or Glide + an AI tagging
> step wired through Make/n8n)"

## Notable absences

- No demand/market evidence was gathered or cited (no search performed).
- Pocket and Omnivore never appeared; no timeliness reasoning exists in the
  decision.
- No URL or first-party source backs any claim about Reader/Raindrop/Instapaper.