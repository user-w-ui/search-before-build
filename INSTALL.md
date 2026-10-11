# Install Search Before Build

These instructions are for an AI coding agent that a user has asked to install Search Before Build. Install it for the agent you are running in, and nothing else.

1. Work out which agent you are running in. If you cannot tell, ask the user.
2. Tell the user the commands you are about to run, then run only the ones for that agent:

   | Agent | Commands |
   | --- | --- |
   | Claude Code | `claude plugin marketplace add user-w-ui/search-before-build`, then `claude plugin install search-before-build@search-before-build` |
   | Codex | `npx @superq/search-before-build install` |
   | OpenCode | Check that `opencode --version` is 2.0 or later, then `opencode plugin add github:user-w-ui/search-before-build` |
   | Pi | `pi install git:github.com/user-w-ui/search-before-build` |
   | Cursor, GitHub Copilot, VS Code, or another Agent Plugins client | No command. Tell the user to install `https://github.com/user-w-ui/search-before-build` from the client's plugin manager. |

   For any other agent, tell the user it is not supported yet and stop.
3. If a command fails, show the user the error and stop. Do not edit configuration files by hand or try other install methods.
4. Do not set up GitHub search, MCP servers, or anything else during installation. The `assess` skill offers that later when it would help.
5. When installation succeeds, tell the user to start a new session so the skills load, and how to call them:
   - Claude Code: `/search-before-build:assess <idea or project path>` or `/search-before-build:quick-search <idea>`
   - OpenCode: `@search-before-build-assess <idea or project path>` or `@search-before-build-quick-search <idea>`
   - Other agents: ask in plain words, for example "use the assess skill to check whether this idea is worth building".

   `assess` decides whether an idea or an existing project is worth building or continuing; `quick-search` quickly checks whether something similar already exists.
