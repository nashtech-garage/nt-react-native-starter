# GitHub Copilot Instructions

This is a **React Native** mobile application built with TypeScript, Redux Toolkit, React Navigation, and React Native Testing Library. Follow all rules below when generating, editing, or reviewing code.

---

## Agents

Use the specialized agents in `.github/agents/` for domain-specific tasks:

| Agent              | File                | When to Use                                                                   |
| ------------------ | ------------------- | ----------------------------------------------------------------------------- |
| **Coding_Agent**   | `coding.agent.md`   | Writing or refactoring React Native components, hooks, screens, Redux slices  |
| **Planning_Agent** | `planning.agent.md` | Breaking down a feature into tasks before implementation                      |
| **Review_Agent**   | `review.agent.md`   | Auditing existing code for bugs, architecture violations, and security issues |
| **Testing_Agent**  | `testing.agent.md`  | Generating or auditing unit, integration, and E2E tests                       |

---

## Instruction Files

All coding rules are defined in `.github/instructions/`. These apply to all `*.ts`, `*.tsx`, `*.js`, and `*.jsx` files:

| File                                     | Scope                                                               |
| ---------------------------------------- | ------------------------------------------------------------------- |
| `react-core.instructions.md`             | Component structure, hooks, Redux Toolkit, touch handling, forms    |
| `react-typescript.instructions.md`       | TypeScript interfaces, prop typing, generics, strict mode           |
| `react-archiecture.instructions.md`      | Feature-first directory layout, navigation patterns, barrel exports |
| `react-performance.instructions.md`      | FlatList, memoization, image optimization, bundle size              |
| `react-testing-security.instructions.md` | Testing pyramid, Testing Library, MSW mocking, security/OWASP       |
| `figma.instructions.md`                  | Figma MCP integration, design-to-code rules, asset handling         |
| `react.instructions.md`                  | Index — links all rule files above                                  |

---

## Core Rules (Always Apply)

### Components

- Functional components only — **no class components**
- Named exports preferred over default exports
- All styles via `StyleSheet.create()` — no inline style objects
- Use `View`, `Text`, `TouchableOpacity`/`Pressable`, `FlatList`, `ScrollView` — no HTML elements

### TypeScript

- Explicit interfaces for all props, state, and API response shapes
- No `any` without a comment justifying it
- No non-null assertions (`!`) unless provably safe
- Return types required on all exported functions and hooks

### Hooks

- Hooks at the top of the component — never inside conditions, loops, or callbacks
- `useEffect` must have a complete dependency array
- Side effects with subscriptions/timers must return a cleanup function
- `useCallback` / `useMemo` required for callbacks and values passed to memoized children

### State Management

- Redux Toolkit (`createSlice`, `createAsyncThunk`) for global state
- Immutable updates only — never mutate state directly outside Immer-managed reducers
- Local UI state via `useState`; server/async state via Redux thunks or RTK Query

### Navigation

- React Navigation only — typed route params with `RootStackParamList`
- No `navigation.navigate` calls inside business logic — trigger via callbacks

### Testing

- Testing pyramid: **70% unit / 20% integration / 10% E2E**
- `@testing-library/react-native` for all component and screen tests
- `renderHook` + `act` for custom hook tests
- MSW (`msw/native`) for API mocking — never mock `fetch` or `axios` directly
- Fresh Redux store per test — no shared mutable store state

### Figma / Design

- When a Figma link is provided, use **Figma MCP tools** to extract design tokens and download assets
- Convert all Figma CSS to React Native `StyleSheet` properties (camelCase, numeric units)
- Handle safe areas, notch, and screen density — never hardcode pixel values from desktop Figma specs

### Security

- Validate and sanitize all user inputs at form submission boundaries
- Never log or render sensitive data (tokens, passwords, personal info)
- Auth-guarded screens must redirect unauthenticated users — enforce in navigators, not screens
- Follow OWASP Mobile Top 10 guidelines

---

## Project Structure

```
src/
  assets/          # Fonts, images, translations
  components/      # Shared reusable UI components
  contexts/        # React context providers
  hooks/           # Shared custom hooks
  models/          # TypeScript data models
  reducers/        # Root reducer
  screens/         # Screen components + feature sub-folders
  services/        # API service layer
  slices/          # Redux slices
  stores/          # Redux store configuration
  thunks/          # Redux async thunks
  types/           # Shared TypeScript types
```

---

## What Copilot Should NOT Do

- Do not generate class components
- Do not use inline styles or `StyleSheet`-less styling
- Do not use `any` without justification
- Do not import from `react-dom` or use HTML/web-only APIs
- Do not create new global state for local UI concerns
- Do not add new third-party libraries without flagging it for approval
- Do not skip test coverage for Redux thunks, custom hooks, or form validation logic
