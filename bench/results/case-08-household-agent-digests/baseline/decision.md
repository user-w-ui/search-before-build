# Decision

## Recommendation: Adapt

This is worth building as a small household-specific orchestration layer on top of the family’s existing calendar and task tools. It is not worth starting by building another general-purpose family organizer: Cozi already offers shared calendars, chores, reminders, and daily/weekly agenda email; FamilyWall covers calendars, to-dos, and a budget tracker; and Fami markets an all-in-one calendar/chores/budget model. Those products leave the requested private per-person digest and meeting-note synthesis either unsupported or unverified.

The strongest path is to choose one ecosystem first. A Microsoft household has the cleanest documented shared-task and event-write primitives: To Do supports shared lists and recurrence, and Microsoft Graph can create both tasks and events. A Google household has strong calendar permissions, private events, event list/insert/quick-add methods, and Apps Script time-driven triggers, but Google’s Tasks API is user-list oriented and Google’s documented shared tasks cannot repeat. An all-Apple household can cover native reminders, shared lists, Siri date/time commands, and scheduled Shortcuts, but a central digest needs a host device because personal automations are device-specific. Todoist can supply shared chores and natural-language task dates, though shared projects expose all their information and calendar integration does not make a task from a newly-added event.

The MVP should be deliberately narrow:

1. Connect one provider and one household-only delivery channel. Start with a shared calendar plus a shared chores list; do not ingest every personal calendar by default.
2. Add a daily digest and weekly digest scheduler. The weekly job reads only explicitly authorized budget, maintenance, and meeting-note sources, then extracts overdue items and action points.
3. Give every source and field a scope such as `household`, `adult-only`, or a named person. Filter the digest separately for each recipient and redact private events/notes before composition.
4. Parse a command such as “remind me to book the dentist next Thursday” into a normalized title, exact date in the household timezone, owner, and target type. Show that preview and require confirmation before creating the task/event.
5. Treat every recipient outside the four verified household members as blocked. Ask for explicit confirmation immediately before any external message, attendee invite, or shared-link action, then record the decision.

Run the first version in shadow mode for two weeks. Measure omitted or incorrect items, private-data leakage, duplicate writes, date interpretation, and whether the family actually reads the digests. Continue if the digest reliably reduces coordination work and the privacy gate passes every test. If the family is happy with a fully shared model, use Cozi or FamilyWall and avoid custom software; if they require broad multi-provider support before proving one-provider value, stop and reassess because OAuth, token revocation, provider-specific ACLs, scheduler retries, notes/budget adapters, and consent auditing become the product.

## Evidence links

- [Google Calendar sharing and permissions](https://support.google.com/calendar/answer/37082?hl=en) and [event/task visibility](https://support.google.com/calendar/answer/34580?hl=en-za).
- [Google Calendar `quickAdd`](https://developers.google.com/workspace/calendar/api/v3/reference/events/quickAdd), [Calendar event insert](https://developers.google.com/workspace/calendar/api/v3/reference/events/insert), [Google Tasks API](https://developers.google.com/workspace/tasks/reference/rest), and [Google shared-task limits](https://support.google.com/tasks/answer/11549608?hl=en).
- [Microsoft To Do due dates/reminders/recurrence](https://support.microsoft.com/en-us/todo/add-due-dates-and-reminders-in-microsoft-to-do), [shared lists](https://support.microsoft.com/en-US/ToDo/create-and-share-lists), [Graph event creation](https://learn.microsoft.com/en-us/graph/api/user-post-events?view=graph-rest-1.0), and [Graph To Do task creation](https://learn.microsoft.com/en-us/graph/api/todotasklist-post-tasks?view=graph-rest-1.0).
- [Apple private calendar sharing](https://support.apple.com/en-ie/guide/icloud/mm6b1a9479/icloud), [Siri Reminders](https://support.apple.com/en-ie/102484), and [Shortcuts automation](https://support.apple.com/en-euro/guide/shortcuts/apd690170742/ios).
- [Cozi FAQ](https://www.cozi.com/faq/), [FamilyWall features](https://support.familywall.com/en/support/solutions/articles/47001239196-what-is-included-in-familywall-premium-), and [Todoist natural-language dates](https://www.todoist.com/help/todoist/features/schedule-a-date-and-time-for-your-todoist-tasks-q7VobO).

## Complete final answer

This is worth building as a small household-specific orchestration layer on top of the family’s existing calendar and task tools. It is not worth starting by building another general-purpose family organizer: Cozi already offers shared calendars, chores, reminders, and daily/weekly agenda email; FamilyWall covers calendars, to-dos, and a budget tracker; and Fami markets an all-in-one calendar/chores/budget model. Those products leave the requested private per-person digest and meeting-note synthesis either unsupported or unverified.

Pick one ecosystem for the first version. Microsoft has the most complete documented shared-task and event-write primitives. Google has strong calendar permissions and scheduling, but Google Tasks is user-list oriented and its documented shared tasks cannot repeat. Apple covers native reminders, shared lists, Siri, and scheduled Shortcuts, but a central digest needs a host device. Todoist is useful for shared chores and natural-language task dates, but shared projects expose all project information.

The MVP should read only explicitly shared household sources, classify each source as household, adult-only, or person-specific, generate daily and weekly digests, and show a confirmation preview before writing a task or event. “Next Thursday” should be resolved to an exact date and timezone. Any recipient outside the four verified household members should be blocked until the user explicitly confirms the external send, with the decision recorded.

Run it in shadow mode for two weeks and measure omissions, wrong dates, duplicate writes, and private-data leakage. If the household accepts a fully shared model, use Cozi or FamilyWall instead; if privacy-aware cross-source summaries are the reason to build, this thin layer is the part worth building.
