---
applyTo: "**/*.ts,**/*.tsx,**/*.js,**/*.jsx"
---

# React Native Core Patterns

## Component Standards

### Functional Components Only

- Use functional components with hooks
- NO class components unless absolutely necessary for error boundaries
- Export as named exports, not default exports when possible
- Always include StyleSheet for styling

### React Native Component Structure

```typescript
import React, { useState, useCallback } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  ViewStyle,
} from "react-native";

interface ComponentProps {
  required: string;
  optional?: number;
  children?: React.ReactNode;
  style?: ViewStyle;
}

export const ComponentName: React.FC<ComponentProps> = ({
  required,
  optional = defaultValue,
  children,
  style,
  ...props
}) => {
  // Hooks at the top
  const [state, setState] = useState<StateType>(initialState);

  // Event handlers for mobile interactions
  const handlePress = useCallback(() => {
    // handler logic
  }, [dependencies]);

  // Early returns for conditional rendering
  if (conditionalReturn) {
    return (
      <View style={styles.container}>
        <Text>Early return</Text>
      </View>
    );
  }

  return (
    <TouchableOpacity
      onPress={handlePress}
      style={[styles.container, style]}
      {...props}
    >
      <Text style={styles.text}>{required}</Text>
      {children}
    </TouchableOpacity>
  );
};

// StyleSheet must be at the bottom of the file
const styles = StyleSheet.create({
  container: {
    padding: 16,
    backgroundColor: "#f0f0f0",
    borderRadius: 8,
  },
  text: {
    fontSize: 16,
    fontWeight: "bold",
    color: "#333",
  },
});
```

### Props and TypeScript for React Native

- Always define interface for props
- Use React.ReactNode for children
- Include style props with proper React Native types (ViewStyle, TextStyle, ImageStyle)
- Destructure props in function signature
- Use optional chaining for optional props
- Spread remaining props with ...props
- Consider platform-specific props when needed

### Hook Usage Rules

- Hooks must be at the top of components
- Never call hooks conditionally
- Use useCallback for event handlers passed as props (especially onPress)
- Use useMemo for expensive calculations only
- Custom hooks must start with 'use'
- Use Redux hooks (useSelector, useDispatch) for global state
- Use navigation hooks (useNavigation, useRoute) for navigation

## State Management Patterns

### Local State (useState)

```typescript
// Simple state for UI interactions
const [isVisible, setIsVisible] = useState(false);
const [loading, setLoading] = useState(true);

// Complex state - use Redux Toolkit instead for global state
const [formData, setFormData] = useState({
  name: "",
  email: "",
  // ... many fields - consider Redux Toolkit for complex forms
});
```

### Global State Guidelines (Redux Toolkit Primary)

- **Redux Toolkit**: Primary choice for all global state management
- **useState + Context**: Only for simple app-wide state (theme, preferences)
- **React Query/TanStack Query**: For server state and caching ALWAYS
- **Navigation State**: Handled by React Navigation automatically

### Redux Toolkit Pattern (Primary)

```typescript
// store/slices/userSlice.ts
import { createSlice, createAsyncThunk, PayloadAction } from "@reduxjs/toolkit";

interface UserState {
  currentUser: User | null;
  loading: boolean;
  error: string | null;
}

const initialState: UserState = {
  currentUser: null,
  loading: false,
  error: null,
};

export const fetchUser = createAsyncThunk(
  "user/fetchUser",
  async (userId: string) => {
    const response = await UserService.getUser(userId);
    return response.data;
  }
);

const userSlice = createSlice({
  name: "user",
  initialState,
  reducers: {
    setUser: (state, action: PayloadAction<User>) => {
      state.currentUser = action.payload;
    },
    clearUser: (state) => {
      state.currentUser = null;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchUser.pending, (state) => {
        state.loading = true;
      })
      .addCase(fetchUser.fulfilled, (state, action) => {
        state.loading = false;
        state.currentUser = action.payload;
      })
      .addCase(fetchUser.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message || "Failed to fetch user";
      });
  },
});

export const { setUser, clearUser } = userSlice.actions;
export default userSlice.reducer;
```

### Context Pattern (Limited Use)

```typescript
// Only for simple app-wide preferences
interface ContextType {
  theme: "light" | "dark";
  setTheme: (theme: "light" | "dark") => void;
}

const ThemeContext = createContext<ContextType | null>(null);

export const useThemeContext = () => {
  const context = useContext(ThemeContext);
  if (!context) {
    throw new Error("useThemeContext must be used within ThemeProvider");
  }
  return context;
};
```

````

## Component Composition for React Native

### Compound Components

- Use for complex mobile components with multiple parts
- Attach sub-components to main component
- Share state via context
- Consider platform-specific sub-components

### Children Patterns

```typescript
// Render prop pattern for React Native
import { View } from 'react-native';

interface RenderPropProps {
  children: (data: DataType) => React.ReactNode;
}

// Slot pattern for mobile layouts
interface MobileLayoutProps {
  header?: React.ReactNode;
  content: React.ReactNode;
  footer?: React.ReactNode;
  style?: ViewStyle;
}

const MobileLayout: React.FC<MobileLayoutProps> = ({ header, content, footer, style }) => (
  <View style={[styles.container, style]}>
    {header && <View style={styles.header}>{header}</View>}
    <View style={styles.content}>{content}</View>
    {footer && <View style={styles.footer}>{footer}</View>}
  </View>
);
````

## Touch and Event Handling

### Event Handler Naming for React Native

- Use handle[Event] for component methods: handlePress, handleSubmit, handleScroll
- Use on[Event] for prop callbacks: onPress, onSubmit, onScroll
- Use specific mobile event names: handlePressIn, handlePressOut, handleLongPress

### Touch Handler Patterns

```typescript
import { TouchableOpacity, GestureResponderEvent } from "react-native";

// With useCallback for performance
const handlePress = useCallback(
  (event: GestureResponderEvent) => {
    // Mobile-specific logic
    console.log(
      "Touch coordinates:",
      event.nativeEvent.locationX,
      event.nativeEvent.locationY
    );
  },
  [dependencies]
);

const handleLongPress = useCallback(() => {
  // Long press logic for mobile
}, []);

// TouchableOpacity for mobile interactions
<TouchableOpacity
  onPress={handlePress}
  onLongPress={handleLongPress}
  onPressIn={() => console.log("Press started")}
  onPressOut={() => console.log("Press ended")}
  activeOpacity={0.7}
  style={styles.touchable}
>
  <Text>Press me</Text>
</TouchableOpacity>;
```

## Conditional Rendering in React Native

### Preferred Patterns

```typescript
import { View, Text, ActivityIndicator } from "react-native";

// Use && for simple conditionals
{
  isLoading && <ActivityIndicator size="large" color="#0000ff" />;
}

// Use ternary for if/else with proper React Native components
{
  isError ? (
    <View style={styles.errorContainer}>
      <Text style={styles.errorText}>Error occurred</Text>
    </View>
  ) : (
    <View style={styles.successContainer}>
      <Text style={styles.successText}>Success!</Text>
    </View>
  );
}

// Use early returns for complex conditionals
if (isLoading) {
  return (
    <View style={styles.centerContainer}>
      <ActivityIndicator size="large" />
    </View>
  );
}

if (isError) {
  return (
    <View style={styles.errorContainer}>
      <Text style={styles.errorText}>Something went wrong</Text>
    </View>
  );
}

return <MainContent />;
```

## Form Handling in React Native

### Use React Hook Form with React Native

- Always use React Hook Form for forms
- Use Controller for React Native input components
- Handle keyboard management for mobile
- Define validation schema with Zod or Yup

```typescript
import { useForm, Controller } from "react-hook-form";
import {
  View,
  TextInput,
  TouchableOpacity,
  Text,
  KeyboardAvoidingView,
  Platform,
} from "react-native";

interface FormData {
  email: string;
  password: string;
}

const LoginForm: React.FC = () => {
  const {
    control,
    handleSubmit,
    formState: { errors },
  } = useForm<FormData>();

  const onSubmit = (data: FormData) => {
    console.log(data);
  };

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === "ios" ? "padding" : "height"}
      style={styles.container}
    >
      <Controller
        control={control}
        name="email"
        rules={{
          required: "Email is required",
          pattern: {
            value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
            message: "Invalid email address",
          },
        }}
        render={({ field: { onChange, onBlur, value } }) => (
          <TextInput
            style={[styles.input, errors.email && styles.inputError]}
            onBlur={onBlur}
            onChangeText={onChange}
            value={value}
            placeholder="Email"
            autoCapitalize="none"
            keyboardType="email-address"
          />
        )}
      />
      {errors.email && (
        <Text style={styles.errorText}>{errors.email.message}</Text>
      )}

      <TouchableOpacity onPress={handleSubmit(onSubmit)} style={styles.button}>
        <Text style={styles.buttonText}>Submit</Text>
      </TouchableOpacity>
    </KeyboardAvoidingView>
  );
};
```

## Error Boundaries for React Native

### Required for Production Mobile Apps

```typescript
import React, { Component, PropsWithChildren, ErrorInfo } from "react";
import { View, Text, TouchableOpacity, StyleSheet } from "react-native";

interface State {
  hasError: boolean;
  error?: Error;
}

class ErrorBoundary extends Component<PropsWithChildren, State> {
  state: State = { hasError: false };

  static getDerivedStateFromError(error: Error): State {
    return { hasError: true, error };
  }

  componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    console.error("Error caught by boundary:", error, errorInfo);
    // Log to crash analytics (Crashlytics, Sentry, etc.)
  }

  handleReset = () => {
    this.setState({ hasError: false, error: undefined });
  };

  render() {
    if (this.state.hasError) {
      return (
        <View style={styles.errorContainer}>
          <Text style={styles.errorTitle}>Something went wrong</Text>
          <Text style={styles.errorMessage}>
            {this.state.error?.message || "An unexpected error occurred"}
          </Text>
          <TouchableOpacity
            onPress={this.handleReset}
            style={styles.retryButton}
          >
            <Text style={styles.retryButtonText}>Try Again</Text>
          </TouchableOpacity>
        </View>
      );
    }
    return this.props.children;
  }
}

const styles = StyleSheet.create({
  errorContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    padding: 20,
  },
  errorTitle: {
    fontSize: 18,
    fontWeight: "bold",
    marginBottom: 10,
  },
  errorMessage: {
    fontSize: 14,
    textAlign: "center",
    marginBottom: 20,
  },
  retryButton: {
    backgroundColor: "#007AFF",
    padding: 12,
    borderRadius: 8,
  },
  retryButtonText: {
    color: "white",
    fontWeight: "bold",
  },
});
```

## Custom Hooks with React Native and Redux

### Best Practices for Custom Hooks

```tsx
// ✅ CORRECT - React Native custom hook with Redux Toolkit
import { useEffect } from "react";
import { Alert } from "react-native";
import { useSelector, useDispatch } from "react-redux";
import { authActions } from "@/store/slices/authSlice";
import { AuthService } from "@/services/authService";
import type { RootState } from "@/store/store";

interface LoginCredentials {
  email: string;
  password: string;
}

const useAuth = () => {
  const dispatch = useDispatch();
  const { user, loading, error } = useSelector(
    (state: RootState) => state.auth
  );

  useEffect(() => {
    const initAuth = async () => {
      try {
        dispatch(authActions.setLoading(true));
        const currentUser = await AuthService.getCurrentUser();
        dispatch(authActions.setUser(currentUser));
      } catch (error) {
        dispatch(authActions.setError(error.message));
        Alert.alert("Authentication Error", error.message);
      } finally {
        dispatch(authActions.setLoading(false));
      }
    };

    initAuth();
  }, [dispatch]);

  const login = async (credentials: LoginCredentials) => {
    dispatch(authActions.login(credentials));
  };

  const logout = () => {
    dispatch(authActions.logout());
  };

  return { user, loading, error, login, logout };
};

// Usage in component
import { View, Text, TouchableOpacity, StyleSheet } from "react-native";

const AuthScreen: React.FC = () => {
  const { user, loading, login, logout } = useAuth();

  if (loading) {
    return (
      <View style={styles.container}>
        <Text style={styles.loadingText}>Loading...</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <Text style={styles.userText}>{user?.name || "Not logged in"}</Text>
      <TouchableOpacity
        onPress={
          user
            ? logout
            : () => login({ email: "test@test.com", password: "pass" })
        }
        style={styles.button}
      >
        <Text style={styles.buttonText}>{user ? "Logout" : "Login"}</Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    padding: 16,
  },
  loadingText: {
    fontSize: 16,
    color: "#666",
  },
  userText: {
    fontSize: 18,
    marginBottom: 16,
  },
  button: {
    backgroundColor: "#007AFF",
    padding: 12,
    borderRadius: 8,
  },
  buttonText: {
    color: "white",
    fontSize: 16,
    fontWeight: "bold",
  },
});
```

## React Native Key Rules Summary

1. **Functional components only** with proper TypeScript interfaces
2. **Named exports** preferred over default exports
3. **StyleSheet.create()** for all styling, never inline styles
4. **TouchableOpacity/Pressable** for all touchable elements
5. **Redux Toolkit** for global state management
6. **useCallback** for event handlers (especially onPress)
7. **React Hook Form** with Controller for all forms
8. **Error boundaries** around feature sections with mobile-friendly UI
9. **Platform-specific code** when needed
10. **KeyboardAvoidingView** for forms and inputs
11. **FlatList** for large lists, never ScrollView
12. **React Query** for all server state management
13. **Proper imports** from react-native for all UI components
14. **Safe area handling** for modern mobile devices
15. **Navigation hooks** (useNavigation, useRoute) for screen navigation
