---
applyTo: "**/*.ts,**/*.tsx,**/*.js,**/*.jsx"
---

# React Testing & Security

## Testing Strategy

### Testing Pyramid

```
E2E Tests (10%)     - Critical user flows
Integration (20%)   - Feature interactions
Unit Tests (70%)    - Components, hooks, utils
```

### Testing Tools Setup

```json
// package.json - Required testing dependencies
{
  "devDependencies": {
    "@testing-library/react": "^13.4.0",
    "@testing-library/jest-dom": "^5.16.5",
    "@testing-library/user-event": "^14.4.3",
    "msw": "^0.47.4",
    "cypress": "^12.0.0"
  }
}
```

## Component Testing

### Testing Library Best Practices

```typescript
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { Button } from './Button';

describe('Button Component', () => {
  it('renders with correct text', () => {
    render(<Button>Click me</Button>);
    expect(screen.getByRole('button', { name: /click me/i })).toBeInTheDocument();
  });

  it('handles click events', async () => {
    const user = userEvent.setup();
    const handleClick = jest.fn();

    render(<Button onClick={handleClick}>Click me</Button>);

    await user.click(screen.getByRole('button'));
    expect(handleClick).toHaveBeenCalledTimes(1);
  });

  it('shows loading state', () => {
    render(<Button loading>Submit</Button>);
    expect(screen.getByRole('button')).toBeDisabled();
    expect(screen.getByTestId('spinner')).toBeInTheDocument();
  });
});
```

### Form Testing

```typescript
describe('LoginForm', () => {
  it('validates required fields', async () => {
    const user = userEvent.setup();
    render(<LoginForm onSubmit={jest.fn()} />);

    await user.click(screen.getByRole('button', { name: /login/i }));

    expect(screen.getByText(/email is required/i)).toBeInTheDocument();
    expect(screen.getByText(/password is required/i)).toBeInTheDocument();
  });

  it('submits form with valid data', async () => {
    const user = userEvent.setup();
    const mockSubmit = jest.fn();
    render(<LoginForm onSubmit={mockSubmit} />);

    await user.type(screen.getByLabelText(/email/i), 'test@example.com');
    await user.type(screen.getByLabelText(/password/i), 'password123');
    await user.click(screen.getByRole('button', { name: /login/i }));

    expect(mockSubmit).toHaveBeenCalledWith({
      email: 'test@example.com',
      password: 'password123'
    });
  });
});
```

## Hook Testing

### Custom Hook Testing

```typescript
import { renderHook, act } from "@testing-library/react";
import { useCounter } from "./useCounter";

describe("useCounter", () => {
  it("initializes with default value", () => {
    const { result } = renderHook(() => useCounter());
    expect(result.current.count).toBe(0);
  });

  it("increments count", () => {
    const { result } = renderHook(() => useCounter());

    act(() => {
      result.current.increment();
    });

    expect(result.current.count).toBe(1);
  });

  it("accepts initial value", () => {
    const { result } = renderHook(() => useCounter(10));
    expect(result.current.count).toBe(10);
  });
});
```

### Hook with API Testing

```typescript
import { renderHook, waitFor } from "@testing-library/react";
import { server } from "../mocks/server";
import { useUsers } from "./useUsers";

describe("useUsers", () => {
  it("fetches users successfully", async () => {
    const { result } = renderHook(() => useUsers());

    expect(result.current.loading).toBe(true);

    await waitFor(() => {
      expect(result.current.loading).toBe(false);
    });

    expect(result.current.users).toHaveLength(3);
    expect(result.current.error).toBeNull();
  });

  it("handles API errors", async () => {
    server.use(
      rest.get("/api/users", (req, res, ctx) => {
        return res(ctx.status(500), ctx.json({ message: "Server error" }));
      })
    );

    const { result } = renderHook(() => useUsers());

    await waitFor(() => {
      expect(result.current.loading).toBe(false);
    });

    expect(result.current.error).toBe("Failed to fetch users");
    expect(result.current.users).toEqual([]);
  });
});
```

## API Mocking

### MSW Setup

```typescript
// mocks/handlers.ts
import { rest } from "msw";

export const handlers = [
  rest.get("/api/users", (req, res, ctx) => {
    return res(
      ctx.json([
        { id: 1, name: "John Doe", email: "john@example.com" },
        { id: 2, name: "Jane Smith", email: "jane@example.com" },
      ])
    );
  }),

  rest.post("/api/auth/login", (req, res, ctx) => {
    const { email, password } = req.body as any;

    if (email === "test@example.com" && password === "password") {
      return res(
        ctx.json({
          token: "mock-jwt-token",
          user: { id: 1, email, name: "Test User" },
        })
      );
    }

    return res(ctx.status(401), ctx.json({ message: "Invalid credentials" }));
  }),
];

// mocks/server.ts
import { setupServer } from "msw/node";
import { handlers } from "./handlers";

export const server = setupServer(...handlers);
```

### Test Utilities

```typescript
// test-utils.tsx
import { ReactElement } from 'react';
import { render, RenderOptions } from '@testing-library/react';
import { BrowserRouter } from 'react-router-dom';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { AuthProvider } from '@/features/auth';

const AllTheProviders = ({ children }: { children: React.ReactNode }) => {
  const queryClient = new QueryClient({
    defaultOptions: {
      queries: { retry: false },
      mutations: { retry: false },
    },
  });

  return (
    <BrowserRouter>
      <QueryClientProvider client={queryClient}>
        <AuthProvider>
          {children}
        </AuthProvider>
      </QueryClientProvider>
    </BrowserRouter>
  );
};

const customRender = (
  ui: ReactElement,
  options?: Omit<RenderOptions, 'wrapper'>,
) => render(ui, { wrapper: AllTheProviders, ...options });

export * from '@testing-library/react';
export { customRender as render };
```

## Security Best Practices

### Input Validation & Sanitization

```typescript
// Input sanitization utility
import DOMPurify from "dompurify";

const sanitizeInput = (input: string): string => {
  return DOMPurify.sanitize(input, { ALLOWED_TAGS: [] });
};

// Form validation with security in mind
const validateUserInput = (data: FormData) => {
  const errors: Record<string, string> = {};

  // Sanitize inputs
  const email = sanitizeInput(data.email);
  const name = sanitizeInput(data.name);

  // Validate email format
  if (!isValidEmail(email)) {
    errors.email = "Invalid email format";
  }

  // Validate name length and characters
  if (name.length < 2 || name.length > 50) {
    errors.name = "Name must be between 2 and 50 characters";
  }

  if (!/^[a-zA-Z\s]+$/.test(name)) {
    errors.name = "Name can only contain letters and spaces";
  }

  return { isValid: Object.keys(errors).length === 0, errors };
};
```

### CSRF Protection

```typescript
// CSRF token management
const getCSRFToken = (): string => {
  const token = document
    .querySelector('meta[name="csrf-token"]')
    ?.getAttribute("content");
  if (!token) {
    throw new Error("CSRF token not found");
  }
  return token;
};

// API client with CSRF protection
import axios from "axios";

const apiClient = axios.create({
  baseURL: process.env.REACT_APP_API_URL,
  withCredentials: true,
});

apiClient.interceptors.request.use((config) => {
  const csrfToken = getCSRFToken();
  config.headers["X-CSRF-Token"] = csrfToken;
  return config;
});
```

### Secure Authentication

```typescript
// Secure token storage
const TOKEN_KEY = 'auth_token';

const tokenStorage = {
  set: (token: string) => {
    // Use httpOnly cookies in production
    if (process.env.NODE_ENV === 'production') {
      // Token should be set by server as httpOnly cookie
      console.warn('Tokens should be httpOnly cookies in production');
    } else {
      sessionStorage.setItem(TOKEN_KEY, token);
    }
  },

  get: (): string | null => {
    if (process.env.NODE_ENV === 'production') {
      // Read from httpOnly cookie via API call
      return null; // Token is in httpOnly cookie
    }
    return sessionStorage.getItem(TOKEN_KEY);
  },

  remove: () => {
    sessionStorage.removeItem(TOKEN_KEY);
    // Also clear httpOnly cookie via logout endpoint
  },
};

// Protected route with proper authentication
const ProtectedRoute = ({ children }: { children: React.ReactNode }) => {
  const { isAuthenticated, isLoading } = useAuth();

  if (isLoading) {
    return <LoadingSpinner />;
  }

  if (!isAuthenticated) {
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  return <>{children}</>;
};
```

### Content Security Policy

```typescript
// CSP configuration
const CSP_DIRECTIVES = {
  "default-src": ["'self'"],
  "script-src": ["'self'", "'unsafe-inline'", "https://trusted-cdn.com"],
  "style-src": ["'self'", "'unsafe-inline'", "https://fonts.googleapis.com"],
  "img-src": ["'self'", "data:", "https:"],
  "font-src": ["'self'", "https://fonts.gstatic.com"],
  "connect-src": ["'self'", process.env.REACT_APP_API_URL],
  "frame-ancestors": ["'none'"],
  "base-uri": ["'self'"],
  "form-action": ["'self'"],
};
```

## Accessibility Testing

### Automated A11y Testing

```typescript
import { axe, toHaveNoViolations } from 'jest-axe';

expect.extend(toHaveNoViolations);

describe('Accessibility', () => {
  it('should not have accessibility violations', async () => {
    const { container } = render(<LoginForm />);
    const results = await axe(container);
    expect(results).toHaveNoViolations();
  });
});
```

### Manual A11y Testing

```typescript
describe('Keyboard Navigation', () => {
  it('allows keyboard navigation through form', async () => {
    const user = userEvent.setup();
    render(<LoginForm />);

    // Tab through form elements
    await user.tab();
    expect(screen.getByLabelText(/email/i)).toHaveFocus();

    await user.tab();
    expect(screen.getByLabelText(/password/i)).toHaveFocus();

    await user.tab();
    expect(screen.getByRole('button', { name: /login/i })).toHaveFocus();
  });

  it('provides proper ARIA labels', () => {
    render(<LoginForm />);

    expect(screen.getByLabelText(/email/i)).toHaveAttribute('aria-describedby');
    expect(screen.getByRole('button')).toHaveAttribute('aria-label');
  });
});
```

## E2E Testing

### Cypress Best Practices

```typescript
// cypress/e2e/auth.cy.ts
describe("Authentication Flow", () => {
  beforeEach(() => {
    cy.visit("/login");
  });

  it("logs in successfully", () => {
    cy.findByLabelText(/email/i).type("test@example.com");
    cy.findByLabelText(/password/i).type("password123");
    cy.findByRole("button", { name: /login/i }).click();

    cy.url().should("include", "/dashboard");
    cy.findByText(/welcome/i).should("be.visible");
  });

  it("shows error for invalid credentials", () => {
    cy.findByLabelText(/email/i).type("invalid@example.com");
    cy.findByLabelText(/password/i).type("wrongpassword");
    cy.findByRole("button", { name: /login/i }).click();

    cy.findByText(/invalid credentials/i).should("be.visible");
    cy.url().should("include", "/login");
  });
});
```

## Testing Checklist

### Component Testing

- [ ] Renders correctly with default props
- [ ] Handles all prop variations
- [ ] Manages internal state properly
- [ ] Calls event handlers correctly
- [ ] Shows loading/error states
- [ ] Follows accessibility guidelines

### Integration Testing

- [ ] API calls work correctly
- [ ] Error handling functions properly
- [ ] Form submissions work end-to-end
- [ ] Navigation flows work
- [ ] Authentication flows work

### Security Testing

- [ ] Input validation prevents XSS
- [ ] CSRF protection is active
- [ ] Authentication is secure
- [ ] Sensitive data is protected
- [ ] Content Security Policy is configured

## Key Testing & Security Rules

1. **Test pyramid**: 70% unit, 20% integration, 10% E2E
2. **Testing Library**: Use semantic queries (role, label, text)
3. **MSW for mocking**: Mock API calls at network level
4. **Input sanitization**: Always sanitize user inputs
5. **CSRF protection**: Include CSRF tokens in forms
6. **Secure storage**: Use httpOnly cookies for tokens
7. **A11y testing**: Include automated accessibility tests
8. **CSP headers**: Configure Content Security Policy
9. **Authentication**: Implement proper protected routes
10. **Error boundaries**: Test error handling scenarios
