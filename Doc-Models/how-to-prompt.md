# How to Prompt a Model

Keep it **specific**. The less guessing it has to do, the better the answer.

---

## The Formula

```
[Role] + [Context] + [Task] + [Format]
```

Only include what's relevant. Even 2 of the 4 is better than none.

---

## Examples

**Explaining something:**
```
I'm a junior dev. Explain [concept] using a simple analogy, 
then show a code example. Keep it under 200 words.
```

**Generating code:**
```
Write a [language] function called [name] that [does X].
It should handle [edge case]. Return only the code.
```

**Debugging (with code selected):**
```
This function should [expected behavior] but it [actual behavior].
What's wrong and how do I fix it?
```

**Code review (with code selected):**
```
Act as a senior [language] dev. Review the selected code for:
1. Security issues
2. Missing error handling
3. Readability problems
List each issue with a one-line fix.
```

**Learning:**
```
I know [what you know]. Explain [topic] in plain English.
No jargon. Under 150 words. Give one code example.
```

---

## Rules

- ✅ Include your stack and language
- ✅ Describe what the code should do, not just what it does
- ✅ Ask for a specific output format
- ❌ Don't say "fix it" without saying what's broken
- ❌ Don't ask 3 unrelated things in one prompt
- ❌ Never paste API keys or secrets

---

> ← [Back to Models](./README.md)
