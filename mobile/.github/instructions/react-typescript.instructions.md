---
applyTo: "**/*.ts,**/*.tsx,**/*.js,**/*.jsx"
---

# React Native TypeScript & Code Quality

## TypeScript Standards for Mobile

### Strict Configuration for React Native

```json
// tsconfig.json - Required settings for React Native
{
  "extends": "@react-native/typescript-config/tsconfig.json",
  "compilerOptions": {
    "strict": true,
    "noImplicitAny": true,
    "noImplicitReturns": true,
    "noUnusedLocals": true,
    "noUnusedParameters": true,
    "exactOptionalPropertyTypes": true,
    "skipLibCheck": true,
    "allowSyntheticDefaultImports": true,
    "resolveJsonModule": true
  }
}
```

### React Native Component Props Typing

```typescript
import React from "react";
import {
  TouchableOpacity,
  Text,
  StyleSheet,
  ViewStyle,
  TextStyle,
} from "react-native";

// Always define explicit interfaces with React Native style types
interface ButtonProps {
  variant: "primary" | "secondary" | "danger";
  size?: "sm" | "md" | "lg";
  disabled?: boolean;
  loading?: boolean;
  children: React.ReactNode;
  onPress?: () => void;
  style?: ViewStyle;
  textStyle?: TextStyle;
  testID?: string; // Important for mobile testing
}

// Use React.FC with proper React Native props
export const Button: React.FC<ButtonProps> = ({
  variant,
  size = "md",
  disabled = false,
  loading = false,
  children,
  onPress,
  style,
  textStyle,
  testID,
  ...props
}) => {
  return (
    <TouchableOpacity
      onPress={onPress}
      disabled={disabled || loading}
      style={[styles.button, styles[variant], styles[size], style]}
      testID={testID}
      {...props}
    >
      <Text style={[styles.text, textStyle]}>{children}</Text>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  button: {
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderRadius: 8,
    alignItems: "center",
  },
  primary: {
    backgroundColor: "#007AFF",
  },
  secondary: {
    backgroundColor: "#f0f0f0",
  },
  danger: {
    backgroundColor: "#FF3B30",
  },
  sm: {
    paddingHorizontal: 12,
    paddingVertical: 8,
  },
  md: {
    paddingHorizontal: 16,
    paddingVertical: 12,
  },
  lg: {
    paddingHorizontal: 20,
    paddingVertical: 16,
  },
  text: {
    fontSize: 16,
    fontWeight: "bold",
    color: "white",
  },
});
```

### Event Handler Typing

```typescript
// Form events
const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
  e.preventDefault();
};

// Input change events
const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
  setValue(e.target.value);
};

// Generic click events
const handleClick = (e: React.MouseEvent<HTMLButtonElement>) => {
  // Handle click
};

// Custom event handlers
type CustomHandler = (id: string, data: SomeType) => void;
```

### Hook Typing

```typescript
// useState with explicit type
const [user, setUser] = useState<User | null>(null);
const [items, setItems] = useState<Item[]>([]);

// useRef typing
const inputRef = useRef<HTMLInputElement>(null);
const timerRef = useRef<NodeJS.Timeout | null>(null);

// Custom hook typing
interface UseApiReturn<T> {
  data: T | null;
  loading: boolean;
  error: string | null;
  refetch: () => void;
}

const useApi = <T>(url: string): UseApiReturn<T> => {
  // Implementation
};
```

### API and Service Typing

```typescript
// API response types
interface ApiResponse<T> {
  data: T;
  message: string;
  success: boolean;
}

interface PaginatedResponse<T> extends ApiResponse<T[]> {
  pagination: {
    page: number;
    limit: number;
    total: number;
  };
}

// Service function typing
const fetchUsers = async (): Promise<ApiResponse<User[]>> => {
  const response = await api.get("/users");
  return response.data;
};
```

## Code Quality Standards

### ESLint Configuration

```json
// .eslintrc.json - Required rules
{
  "extends": ["@typescript-eslint/recommended", "react-hooks/recommended"],
  "rules": {
    "@typescript-eslint/no-unused-vars": "error",
    "@typescript-eslint/explicit-function-return-type": "warn",
    "@typescript-eslint/no-explicit-any": "error",
    "react-hooks/exhaustive-deps": "error",
    "react/prop-types": "off"
  }
}
```

### Prettier Configuration

```json
// .prettierrc
{
  "semi": true,
  "trailingComma": "es5",
  "singleQuote": true,
  "printWidth": 80,
  "tabWidth": 2,
  "useTabs": false
}
```

### Import/Export Standards

```typescript
// Named exports preferred
export const ComponentName = () => {};
export const utilityFunction = () => {};

// Type-only imports when possible
import type { User, ApiResponse } from "./types";
import { fetchUser } from "./api";

// Barrel exports for features
// features/auth/index.ts
export { LoginForm } from "./components/LoginForm";
export { useAuth } from "./hooks/useAuth";
export type { AuthUser, LoginCredentials } from "./types";
```

## Error Handling

### Error Types

```typescript
// Define error types
interface AppError {
  message: string;
  code: string;
  details?: Record<string, any>;
}

interface ValidationError extends AppError {
  field: string;
  value: any;
}

// Error boundary props
interface ErrorBoundaryState {
  hasError: boolean;
  error?: Error;
}
```

### Try-Catch Patterns

```typescript
// Async function error handling
const handleApiCall = async (): Promise<User | null> => {
  try {
    const response = await fetchUser(id);
    return response.data;
  } catch (error) {
    if (error instanceof Error) {
      console.error("API Error:", error.message);
    }
    return null;
  }
};

// Custom error hook
const useErrorHandler = () => {
  const showError = useCallback((error: Error | string) => {
    const message = error instanceof Error ? error.message : error;
    toast.error(message);
  }, []);

  return { showError };
};
```

## Environment & Configuration

### Environment Variables

```typescript
// env.ts - Type-safe environment variables
interface Environment {
  API_URL: string;
  APP_ENV: "development" | "staging" | "production";
  API_TIMEOUT: number;
}

const env: Environment = {
  API_URL: process.env.REACT_APP_API_URL || "",
  APP_ENV:
    (process.env.REACT_APP_ENV as Environment["APP_ENV"]) || "development",
  API_TIMEOUT: Number(process.env.REACT_APP_API_TIMEOUT) || 5000,
};

// Validate required environment variables
const validateEnv = (): void => {
  if (!env.API_URL) {
    throw new Error("REACT_APP_API_URL is required");
  }
};

export { env, validateEnv };
```

### Constants and Configuration

```typescript
// constants.ts - Type-safe constants
export const APP_CONFIG = {
  pagination: {
    defaultPageSize: 10,
    maxPageSize: 100,
  },
  validation: {
    passwordMinLength: 8,
    usernameMinLength: 3,
  },
  timeouts: {
    apiRequest: 5000,
    debounce: 300,
  },
} as const;

// Use const assertions for literal types
export const INSURANCE_TYPES = ["auto", "home", "life", "health"] as const;
export type InsuranceType = (typeof INSURANCE_TYPES)[number];
```

## Documentation Standards

### JSDoc Comments

```typescript
/**
 * Calculates insurance premium based on user data and coverage type
 * @param userData - User's personal and risk information
 * @param coverageType - Type of insurance coverage
 * @param options - Additional calculation options
 * @returns Promise resolving to calculated premium amount
 * @throws {ValidationError} When user data is invalid
 */
const calculatePremium = async (
  userData: UserData,
  coverageType: CoverageType,
  options?: CalculationOptions
): Promise<number> => {
  // Implementation
};
```

### Type Documentation

```typescript
/**
 * Represents a user's insurance policy
 */
interface InsurancePolicy {
  /** Unique policy identifier */
  id: string;
  /** Policy holder information */
  holder: PolicyHolder;
  /** Coverage details and limits */
  coverage: Coverage;
  /** Current policy status */
  status: "active" | "pending" | "cancelled" | "expired";
  /** Policy effective date */
  effectiveDate: Date;
  /** Policy expiration date */
  expirationDate: Date;
}
```

## Performance Types

### Memoization Typing

```typescript
// useMemo with proper typing
const expensiveCalculation = useMemo((): CalculationResult => {
  return performExpensiveCalculation(data);
}, [data]);

// useCallback with proper typing
const handleSubmit = useCallback(
  (formData: FormData): void => {
    onSubmit(formData);
  },
  [onSubmit]
);

// React.memo with props comparison
interface MemoComponentProps {
  id: string;
  data: ComplexData;
}

const MemoComponent = React.memo<MemoComponentProps>(
  ({ id, data }) => {
    return <div>{/* Component */}</div>;
  },
  (prevProps, nextProps) => {
    return (
      prevProps.id === nextProps.id && isEqual(prevProps.data, nextProps.data)
    );
  }
);
```

## Utility Types

### Common Utility Types

```typescript
// Pick specific properties
type UserSummary = Pick<User, "id" | "name" | "email">;

// Omit specific properties
type CreateUserRequest = Omit<User, "id" | "createdAt" | "updatedAt">;

// Partial for optional updates
type UpdateUserRequest = Partial<CreateUserRequest>;

// Record for key-value mappings
type ErrorMessages = Record<string, string>;

// Custom utility types
type Optional<T, K extends keyof T> = Omit<T, K> & Partial<Pick<T, K>>;
type RequiredBy<T, K extends keyof T> = T & Required<Pick<T, K>>;
```

## Key TypeScript Rules

1. **Strict mode enabled** - no implicit any, unused variables
2. **Explicit prop interfaces** - always define component props
3. **Proper event typing** - use React event types
4. **Generic hooks** - type custom hooks properly
5. **API response typing** - type all API calls and responses
6. **Error type definitions** - create structured error types
7. **Environment validation** - type-safe env variables
8. **JSDoc documentation** - document complex functions
9. **Utility types usage** - leverage TypeScript utility types
10. **Performance typing** - properly type memoized components
