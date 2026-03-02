# 🔌 MCP — Model Context Protocol

## What is MCP?

MCP is a **standardized way for AI models to connect to local and remote resources**.

Without MCP, a model is isolated, it can only work with what you paste into the prompt. With MCP, the model can reach out and actually *use* things: read files, query databases, call APIs, run searches.

---

## How It Works

```
You → Model → MCP → [Tool / Database / API / File System]
```

The model decides when it needs external data, calls the right MCP tool, gets the result back, and uses it to answer you.

---

## What's Inside

| File | What it covers |
|------|----------------|
| [how-to-use.md](./how-to-use.md) | How MCP servers work and how to use them in your IDE |

---

> ← [Back to root](../README.md) · [Models vs Agents](../models-agents.md)
