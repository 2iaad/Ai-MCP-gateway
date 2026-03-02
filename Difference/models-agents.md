# 🤖 AI Models vs AI Agents — What's the Difference?

As a developer using AI daily, you'll hear both terms constantly. Here's exactly what each one means and how to tell them apart.

---

## 🧠 What Is an AI Model?

An AI model is the **brain** — a trained system that takes an input and produces an output.

It answers one question at a time. It doesn't take actions. It doesn't remember anything between sessions. It just responds.

It does not:
- Call APIs by itself.
- Browse automatically.
- Save memory.
- Loop over tasks.
- Make decisions across steps.

**Think of it like:** A very smart person sitting in a room. You pass a note under the door with a question. They write an answer and pass it back.

---

## 🤖 What Is an AI Agent?

An AI agent is a **model + the ability to take actions**.

It can use tools, run code, browse the web, read files, call APIs, and make decisions over multiple steps — all on its own — to complete a goal.

**Think of it like:** Instead of just answering your note, that same smart person can now *leave the room*, open your laptop, search Google, edit files, run the code, check if it works, and come back with the completed task.

---

## ⚖️ The Key Differences

| | **AI Model** | **AI Agent** |
|---|---|---|
| What it does | Responds to prompts | Completes multi-step tasks |
| Can take actions? | ❌ No | ✅ Yes (run code, edit files, call APIs) |
| Makes decisions? | ❌ No | ✅ Yes — plans and adapts |
| Remembers steps? | ❌ No | ✅ Yes — within a task |
| You control each step? | ✅ Yes | ⚠️ Partially — it acts autonomously |
| Example | ChatGPT answering a question | Copilot Agent fixing a bug across 5 files |

---

## 💡 In Simple Terms

> **A model answers. An agent acts.**

When you ask Copilot Chat *"what's wrong with this function?"* → you're using a **model**.

When you tell Copilot Agent *"fix the failing tests in this project"* and it goes through files, makes edits, reruns tests, and iterates on its own → you're using an **agent**.

---

## 🛠️ What This Means for You as a Developer

- When you **prompt** (ask a question, explain something, generate a snippet) → you're talking to a **model**. The prompting skills in this guide apply here.
- When you use **agent mode** (Copilot Agent, Amazon Q `/dev`) → the AI will ask for your goal upfront, then work autonomously. Your job is to **describe the goal clearly**, then review what it did.

> ⚠️ **Agent mode tip:** Always review the changes an agent makes before accepting them. Agents can make mistakes across many files at once — which is harder to undo than a single wrong answer.

---

*→ [Back to Home](./README.md)*
