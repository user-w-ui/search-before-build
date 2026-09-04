# Candidates and characterizations

The request does not name a provider, so the candidates cover the main existing ecosystem choices plus family-organizer substitutes. The descriptions below are limited to the linked official pages.

## Cozi Family Organizer

Links: [Cozi home](https://www.cozi.com/) and [Cozi FAQ](https://www.cozi.com/faq/).

Cozi already has the closest ready-made morning experience: a shared family calendar, reminders, daily and weekly agenda emails, shared to-do lists, and a Chores area with daily and weekly recurrence. It can consume or publish read-only calendar feeds for Google, Outlook, and Apple Calendar. The privacy fit is poor for this request: Cozi says all included family members can view, add, edit, and delete all account data, and it has no restricted-access option. It is a strong `Use existing` choice only when the household accepts a fully shared data model.

## FamilyWall

Links: [FamilyWall overview](https://support.familywall.com/en/support/solutions/articles/47001013681-about-familywall), [Premium features](https://support.familywall.com/en/support/solutions/articles/47001239196-what-is-included-in-familywall-premium-), [data visibility](https://support.familywall.com/en/support/solutions/articles/47001013685-who-can-see-the-information-i-publish-), and [selected calendar sharing](https://support.familywall.com/en/support/solutions/articles/47001239525-share-your-additional-calendars-with-other-members).

FamilyWall combines a shared calendar, lists/to-dos, and a finance tracker; Premium includes Google and Outlook calendar sync. Its data model is private to a family circle, and imported additional calendars are not shared by default and can be shared with selected members. The checked sources do not establish weekly meeting-note summaries, natural-language task/event creation, or a configurable “ask before external send” policy. It is a credible `Use existing`/`Adapt` candidate if the household wants a single family app and can live without those custom behaviors.

## Fami

Link: [Fami family organizer](https://fami-app.com/).

Fami’s current site claims one app for shared calendar, chores, budget, allowance/rewards, shopping, and meal planning, with a Kid Mode that hides the household budget and family calendar from a child’s view. This is a promising adjacent product for the budget/visibility part of the request, but the checked page did not document source integrations, API access, meeting-note digests, or external-send consent. Treat it as a product to trial, not as validated infrastructure.

## Google Calendar + Google Tasks + Apps Script

Links: [calendar sharing](https://support.google.com/calendar/answer/37082?hl=en), [event/task visibility](https://support.google.com/calendar/answer/34580?hl=en-za), [Calendar events insert](https://developers.google.com/workspace/calendar/api/v3/reference/events/insert), [Calendar quickAdd](https://developers.google.com/workspace/calendar/api/v3/reference/events/quickAdd), [Google Tasks API](https://developers.google.com/workspace/tasks/reference/rest), [shared tasks](https://support.google.com/tasks/answer/11549608?hl=en), and [Apps Script installable triggers](https://developers.google.com/apps-script/guides/triggers/installable?authuser=19).

Google gives a clean foundation for private calendars: calendar ACL roles include free/busy, read, and write levels, while individual events can be private. The Calendar API can read and write events, and `quickAdd` accepts a text description; Apps Script can run time-driven daily/weekly jobs. The weak point is shared chores: the public Tasks API is organized around the authenticated user’s task lists, while Google’s documented shared tasks live in Chat/Docs and cannot repeat. A Google implementation therefore needs a shared chore source (for example, a shared list in another tool) or a small household data store. It is a strong `Adapt` foundation when most calendars are Google and the household can authorize one connector per person.

## Microsoft 365 Outlook + To Do + Graph

Links: [Microsoft To Do due dates and recurrence](https://support.microsoft.com/en-us/todo/add-due-dates-and-reminders-in-microsoft-to-do), [shared To Do lists](https://support.microsoft.com/en-US/ToDo/create-and-share-lists), [calendar sharing](https://support.microsoft.com/en-us/outlook/calendar-sharing-in-microsoft-365), [Graph create event](https://learn.microsoft.com/en-us/graph/api/user-post-events?view=graph-rest-1.0), and [Graph create To Do task](https://learn.microsoft.com/en-us/graph/api/todotasklist-post-tasks?view=graph-rest-1.0).

Microsoft is the most complete documented write-through stack for this request: To Do supports shared lists, due dates, reminders, and recurrence, and Graph can create tasks and events. The task API requires delegated user permission (`Tasks.ReadWrite`); app-only permission is unsupported. Graph event creation sends invitations when attendees are present, making the external-send approval check a hard requirement. Shared calendar sync is immediate for some same-tenant/Outlook.com combinations and delayed for cross-tenant or ICS cases. This is a strong `Adapt` foundation for a Microsoft household, with explicit consent and token management.

## Apple iCloud Calendar + Reminders + Shortcuts

Links: [private iCloud calendar sharing](https://support.apple.com/en-ie/guide/icloud/mm6b1a9479/icloud), [Reminders and Siri](https://support.apple.com/en-ie/102484), [shared Reminders lists](https://support.apple.com/guide/icloud/share-reminder-list-mm4bb3fa6e/icloud), [Calendar event creation/Siri](https://support.apple.com/en-ie/guide/iphone/iph3d110f84/ios), and [Shortcuts personal automations](https://support.apple.com/en-euro/guide/shortcuts/apd690170742/ios).

Apple covers native reminders, Siri date/time commands, shared Reminders lists, and private shared calendars with read-only or edit access. Shortcuts can trigger at a time of day and on recurring days, but Apple documents personal automations as device-specific. This makes an all-Apple household a good `Use existing` choice for reminders and simple digests, but a central cross-person weekly digest still needs a host device or another service. Per-person item-level redaction and an auditable external-send gate are not established by the checked pages.

## Todoist + Google/Outlook Calendar

Links: [natural-language dates](https://www.todoist.com/help/todoist/features/schedule-a-date-and-time-for-your-todoist-tasks-q7VobO), [project sharing](https://www.todoist.com/help/todoist/features/introduction-to-projects-TLTjNftLM), and [calendar integration](https://www.todoist.com/help/todoist/integrations/use-the-calendar-integration-rCqwLCt3G).

Todoist is strong for the typed command: its task parser accepts phrases such as “next week” and weekday dates. It shares projects and syncs scheduled tasks to Google or Outlook Calendar. Its privacy model is blunt: collaborators get full access to shared project information. The calendar integration also says a newly added event in the Todoist calendar does not create a task. Todoist can be the household chore backend, but it does not supply the budget/meeting-note synthesis or privacy policy on its own.
