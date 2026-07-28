---
title: "Why LLMs Trip Over the Rs in Strawberry"
date: 2026-07-28
draft: false
tags:
  - "AI"
  - "Machine-Learning"
description: "LLMs do not see words the way string functions do. That is why tiny spelling, counting, and reversal tasks can still go sideways."
---

Ask a language model:

> How many `r`s are in `strawberry`?

The correct answer is **three**.

<details>
<summary>Sidenote: newer models often get this one right now</summary>

`strawberry` became the poster child for this failure mode, so the famous test case has been studied, trained around, and explained to death. That does not make the underlying problem disappear. It just makes this one pothole easier to avoid.

</details>

The useful question is not "can my model answer the strawberry meme?" It is:

> Can I trust a language model to perform character-perfect string operations?

Usually, no. At least not without help.

## The core problem

LLMs are language machines, not string libraries.

When I type `strawberry`, I see ten characters:

```text
s t r a w b e r r y
```

A model usually sees tokens first. Depending on the [tokenizer](https://platform.openai.com/tokenizer), `strawberry` may be one token, multiple subword tokens, or split differently with a leading space.<sup>[1](#ref-1)</sup> That is great for language modeling because the model can handle huge vocabularies without storing every word as its own primitive.

But it means a tiny question like "how many `r`s?" is secretly asking the model to run a small program:

1. Recover the word's spelling.
2. Break it into characters.
3. Track the matching characters.
4. Return the exact count.

The model can simulate that. Modern models often do. But the architecture does not guarantee that it will execute the procedure perfectly every time.<sup>[2](#ref-2)</sup>

That same issue shows up in spelling, counting, reversing, parsing IDs, checking exact formats, and dealing with repeated characters.<sup>[3](#ref-3)</sup> The more the task depends on precise character positions, the less I want to leave it to vibes.

## What this is not

It is not just "LLMs are probabilistic, so they guess." True, but lazy.

For common words, a strong model usually knows the spelling. It is not inventing `strawberry` from scratch. The failure happens because character counting is an exact symbolic operation over a system optimized for statistical language prediction.<sup>[3](#ref-3)</sup>

It is also not a context-window problem. The word is right there in the prompt. Nothing fell out of memory. The model has access to the text; access is not the same as running a deterministic string function.

## The practical fix

If the answer must be exact, give the exact part to code:

```js
const word = "strawberry";
const count = [...word].filter((letter) => letter === "r").length;
```

If you still want the model to reason through it, make the intermediate representation visible:

```text
Write the word as space-separated characters first.
Then count only the characters equal to "r".
Do not answer until both steps are shown.
```

That forces the useful habit:

```text
s t r a w b e r r y
r appears at positions 3, 8, and 9.
Answer: 3
```

For production systems, I would use the model for language, judgment, explanation, and synthesis. I would use a string function for exact spelling, counting, validation, parsing, and reversal. Boring code is undefeated at this class of problem.

## Update: the strawberry meme has been patched, sort of

Newer models have learned this specific benchmark-shaped pothole. Ask them the classic `strawberry` question and many now spell the word out, count the two `r`s in `berry`, add the one in `straw`, and land on **3**.

That is not progress, that is cheating (or cramming :p). Once a prompt becomes famous enough, it enters the training and evaluation bloodstream. 

But the crux remains as-is: AI engineering is knowing when to stop prompting and call the string library.

## References

1. <span id="ref-1"></span>[Sennrich, Haddow, and Birch: Neural Machine Translation of Rare Words with Subword Units](https://aclanthology.org/P16-1162/)
2. <span id="ref-2"></span>[Vaswani et al.: Attention Is All You Need](https://arxiv.org/abs/1706.03762)
3. <span id="ref-3"></span>[Fu et al.: Why Do Large Language Models Struggle to Count Letters?](https://arxiv.org/abs/2412.18626)
