---
title: "Type Coercion In JavaScript 🍭"
date: 2021-06-25T04:57:26+05:30
draft: false
tags:
  - "javascript"
  - "nodejs"
  - "weird-js"
---

This small blog was sparked by a post that I saw: ![Weird JavaScript](https://i.imgur.com/5JbayVc.png)

There are many posts like the above on the internet, and almost all of them are because of this type coercion thingy. So in this blog, I'm gonna try to explain what type coercion is and what's happening in that post 😉.

# What is type coercion?

There are 6 primitive data types in JavaScript: undefined, Boolean, Number, String, BigInt and Symbol. When you try to do things like adding two different data types together, JavaScript uses some rules to decide how it's gonna coerce one type into the other type, to actually add them together.

Some fun examples:

- `"a" + 0 = "a0"` -> Number coerced into a string.

* true + 0 = 1 -> Boolean coerced into a Number.
* true + 2 = 3 -> True coerced into the number one(1).
* false + 2 = 2 -> False coerced into the number zero(0).
* +true = 1 -> Our \`**`+`**\` here is a unary operator which is trying to coerce a boolean into a Number.
* +[] = 0 -> An empty array is a falsy value in JavaScript which is coerced into a Number.

So what's happening in our expression

`('b' + 'a' + + 'a' + 'a').toLowerCase()` is:

The first two characters are simply concatenated, then `+'a'` coerces a character into a Number, which results in a [NaN](https://tc39.es/ecma262/multipage/global-object.html#sec-value-properties-of-the-global-object-nan) because `NaN` is of data type Number as well, `NaN` gets coerced into a string because it's being added to `'a'`.

Thank you for reading the post!
