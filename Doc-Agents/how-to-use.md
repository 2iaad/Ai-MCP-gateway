# How to Use an Agent

An agent works **autonomously** toward a goal. Your job is to describe that goal clearly, then review what it did.

---

## How It Works

```
You describe the goal → Agent plans → Agent acts → You review
```

You're not writing step-by-step instructions. You're giving it an outcome to achieve.

---

## How to Give a Good Goal

**Be outcome-focused, not step-focused.**

❌ Too vague:
```
help me with my code
```

❌ Too prescriptive (you're doing the agent's job):
```
open file X, add import Y, then go to line 42 and change Z...
```

✅ Just right — clear goal, enough context:
```
The tests in /auth are failing because the JWT middleware is rejecting 
valid tokens. Fix the middleware so valid tokens pass, and make sure 
the existing tests still pass.
```

---

## Templates

**Fix a bug across the codebase:**
```
[Describe the symptom and where it's happening].
Fix it and make sure no existing tests break.
```

**Build a feature:**
```
Add [feature] to [part of the app].
It should [behavior 1], [behavior 2].
Use the same patterns already in the codebase.
Write tests for it.
```

**Refactor:**
```
Refactor [file or module] to [goal — e.g. use async/await, reduce duplication].
Do not change any public-facing behavior.
```

**Generate and run tests:**
```
Write and run unit tests for [file/function].
Cover: happy path, empty input, and invalid types.
Use [Jest / Pytest / etc].
```

---

## Rules

- ✅ State the **goal**, not the steps
- ✅ Give enough context (which file, which feature, what's broken)
- ✅ Always **review the diff** before accepting changes
- ✅ Start small — test with one file before letting it touch everything
- ❌ Don't let it run loose on large codebases without scoping the task
- ❌ Don't skip the review — agents can silently break things

---

## When NOT to Use an Agent

Use a regular model prompt instead if:
- You just need an explanation or a quick answer
- You want to generate a single function or snippet
- You're still exploring — you don't fully know what you want yet

---

> ← [Back to Agents](./README.md)
