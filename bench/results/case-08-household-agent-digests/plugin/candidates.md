# Candidates

## Ready-to-use products

| Candidate | Fit | Adoption, maintenance, and limit | Primary source |
| --- | --- | --- | --- |
| Fami | Shared calendar, chores, budget, Google Calendar import, AI event creation, iOS/Android/Web. | Core free; AI premium listed at $4.99/month or $44.99/year. Review gate, private-note ACLs, and model hosting unverified. | [Fami](https://fami-app.com/) |
| Nestify | Smart family copilot with synced calendars, voice input, invite-only circle, and parental controls. | App Store/Google Play plus Web. Budget, meeting-note, digest, and deployment details unverified. | [Nestify](https://www.nestifyapp.org/) |
| Plamily | Shared calendar, tasks, chores, budget, Google Calendar import, personal/family views. | Free start and cross-platform sync. No natural-language draft or scheduled report documented. | [Plamily](https://www.plamily.co/en-us/) |
| Cozi | Shared calendar, to-dos, notifications, and agenda emails. | Free hosted family organizer with low adoption cost. No AI drafts, budget, or private-note policy documented. | [Cozi](https://www.cozi.com/) |
| Yuvora | Voice/camera capture creates reviewable draft events, tasks, reminders, and spending entries. | iOS/TestFlight beta; EU hosted and encrypted. Self-hosting and full weekly report scope absent. | [Yuvora](https://yuvora.app/) |

## Adaptable projects

| Candidate | Verified fit | Adoption and maintenance | Primary source |
| --- | --- | --- | --- |
| paperr | Self-hosted household/team app with tasks, calendar, notes, local AI, private-by-default Spaces, Morning Brief, Bulletin Board digest, and approval queued agent actions. | Apache 2.0; Node.js 22.5+, optional Python/local model; solo project updated Aug 2026. Exact Google adapters and report policy require work. | [GitHub](https://github.com/biswasprateek/paperr), [project site](https://paperr.ai) |
| Family Organizer all-in-one | Self-hosted calendar, recurring/rotating chores, family/personal views, messages, and finances. | TypeScript; license metadata is Other/NOASSERTION; Apple Calendar sync, no AI assistant. Google and digest work required. | [GitHub](https://github.com/Rpeng666/family-organizer-all-in-one) |

## Reusable components and no-build route

| Component | Verified use | Limit |
| --- | --- | --- |
| Google Calendar API | REST events, recurring events, calendar ACLs, and explicit events.insert writes. | OAuth and write access need careful gating. |
| Gmail API | Direct or draft email sending. | Hosted Google account and OAuth permissions. |
| Apps Script triggers | Time-driven recurring functions for weekday/Sunday jobs. | Firing time may be randomized; creator authorization and quotas apply. |
| Official MCP Registry Google Tasks server | mcp-google-tasks advertises task lists, subtasks, due dates, completion, and moves. | OAuth setup and repository quality need verification. |
| Phi-3 mini instruct on Hugging Face | MIT local model options for self-hosted parsing/summarization experiments. | Model quality, hardware fit, and tool-call reliability are unknown. |
