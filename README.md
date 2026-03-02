# 🤖 Prompt Engineering for Developers

> **"Talking to AI is a skill — and like any skill, it gets better with practice."**

Welcome! This repository is a beginner-friendly guide to **prompt engineering** — the art of communicating effectively with AI coding assistants like **GitHub Copilot** and **Amazon Q**.

Articles often feature titles like "Top 10 Prompts for ChatGPT". However, any prompt could be the "best" if written to enhance the effectiveness of the model’s Attention Mechanism. Prompt engineering optimizes this mechanism by guiding the model to focus on the most relevant aspects of a query.

---

## 🎯 Who Is This For?

This guide is for **junior developers** who:

- Use **GitHub Copilot** or **Amazon Q** inside their IDE (VS Code, JetBrains, etc.)
- Get vague or unhelpful answers and don't know why
- Want to get **faster, better, and more accurate** results from AI
- Have never heard of "prompt engineering" before

No previous experience needed. We start from zero. 🚀

---

## 🛠️ What Makes IDE AI Different?

Unlike standalone tools like ChatGPT, Copilot and Amazon Q live **inside your editor**. This means:

| Feature | Standalone Chat (ChatGPT) | IDE Chat (Copilot / Amazon Q) |
|---------|--------------------------|-------------------------------|
| Sees your code | ❌ You must paste it | ✅ Can access your open files |
| Knows your project | ❌ No context | ✅ Can reference workspace files |
| Slash commands | ❌ | ✅ `/fix`, `/explain`, `/tests`, `/doc` |
| Inline suggestions | ❌ | ✅ Autocompletes as you type |

This changes how we write prompts. We can be more **concise** and use **references** instead of pasting entire files.

---

## 📚 What's Inside

| | Directory | What you'll find |
|---|-----------|------------------|
| 🧠 | [Models/](./Models/) | What a model is, when to use it, how to write good prompts |
| 🤖 | [Agents/](./Agents/) | What an agent is, when to use it, how to give it a good goal |
| 🔌 | [MCP/](./MCP/) | What MCP is, how the AI uses external tools and data |

**Not sure which one to use?** → Read [Models vs Agents](./models-agents.md) first.

---

## 🗺️ How to Navigate

**Using Copilot/Amazon Q chat** → Go to [Models/](./Models/)

**Using Copilot Agent or Amazon Q `/dev`** → Go to [Agents/](./Agents/)

**Not sure what the difference is** → [Models vs Agents](./models-agents.md)

---

## ⚡ Quick Preview: The Difference a Prompt Makes

The same request, asked two different ways in Copilot or Amazon Q:

**❌ Vague prompt:**
```
fix my code
```

**✅ Clear prompt:**
```
This function is supposed to return users from the database but it 
returns an empty array. The database has data. What's wrong and how 
do I fix it?
```

The second prompt gives the AI **a goal and a problem** — and gets a real, useful answer.

---

## 💬 The Golden Rule

> **The more specific and clear you are, the better the AI performs.**

IDE AI can see your code, but it still needs **you to guide it** toward the right answer. Your job is to describe the problem clearly — not just ask it to "fix things."

---

## 🤝 Contributing

Found a better way to phrase something? Have an example to share? Pull requests are welcome!

1. Fork the repo
2. Create a branch: `git checkout -b my-improvement`
3. Make your changes
4. Open a Pull Request

---

## 📄 License

MIT — free to use, share, and learn from.

---

*Happy prompting! 🚀*
