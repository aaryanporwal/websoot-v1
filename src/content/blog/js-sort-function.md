---
title: "What's Wrong with JavaScript sort() Function 🤔"
date: 2022-12-01T21:18:47+05:30
draft: false
tags:
  - "javascript"
  - "weird-js"
---

This year I decided to solve the famous Advent of Code Challenge in both Python and _JavaScript_.
I'm also gonna be posting my solutions on my [GitHub repository](https://github.com/aaryanporwal/advent_of_code_2022).

And while solving today's [advent of code challenge](https://adventofcode.com/2022/day/1), in javascript. I came across a weird behaviour of the `sort()` function in javascript.
I was trying to sort an array of numbers, and I was using the sort function like this:

```js
const myArray = myArray.sort();
```

then I console.log()ed it to see the result, and it was sorted in ascending order. But when I tried to sort it in descending order, it didn't work. I tried to do this:

```js
const myArray = myArray.sort().reverse();
```

even this didn't work. Which prompted me to look into the documentation of the sort function.
And to my absolute surprise, I saw this example on mdn docs:

```js
const months = ["March", "Jan", "Feb", "Dec"];
months.sort();
console.log(months);
// expected output: Array ["Dec", "Feb", "Jan", "March"]

const array1 = [1, 30, 4, 21, 100000];
array1.sort();
console.log(array1);
// expected output: Array [1, 100000, 21, 30, 4]
```

The first example made sense, but the second one was SHOCKING, and then I read this in the documentation of the sort function:

> _The default sort order is built upon converting the elements into strings, then comparing their sequences of UTF-16 code units values._

So, the sort function converts the elements into strings, and then compares them. Therefore, when I tried to sort an array of numbers, it converted them into strings, and then compared them. Which just doesn't work for numbers, because the string representation of 100000 is greater than the string representation of 21, which is greater than the string representation of 4, and so on.

This is a **very weird behaviour**. I don't know why they did this, but I think they should have made a separate function for sorting strings, and kept the sort function for sorting numbers. Or they should have made the sort function work for both numbers and strings.

I hope someone finds this useful.

Also in js to sort an array of numbers in descending order, you can do this:

```js
const myArray = myArray.sort((a, b) => b - a);
```

Till next time, bye!
