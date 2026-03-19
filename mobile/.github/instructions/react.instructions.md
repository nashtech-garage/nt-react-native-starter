---
applyTo: "**/*.ts,**/*.tsx,**/*.js,**/*.jsx"
---

# React Native Rules Index

This file has been **split into focused rule sets** for better Cursor performance and maintainability.

## Rule Files Overview

### 🎯 [react-core.mdc](./react-core.instructions.md)

**Core React Native patterns, components, and mobile practices**

- Functional components and hooks
- Redux Toolkit state management
- Component composition for mobile
- Touch handling and gestures
- Form handling with mobile keyboard

### 🏗️ [react-architecture.md](./react-archiecture.instructions.md)

**React Native project structure, navigation, and architectural patterns**

- React Native directory structure
- Screen and component organization
- Feature-based mobile architecture
- Import organization
- Navigation patterns with React Navigation

### 🔧 [react-typescript.md](./react-typescript.instructions.md)

**TypeScript best practices for React Native development**

- Strict TypeScript configuration
- Component and screen props typing
- API and service typing for mobile
- Platform-specific typing patterns
- Documentation standards

### ⚡ [react-performance.md](./react-performance.instructions.md)

**Mobile performance optimization and bundle management**

- React Native performance patterns (FlatList, memoization)
- Code splitting and lazy loading
- Image optimization for mobile
- Bundle size management
- Platform-specific optimizations

### 🧪 [react-testing-security.md](./react-testing-security.instructions.md)

**Testing strategies, security practices, and mobile accessibility**

- Component and hook testing for React Native
- Navigation testing patterns
- Platform-specific testing
- Mobile security best practices
- Accessibility guidelines for mobile

## Quick Reference

### Essential React Native Patterns

```typescript
// React Native functional component with TypeScript
import React, { useState, useCallback } from "react";
import { View, Text, TouchableOpacity, StyleSheet } from "react-native";

interface Props {
  title: string;
  onAction?: () => void;
}

export const Component: React.FC<Props> = ({ title, onAction }) => {
  const [state, setState] = useState<StateType>(initialState);

  const handlePress = useCallback(() => {
    onAction?.();
  }, [onAction]);

  return (
    <TouchableOpacity onPress={handlePress} style={styles.container}>
      <Text style={styles.title}>{title}</Text>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  container: {
    padding: 16,
    backgroundColor: "#f0f0f0",
  },
  title: {
    fontSize: 16,
    fontWeight: "bold",
  },
});
```

### State Management

- **Local State**: `useState`, `useReducer`
- **Global State**: Redux Toolkit (primary)
- **Server State**: React Query/TanStack Query
- **Navigation State**: React Navigation

### Performance Rules

- Use `React.memo` for expensive components
- Use `FlatList` for large lists, not ScrollView
- Use `useCallback` for event handlers passed as props
- Use `useMemo` for expensive calculations
- Implement lazy loading for screens
- Optimize images with proper sizing and formats

### Testing Requirements

- 70% unit tests, 20% integration, 10% E2E
- Use React Native Testing Library
- Test both iOS and Android platforms
- Mock native modules and APIs
- Include accessibility tests for mobile
- Test navigation flows

---

## Migration Notes

The original comprehensive rules file has been split for better organization:

- **Improved focus**: Each file covers specific concerns
- **Better performance**: Shorter files for Cursor to process
- **Easier maintenance**: Targeted updates to specific areas
- **Clearer structure**: Find relevant rules faster

**All previous functionality is preserved** across the split files.
