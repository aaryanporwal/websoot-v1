---
title: "React re-renders: Stop the Madness 🎯"
date: 2025-11-04T17:30:40+05:30
draft: false
tags:
  - "react"
  - "frontend"
  - "javascript"
---

Ever wonder why your React app feels sluggish? Let's fix those unnecessary re-renders.

## When Does React Re-render?

Three triggers:

1. Props change
2. State changes
3. Parent re-renders

**The catch?** React does shallow comparisons. New object/function references = re-render, even with identical values. That's where `useMemo`, `useCallback`, and `React.memo` save the day.

## The Problem

```jsx
// ❌ ExpensiveChild re-renders on EVERY keystroke
function Parent() {
  const [count, setCount] = useState(0);
  const [text, setText] = useState("");

  return (
    <>
      <input value={text} onChange={(e) => setText(e.target.value)} />
      <button onClick={() => setCount(count + 1)}>Count: {count}</button>
      <ExpensiveChild count={count} />
    </>
  );
}
```

## Solution 1: React.memo

```jsx
// ✅ Only re-renders when count actually changes
const ExpensiveChild = memo(function ExpensiveChild({ count }) {
  return <div>Count is: {count}</div>;
});
```

## Solution 2: Component Composition (Even Better!)

Here's the secret: **you often don't need memo at all.**

```jsx
// ✅ BEST: Split components by what changes
function Parent() {
  const [count, setCount] = useState(0);

  return (
    <>
      <button onClick={() => setCount(count + 1)}>Count: {count}</button>
      {/* Pass ExpensiveChild as children */}
      <TextInput>
        <ExpensiveChild count={count} />
      </TextInput>
    </>
  );
}

function TextInput({ children }) {
  const [text, setText] = useState("");

  // When text changes, ONLY TextInput re-renders
  // children prop stays the same, so React skips that subtree
  return (
    <>
      <input value={text} onChange={(e) => setText(e.target.value)} />
      {children}
    </>
  );
}

function ExpensiveChild({ count }) {
  console.log("ExpensiveChild rendered"); // Only logs when count changes!
  return <div>Count is: {count}</div>;
}
```

**Why this works:**
We split the component in two. The parts that depend on text, together with the text state itself, moved into TextInput. The parts that don't care about text stayed in Parent and are passed to TextInput as JSX content (the `children` prop).

When text changes, TextInput re-renders. But it still has the same `children` prop it got from Parent last time, so React doesn't visit that subtree. As a result, `<ExpensiveChild />` doesn't re-render.

**No memo, no useCallback, no useMemo needed!**

## Callbacks Are Trickier

```jsx
// ❌ New function reference every render
const handleClick = () => console.log("Clicked!");

// ✅ Stable reference with useCallback
const handleClick = useCallback(() => {
  console.log("Clicked!");
}, []);
```

> **Pro Tip:** Use named functions in `memo()` instead of arrow functions. React DevTools will thank you with better debugging instead of "Anonymous" components everywhere.

## Quick Reference

**Optimization Strategy (in order of preference):**

1. **Component composition** (children pattern) - Try this first!
2. **React.memo** - When composition isn't possible
3. **useCallback** - For callbacks passed to memoized components
4. **useMemo** - For expensive computations

## When useCallback and useMemo Become Too Much?

React's memo hooks are great, until they're not.
Every useCallback and useMemo has its own cost. React must track dependencies, store values, and compare them every render.

### The "Over-Optimized" Trap:

```jsx
const handleChange = useCallback((e) => setFilter(e.target.value), []);
const filtered = useMemo(
  () => items.filter((i) => i.match(filter)),
  [items, filter]
);
```

Looks fast? Not really.
If items is small and no child is memoized, this "optimization" actually adds overhead and hurts readability.

### The Rule of Thumb:

| Situation                              | Memoization? | Why                        |
| -------------------------------------- | ------------ | -------------------------- |
| Can restructure with composition       | ❌           | Use children pattern first |
| Simple handlers, small lists           | ❌           | Overhead > benefit         |
| Expensive computations                 | ✅           | Worth caching              |
| Passing props to `React.memo` children | ✅           | Prevents re-renders        |
| No real performance issue              | ❌           | Don't optimize prematurely |

> **Pro Tip:** Measure first, memoize later. Unnecessary `useMemo` and `useCallback` often make code slower and harder to reason about. And before reaching for memo hooks, ask yourself: "Can I restructure this with component composition?"

Alright, that's it for this blog post.

More performance tricks coming soon.

Stay tuned and happy coding!
