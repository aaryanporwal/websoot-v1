---
title: "React re-renders: Context Trap 💣"
date: 2025-12-01T23:38:30+05:30
draft: false
tags:
  - "react"
  - "frontend"
  - "javascript"
  - "performance"
---

You've mastered `memo`, `useCallback`, and `useMemo`. Your components are optimized. Life is good.

Then you add Context... and everything re-renders again. Welcome to the Context trap.

## How Context Works

**Every component using `useContext` re-renders when the context value changes.** No exceptions.

`React.memo` won't save you. Your optimizations? Worthless.

```jsx
// This memo does NOTHING
const UserProfile = memo(function UserProfile() {
  const user = useContext(UserContext);
  return <div>{user.name}</div>;
});
```

When state in a context provider updates, React forces all context consumers to re-render, completely bypassing any memoization.

## Real-World Disaster

```jsx
// The nightmare scenario
const AppContext = createContext();

function App() {
  const [user, setUser] = useState({ name: "Alice" });
  const [theme, setTheme] = useState("dark");

  const value = { user, setUser, theme, setTheme };

  return (
    <AppContext.Provider value={value}>
      <Header />
      <Sidebar />
      <UserProfile />
    </AppContext.Provider>
  );
}
```

Change the theme? **Everything** re-renders. Update a notification? **Everything** re-renders. Type in a search bar? You get the idea.

## Fix #1: Split Your Contexts

Different data = different contexts.

```jsx
// Surgical precision
const UserContext = createContext();
const ThemeContext = createContext();

function App() {
  const [user, setUser] = useState({ name: "Alice" });
  const [theme, setTheme] = useState("dark");

  return (
    <UserContext.Provider value={user}>
      <ThemeContext.Provider value={theme}>
        <Header /> {/* Only re-renders for theme */}
        <UserProfile /> {/* Only re-renders for user */}
      </ThemeContext.Provider>
    </UserContext.Provider>
  );
}
```

## Fix #2: Separate Data from Setters

Splitting dispatch and state into separate contexts prevents unnecessary re-renders for components that only need to update state.

```jsx
// Setters never change
const UserContext = createContext();
const UserActionsContext = createContext();

function UserProvider({ children }) {
  const [user, setUser] = useState({ name: "Alice" });
  const actions = useMemo(() => ({ setUser }), []);

  return (
    <UserActionsContext.Provider value={actions}>
      <UserContext.Provider value={user}>{children}</UserContext.Provider>
    </UserActionsContext.Provider>
  );
}

// Form doesn't re-render when user changes
const UserForm = memo(function UserForm() {
  const { setUser } = useContext(UserActionsContext);
  return <button onClick={() => setUser({ name: "Bob" })}>Update</button>;
});
```

## Fix #3: Memoize Context Values

```jsx
// New object every render
function App() {
  const [user, setUser] = useState({ name: "Alice" });
  const value = { user, setUser }; // New reference!
  return <AppContext.Provider value={value}>...</AppContext.Provider>;
}

// ✅ Stable reference
function App() {
  const [user, setUser] = useState({ name: "Alice" });
  const value = useMemo(() => ({ user, setUser }), [user]);
  return <AppContext.Provider value={value}>...</AppContext.Provider>;
}
```

## When to Ditch Context

Context isn't a state management tool. When dealing with frequent updates or complex state, libraries like <a href="https://jotai.org/" target="_blank">Jotai</a>, <a href="https://zustand-demo.pmnd.rs/" target="_blank">Zustand</a>, or <a href="https://redux.js.org/" target="_blank">Redux</a> provide better performance through selective subscriptions.

Use Context for:

- Theme/auth state
- Infrequent updates
- Simple data passing

### Alternatives

Reach for <a href="https://jotai.org/" target="_blank">Jotai</a>, <a href="https://zustand-demo.pmnd.rs/" target="_blank">Zustand</a>, or <a href="https://redux.js.org/" target="_blank">Redux</a> when you need:

- Frequent updates (forms, animations)
- Complex state logic
- Selective subscriptions

## The Rules

1. **Split contexts** by update frequency
2. **Separate data from setters**
3. **Always memoize** context values
4. [**Consider alternatives**](#alternatives) for complex/frequent updates

Context is great for the right use cases. Just don't use it like a state manager.

## Further Reading

- Josh Comeau's ["Why React Re-Renders"](https://www.joshwcomeau.com/react/why-react-re-renders/#what-about-context-4/) explains the fundamental rendering behavior that makes context consumers re-render
- Mark Erikson's [guide](https://blog.isquaredsoftware.com/2021/01/context-redux-differences/#comparing-context-and-redux) clarifies why Context isn't state management and compares performance with Redux

Your optimizations matter again 🚀
