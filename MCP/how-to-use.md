# How to Use MCP

MCP lets the AI model **reach outside the chat** and use real tools.

---

## How It Works

An MCP setup has two sides:

| Side | What it does |
|------|-------------|
| **MCP Server** | A small program that exposes a tool ("read files", "query DB", "call an API") |
| **MCP Client** | The AI model/agent that calls those tools when it needs them |

```
You ask a question
  → Model recognizes it needs external data
    → Model calls an MCP tool (e.g. "read_file")
      → MCP server runs the tool and returns results
        → Model uses the results to answer you
```

You don't manually trigger any of this — the model decides when to use a tool.

---

## Real Examples

| MCP Server | What it gives the AI |
|---|---|
| **Filesystem** | Read/write local files |
| **GitHub** | Read repos, PRs, issues |
| **Postgres / SQLite** | Query a real database |
| **Brave Search** | Live web search |

---

## As a Junior Dev — What You Actually Do

Most of the time, MCP is configured once by you or your team. After that, you just use it through normal prompts.

**Step 1 — Install an MCP server**

Example: add the filesystem server to your Copilot or Claude config:
```json
{
  "mcpServers": {
    "filesystem": {
      "command": "npx",
      "args": ["-y", "@modelcontextprotocol/server-filesystem", "/your/project/path"]
    }
  }
}
```

**Step 2 — Prompt normally**

The model will use the MCP tool automatically when it's relevant:
```
Summarize all TODO comments across the project.
```
```
Look at the users table in the database and tell me if there 
are any rows with a null email.
```
```
Find all files in the project that import from "utils/auth".
```

No need to tell it *how* to use the tool — just ask for what you need.

---

## Rules

- ✅ Ask outcome-focused questions — the model decides which tool to use
- ✅ Scope your request (don't ask it to "search everything" on large projects)
- ✅ Verify results — MCP tools return real data, but the model can still misinterpret it
- ❌ Don't give MCP servers access to more than they need (principle of least privilege)
- ❌ Don't assume it worked — ask for a summary of what it found

---

## When to Use MCP vs. Regular Prompting

| Situation | Use |
|---|---|
| You need the AI to read your actual files | MCP |
| You need the AI to query a real database | MCP |
| You need a live web search | MCP |
| You're explaining or generating code | Regular prompt (no MCP needed) |
| You're doing multi-step work across files | Agent (which can use MCP internally) |

---

> ← [Back to MCP](./README.md)
