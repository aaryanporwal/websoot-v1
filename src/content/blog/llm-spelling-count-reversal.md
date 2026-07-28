---
title: "Why LLMs Aren’t Reliable at Spelling, Counting, or Reversing Words"
date: 2026-07-28
draft: false
---

Large Language Models (LLMs) are great at generating fluent prose, answering questions, and even writing code.

But when it comes to **exact spelling, counting letters, or reversing words**, they often slip. Here’s why:

| Task | Why It Bites | What Happens |
|------|--------------|--------------|
| **Spelling a single word** | The model makes a *probabilistic guess* based on token frequencies. If a word is rare or has spelling variations, the top‑probability token might be the wrong form. | ✒️ *recieve* instead of *receive* |
| **Counting letters** | Counting isn’t a property contained in the training data; the model must *simulate* a counter. It has no internal state to track counts across tokens. | 🐸 There are *four* `r`s in *strawberry*? → *There are 3.* |
| **Reversing a word** | Reversing requires *perfect positional encoding* and a reversible mapping from tokens to characters, which the transformer architecture doesn’t guarantee for arbitrary sequences. | ❌ “reverse `strawberry`” → *yreb‑…* (almost). |
| **Exact phrase recall** | The model is seeded by a *context window* (e.g., 32k tokens). Out‑of‑window content loses precision, especially for low‑frequency facts. | ❔ How many `r`s in strawberry? → *Five.* (Wrong) |

### Key Takeaways
1. **Probabilistic vs. deterministic** – LLMs approximate language; they’re not calculators.
2. **Tokenization quirks** – Words may be split into sub‑tokens; re‑assembling them exactly is error‑prone.
3. **No hidden counter** – Without a dedicated numeric module, counting relies on pattern matching, which fails on edge cases.
4. **Reversible mapping not guaranteed** – Transformers treat text as a sequence of tokens, not as a reversible string.

### What to Do Instead
- Use a domain‑specific tool (regex, string library, or a dedicated spell‑checker) for exact spelling and counting.
- Wrap the LLM prompt in code and let a local script verify the result.
- Use alignment‑aware models (e.g., specialized “reversible transformer” research) if the task is central.

> Bottom line: LLMs are *pattern recognisers*, not *language engineers*. For tasks that demand perfect precision, hand off to a tight‑coupled program.

Feel free to tweak this to match your tone! 🚀
