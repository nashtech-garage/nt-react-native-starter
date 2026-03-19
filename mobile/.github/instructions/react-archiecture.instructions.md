---
applyTo: "**/*.ts,**/*.tsx,**/*.js,**/*.jsx"
---

# React Native Architecture & Structure

## Directory Structure

### Required React Native Folder Layout (Feature-First Architecture)

```
src/
  features/            # Feature-based modules (PRIMARY ORGANIZATION)
    auth/              # Authentication feature
      screens/          # Auth screen components
        LoginScreen.tsx
        RegisterScreen.tsx
        ForgotPasswordScreen.tsx
      components/        # Auth-specific components
        LoginForm/
        RegisterForm/
        AuthGuard/
        PasswordReset/
      hooks/             # Auth-specific hooks
        useAuth.ts
        useLogin.ts
        useRegister.ts
      services/          # Auth API calls
        authService.ts
        tokenService.ts
      store/             # Auth Redux slices
        authSlice.ts
        authSelectors.ts
      types/             # Auth-specific types
        auth.types.ts
        user.types.ts
      utils/             # Auth utilities
        validatePassword.ts
        formatAuthError.ts
      navigation/        # Auth-specific navigation
        AuthNavigator.tsx
        authRoutes.ts
      index.ts           # Feature barrel export

    [other-features]/    # Other features follow same structure
      screens/           # Feature-specific screens
      components/        # Feature-specific components
      hooks/             # Feature-specific hooks
      services/          # Feature API calls
      store/             # Feature Redux slices
      types/             # Feature types
      utils/             # Feature utilities
      navigation/        # Feature navigation
      index.ts           # Feature barrel export

  components/          # ONLY shared/reusable React Native components
    ui/                # Generic UI components
      Button/
      Input/
      Modal/
      Card/
      Spinner/
      TouchableOpacity/
    layout/            # Layout components
      SafeAreaView/
      KeyboardAvoidingView/
      Container/
      Screen/
    navigation/        # Navigation components
      TabBar/
      Header/
      DrawerContent/
    forms/             # Shared form components
      FormField/
      ValidationMessage/
      TextInput/

  screens/             # OPTIONAL: Re-exports for navigation setup
    index.ts           # Re-exports from features for navigation

  navigation/          # React Navigation setup
    RootNavigator.tsx
    TabNavigator.tsx
    StackNavigator.tsx
    types.ts           # Navigation type definitions

  hooks/               # ONLY shared hooks
    useLocalStorage.ts
    useDebounce.ts
    useApi.ts

  services/            # ONLY shared services
    api/               # Base API configuration
      client.ts
      interceptors.ts
    analytics/         # Shared analytics (Firebase, etc.)
    storage/           # AsyncStorage utilities
    notifications/     # Push notification services
    permissions/       # Device permission handling

  store/               # Redux Toolkit global state
    rootReducer.ts
    store.ts
    middleware/

  utils/               # Shared utility functions
    format/            # Formatting utilities
      date.ts
      currency.ts
    validation/        # Shared validation
      email.ts
      phone.ts
    platform/          # Platform-specific utilities
      dimensions.ts
      statusBar.ts
    testing/           # Test utilities

  types/               # ONLY shared TypeScript types
    api/               # Shared API types
      response.types.ts
      error.types.ts
    navigation/        # Navigation types
      routes.types.ts
    platform/          # Platform-specific types
      device.types.ts
  assets/              # Static assets
    images/            # Images organized by feature or screen
      auth/
      profile/
      onboarding/
    icons/             # Icon assets (SVG, PNG)
    fonts/             # Custom fonts
    sounds/            # Audio assets for mobile
    animations/        # Lottie or other animation files
```

### File Naming Conventions

#### Screens

- PascalCase with 'Screen' suffix: `UserProfileScreen.tsx`
- kebab-case for directories: `user-profile/`
- index.tsx for barrel exports

#### Components

- PascalCase for component files: `UserCard.tsx`
- kebab-case for directories: `user-card/`
- index.tsx for barrel exports

#### Navigation

- PascalCase with 'Navigator' suffix: `AuthNavigator.tsx`
- Route names in SCREAMING_SNAKE_CASE: `USER_PROFILE`

#### Hooks

- camelCase starting with 'use': `useAuthCheck.ts`
- Group related hooks in subdirectories

#### Utils and Services

- camelCase for files: `formatDate.ts`
- camelCase for functions: `formatCurrency()`

#### Types

- PascalCase for interfaces: `UserProfile.ts`
- Suffix with purpose: `UserProfileProps`, `UserProfileState`

## React Native Component Organization

### Atomic Design Principles for Mobile

```
components/
  atoms/               # Basic mobile building blocks
    Button/
    Input/
    Icon/
    TouchableArea/
    SafeText/

  molecules/           # Simple mobile combinations
    SearchBox/
    FormField/
    Card/
    ListItem/
    TabBarItem/

  organisms/           # Complex mobile combinations
    Navigation/
    UserList/
    ProductGrid/
    Header/
    TabBar/

  templates/           # Screen layouts
    AuthLayout/
    MainLayout/
    OnboardingLayout/
    FormLayout/
```

### React Native Component File Structure

```typescript
// components/Button/index.tsx
export { Button } from './Button';
export type { ButtonProps } from './Button';

// components/Button/Button.tsx
import React from 'react';
import { TouchableOpacity, Text, StyleSheet } from 'react-native';
import { ButtonProps } from './types';

export const Button: React.FC<ButtonProps> = ({ title, onPress, style, ...props }) => {
  return (
    <TouchableOpacity onPress={onPress} style={[styles.button, style]} {...props}>
      <Text style={styles.text}>{title}</Text>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  button: {
    backgroundColor: '#007AFF',
    padding: 12,
    borderRadius: 8,
    alignItems: 'center',
  },
  text: {
    color: 'white',
    fontSize: 16,
    fontWeight: 'bold',
  },
});

// components/Button/types.ts
export interface ButtonProps {
  variant: 'primary' | 'secondary';
  size: 'sm' | 'md' | 'lg';
  children: React.ReactNode;
}

// components/Button/Button.module.css
.button {
  /* styles */
}
```

## Feature-Based Architecture

### Complete Feature Module Structure (Auth Example)

```
features/auth/
  pages/              # Auth route components
    LoginPage.tsx     # Route: /login
    RegisterPage.tsx  # Route: /register
    ForgotPasswordPage.tsx # Route: /forgot-password

  components/         # Auth-specific components
    LoginForm/        # Used by LoginPage
      index.ts
      LoginForm.tsx
      LoginForm.module.css
      LoginForm.test.tsx
    RegisterForm/     # Used by RegisterPage
      index.ts
      RegisterForm.tsx
      RegisterForm.module.css
    AuthGuard/        # Protects authenticated routes
      index.ts
      AuthGuard.tsx

  hooks/              # Auth-specific hooks
    useAuth.ts        # Main auth hook
    useLogin.ts       # Login logic
    useRegister.ts    # Registration logic
    useAuthGuard.ts   # Route protection

  services/           # Auth API calls
    authService.ts    # Login, register, logout APIs
    tokenService.ts   # Token management

  store/              # Auth state management
    authSlice.ts      # Redux slice for auth
    authSelectors.ts  # Reusable selectors

  types/              # Auth-specific types
    auth.types.ts     # Auth-related types
    user.types.ts     # User data types

  utils/              # Auth utilities
    validatePassword.ts
    formatAuthError.ts

  index.ts            # Feature barrel export

# All other features follow the same structure:
# features/products/, features/orders/, features/dashboard/, etc.
```

### Feature Barrel Exports (Auth Example)

```typescript
// features/auth/index.ts
// Pages
export { LoginPage } from "./pages/LoginPage";
export { RegisterPage } from "./pages/RegisterPage";
export { ForgotPasswordPage } from "./pages/ForgotPasswordPage";

// Components
export { LoginForm } from "./components/LoginForm";
export { RegisterForm } from "./components/RegisterForm";
export { AuthGuard } from "./components/AuthGuard";

// Hooks
export { useAuth } from "./hooks/useAuth";
export { useLogin } from "./hooks/useLogin";
export { useRegister } from "./hooks/useRegister";

// Services
export { authService } from "./services/authService";

// Types
export type {
  AuthUser,
  LoginCredentials,
  RegisterData,
  AuthState,
} from "./types";

// Other features follow the same export pattern
// features/products/index.ts, features/orders/index.ts, etc.
```

### Cross-Feature Dependencies

```typescript
// ✅ GOOD: Feature importing shared components
import { Button } from "@/components/common/Button";
import { Modal } from "@/components/common/Modal";

// ✅ GOOD: Feature importing shared hooks
import { useApi } from "@/hooks/useApi";
import { useLocalStorage } from "@/hooks/useLocalStorage";

// ✅ GOOD: Feature importing shared services
import { apiClient } from "@/services/api/client";

// ❌ AVOID: Direct feature-to-feature imports
import { useOtherFeature } from "../other-feature/hooks/useOtherFeature"; // ❌

// ✅ BETTER: Use shared state or context
import { useAppSelector } from "@/hooks/useAppSelector";
```

## Import Organization

### Import Order (ESLint rule)

```typescript
// 1. React and React-related
import React, { useState, useEffect } from "react";
import { BrowserRouter as Router } from "react-router-dom";

// 2. External libraries
import axios from "axios";
import { format } from "date-fns";

// 3. Internal utilities and services
import { api } from "@/services";
import { formatCurrency } from "@/utils";

// 4. Internal components and features
import { Button } from "@/components/common";
import { useAuth } from "@/features/auth";

// 5. Relative imports
import { validateForm } from "./utils";
import styles from "./Component.module.css";
```

### Path Aliases (tsconfig.json)

```json
{
  "compilerOptions": {
    "baseUrl": "src",
    "paths": {
      "@/*": ["*"],
      "@/components/*": ["components/*"],
      "@/features/*": ["features/*"],
      "@/hooks/*": ["hooks/*"],
      "@/services/*": ["services/*"],
      "@/utils/*": ["utils/*"],
      "@/types/*": ["types/*"]
    }
  }
}
```

## Routing Architecture (Feature-First)

### Route Organization

```typescript
// routes/index.ts - Central route configuration
export const routes = {
  home: "/",
  auth: {
    login: "/login",
    register: "/register",
    forgotPassword: "/forgot-password",
  },
  // Other features follow similar pattern:
  // products: { list: '/products', detail: '/products/:id', ... },
  // orders: { list: '/orders', detail: '/orders/:id', ... },
  dashboard: {
    overview: "/dashboard",
    analytics: "/dashboard/analytics",
    reports: "/dashboard/reports",
  },
} as const;

// Router setup importing from features
import { LoginPage, RegisterPage, ForgotPasswordPage } from "@/features/auth";
// Import other features as needed:
// import { ProductListPage, ProductDetailPage } from '@/features/products';
// import { DashboardPage } from '@/features/dashboard';

export const routeConfig = [
  // Auth routes
  { path: routes.auth.login, element: <LoginPage /> },
  { path: routes.auth.register, element: <RegisterPage /> },
  { path: routes.auth.forgotPassword, element: <ForgotPasswordPage /> },

  // Other feature routes follow the same pattern
  // { path: routes.products.list, element: <ProductListPage /> },
  // { path: routes.dashboard.overview, element: <ProtectedRoute><DashboardPage /></ProtectedRoute> },
];
```

### Protected Routes Pattern

```typescript
// features/auth/components/AuthGuard/AuthGuard.tsx
interface AuthGuardProps {
  children: React.ReactNode;
  fallback?: React.ReactNode;
  requireAuth?: boolean;
}

export const AuthGuard: React.FC<AuthGuardProps> = ({
  children,
  fallback = null,
  requireAuth = true,
}) => {
  const { isAuthenticated, isLoading } = useAuth();
  const location = useLocation();

  if (isLoading) {
    return <LoadingSpinner />;
  }

  if (requireAuth && !isAuthenticated) {
    return (
      <Navigate to={routes.auth.login} state={{ from: location }} replace />
    );
  }

  if (!requireAuth && isAuthenticated) {
    return <Navigate to={routes.dashboard.overview} replace />;
  }

  return <>{children}</>;
};

// Usage in features
export const ProtectedRoute: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => <AuthGuard requireAuth={true}>{children}</AuthGuard>;

export const PublicRoute: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => <AuthGuard requireAuth={false}>{children}</AuthGuard>;
```

## State Architecture

### State Layers

1. **Component State**: useState, useReducer
2. **Shared State**: Context API, Zustand
3. **Server State**: React Query, SWR
4. **Global App State**: Redux Toolkit

### When to Use Each

```typescript
// Component state - local UI state
const [isOpen, setIsOpen] = useState(false);

// Shared state - theme, user session
const { theme, setTheme } = useTheme();

// Server state - API data
const { data: users, isLoading } = useQuery("users", fetchUsers);

// Global state - complex app state
const dispatch = useAppDispatch();
const { currentUser } = useAppSelector((state) => state.auth);
```

## Asset Organization

### Asset Structure

```
assets/
  images/              # JPG, PNG, WebP images
    logos/
    banners/
    avatars/

  icons/               # SVG icons only
    ui/                # UI icons (arrows, close, etc)
    social/            # Social media icons

  fonts/               # Custom fonts
  styles/              # Global CSS files
    globals.css
    variables.css
```

### Asset Import Patterns

```typescript
// Static imports for bundled assets
import logoImage from "@/assets/images/logo.png";
import { ReactComponent as CloseIcon } from "@/assets/icons/close.svg";

// Dynamic imports for conditional assets
const loadIcon = async (name: string) => {
  const icon = await import(`@/assets/icons/${name}.svg`);
  return icon.ReactComponent;
};
```

## Key Architecture Rules (Feature-First)

1. **Feature-first organization** - organize by business domain, not technical layer
2. **Feature isolation** - each feature should be self-contained and independent
3. **Shared components only** - `/components` contains ONLY reusable components
4. **Barrel exports** - each feature exports through index.ts for clean imports
5. **Feature pages** - route components live in `features/[feature]/pages/`
6. **No cross-feature imports** - features communicate through shared state/context
7. **Consistent feature structure** - pages, components, hooks, services, store, types
8. **Path aliases** - use `@/features/[feature]` for feature imports
9. **Route organization** - central route config importing from features
10. **Feature-specific testing** - tests co-located with feature code

### Feature Organization Rules

#### ✅ DO:

- Put feature-specific logic in `features/[feature]/`
- Export everything through feature barrel (`features/[feature]/index.ts`)
- Use shared components from `/components/common/`
- Place route components in `features/[feature]/pages/`
- Keep feature state in `features/[feature]/store/`

#### ❌ DON'T:

- Import directly between features (`../other-feature/`)
- Put feature-specific components in shared `/components/`
- Mix feature logic in shared folders
- Create deep nested folder structures within features
- Violate feature boundaries

### Migration Guide from Page-First to Feature-First

```bash
# Old structure (Page-First)
src/pages/auth/login/index.tsx
src/pages/auth/register/index.tsx
src/components/auth/LoginForm.tsx
src/components/auth/RegisterForm.tsx
src/hooks/auth/useAuth.ts
src/services/authService.ts

# New structure (Feature-First)
src/features/auth/pages/LoginPage.tsx
src/features/auth/pages/RegisterPage.tsx
src/features/auth/components/LoginForm/LoginForm.tsx
src/features/auth/components/RegisterForm/RegisterForm.tsx
src/features/auth/hooks/useAuth.ts
src/features/auth/services/authService.ts
src/features/auth/index.ts  # Barrel export

# All other features follow the same migration pattern
```
