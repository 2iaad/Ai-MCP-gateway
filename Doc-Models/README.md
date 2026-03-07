# 🧠 Models

## What is an AI model?

An AI model is a stateless function that maps input tokens → output tokens.

- It receives a prompt (token sequence) and generates a response.
- It does not store memory between requests. Each call is independent.
- Any “memory” in a chat is simulated by sending previous messages back into each new prompt.
- It cannot execute code, access files, or perform actions.

Its behavior is entirely determined by:
- The prompt
- Its fixed pre-trained weights
- Sampling parameters (temperature, top-p, etc.)

### 🔧 Typical Use Cases
- Explaining algorithms or system design
- Generating or refactoring code
- Static analysis of isolated functions
- Suggesting unit tests and edge cases


---

## What's inside

| File | What it covers |
|------|---------------|
| [how-to-prompt.md](./how-to-prompt.md) | How to write prompts that get useful answers |

---

> ← [Back to root](../README.md) · [Models vs Agents](../models-agents.md)
