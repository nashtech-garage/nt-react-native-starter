---
applyTo: "**/*.ts,**/*.tsx,**/*.js,**/*.jsx"
---

# React Native Performance & Optimization

## Component Optimization for Mobile

### Memoization Rules for React Native

```typescript
import React, { useMemo, useCallback } from "react";
import { View, FlatList, Text } from "react-native";

// React.memo - essential for list items and complex mobile components
const ListItem = React.memo(({ item, onPress }) => {
  return (
    <TouchableOpacity onPress={() => onPress(item.id)} style={styles.item}>
      <Text>{item.title}</Text>
    </TouchableOpacity>
  );
});

// Custom comparison for complex mobile props
const ExpensiveMapComponent = React.memo(
  ({ markers, region, onRegionChange }) => (
    <MapView
      markers={markers}
      region={region}
      onRegionChange={onRegionChange}
    />
  ),
  (prevProps, nextProps) => {
    return (
      isEqual(prevProps.markers, nextProps.markers) &&
      isEqual(prevProps.region, nextProps.region)
    );
  }
);

// useMemo - for expensive calculations and StyleSheet combinations
const combinedStyles = useMemo(() => {
  return StyleSheet.flatten([baseStyles, dynamicStyles, customStyles]);
}, [dynamicStyles, customStyles]);

// useCallback - critical for FlatList renderItem and event handlers
const renderListItem = useCallback(
  ({ item }) => {
    return <ListItem item={item} onPress={handleItemPress} />;
  },
  [handleItemPress]
);

const handleItemPress = useCallback(
  (id: string) => {
    navigation.navigate("Detail", { itemId: id });
  },
  [navigation]
);
```

### When NOT to Memoize in React Native

```typescript
// DON'T memoize primitives or simple StyleSheet operations
const simpleStyle = useMemo(() => ({ opacity: isVisible ? 1 : 0 }), [isVisible]); // ❌ Unnecessary

// DON'T memoize if dependencies change frequently (like animation values)
const animatedHandler = useCallback(() => {
  Animated.timing(animatedValue, { ... }).start(); // ❌ If animatedValue changes often
}, [animatedValue]);

// DON'T memoize cheap calculations
const screenWidth = useMemo(() => Dimensions.get('window').width, []); // ❌ Simple property access

// DO use for FlatList and complex mobile components
const keyExtractor = useCallback((item) => item.id, []); // ✅ Essential for FlatList performance
const getItemLayout = useCallback((data, index) => ({
  length: ITEM_HEIGHT,
  offset: ITEM_HEIGHT * index,
  index,
}), []); // ✅ Critical for large list performance
```

## Screen and Component Lazy Loading

### Screen-Based Lazy Loading with React Navigation

```typescript
import React, { lazy, Suspense } from "react";
import { NavigationContainer } from "@react-navigation/native";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import { View, ActivityIndicator } from "react-native";

// Lazy load screens for better initial bundle size
const HomeScreen = lazy(() => import("@/features/home/screens/HomeScreen"));
const ProfileScreen = lazy(
  () => import("@/features/profile/screens/ProfileScreen")
);
const SettingsScreen = lazy(
  () => import("@/features/settings/screens/SettingsScreen")
);

const Stack = createNativeStackNavigator();

// Screen wrapper with suspense
const ScreenWrapper: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => (
  <Suspense
    fallback={
      <View style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
        <ActivityIndicator size="large" color="#007AFF" />
      </View>
    }
  >
    {children}
  </Suspense>
);

const AppNavigator = () => (
  <NavigationContainer>
    <Stack.Navigator>
      <Stack.Screen
        name="Home"
        component={() => (
          <ScreenWrapper>
            <HomeScreen />
          </ScreenWrapper>
        )}
      />
      <Stack.Screen
        name="Profile"
        component={() => (
          <ScreenWrapper>
            <ProfileScreen />
          </ScreenWrapper>
        )}
      />
    </Stack.Navigator>
  </NavigationContainer>
);
```

        <Route path="/dashboard" element={<DashboardPage />} />
        <Route path="/quote" element={<QuotePage />} />
      </Routes>
    </Suspense>

  </BrowserRouter>
);
```

### Component-Based Splitting

```typescript
// Large components that aren't always visible
const DataVisualization = lazy(() => import("./DataVisualization"));
const ReportGenerator = lazy(() => import("./ReportGenerator"));

// Conditional loading
const ConditionalComponent = ({ showAdvanced }) => (
  <div>
    <BasicContent />
    {showAdvanced && (
      <Suspense fallback={<ComponentSpinner />}>
        <DataVisualization />
      </Suspense>
    )}
  </div>
);
```

### Feature-Based Splitting

```typescript
// Split by feature modules
const AdminModule = lazy(() => import("@/features/admin"));
const ReportsModule = lazy(() => import("@/features/reports"));

// Dynamic imports for conditional features
const loadFeature = async (featureName: string) => {
  const feature = await import(`@/features/${featureName}`);
  return feature.default;
};
```

## List Optimization

### Virtual Scrolling

```typescript
import { FixedSizeList as List } from "react-window";

// Use react-window for large lists (>100 items)
const VirtualizedList = ({ items }) => (
  <List height={400} itemCount={items.length} itemSize={50} itemData={items}>
    {({ index, style, data }) => (
      <div style={style}>
        <ItemComponent item={data[index]} />
      </div>
    )}
  </List>
);
```

### Pagination vs Virtual Scrolling

```typescript
// Use pagination for better UX (< 1000 items)
const PaginatedList = ({ items, pageSize = 20 }) => {
  const [currentPage, setCurrentPage] = useState(1);

  const paginatedItems = useMemo(() => {
    const start = (currentPage - 1) * pageSize;
    return items.slice(start, start + pageSize);
  }, [items, currentPage, pageSize]);

  return (
    <div>
      {paginatedItems.map((item) => (
        <ItemComponent key={item.id} item={item} />
      ))}
      <Pagination
        current={currentPage}
        total={items.length}
        pageSize={pageSize}
        onChange={setCurrentPage}
      />
    </div>
  );
};
```

## Image Optimization

### Image Loading Strategies

```typescript
// Lazy loading with intersection observer
const LazyImage = ({ src, alt, className }) => {
  const [isLoaded, setIsLoaded] = useState(false);
  const [isInView, setIsInView] = useState(false);
  const imgRef = useRef<HTMLImageElement>(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsInView(true);
          observer.disconnect();
        }
      },
      { threshold: 0.1 }
    );

    if (imgRef.current) {
      observer.observe(imgRef.current);
    }

    return () => observer.disconnect();
  }, []);

  return (
    <div ref={imgRef} className={className}>
      {isInView && (
        <img
          src={src}
          alt={alt}
          onLoad={() => setIsLoaded(true)}
          style={{ opacity: isLoaded ? 1 : 0 }}
        />
      )}
    </div>
  );
};
```

### Image Formats and Sizing

```typescript
// WebP with fallback
const OptimizedImage = ({ src, alt, ...props }) => (
  <picture>
    <source srcSet={`${src}.webp`} type="image/webp" />
    <source srcSet={`${src}.jpg`} type="image/jpeg" />
    <img src={`${src}.jpg`} alt={alt} {...props} />
  </picture>
);

// Responsive images
const ResponsiveImage = ({ baseSrc, alt }) => (
  <img
    src={`${baseSrc}-400w.jpg`}
    srcSet={`
      ${baseSrc}-400w.jpg 400w,
      ${baseSrc}-800w.jpg 800w,
      ${baseSrc}-1200w.jpg 1200w
    `}
    sizes="(max-width: 768px) 400px, (max-width: 1024px) 800px, 1200px"
    alt={alt}
  />
);
```

## Bundle Optimization

### Import Strategies

```typescript
// Tree-shaking friendly imports
import { debounce } from "lodash-es"; // ✅ ES modules
import debounce from "lodash/debounce"; // ✅ Individual function

import _ from "lodash"; // ❌ Imports entire library

// Dynamic imports for large libraries
const loadCharts = async () => {
  const { Chart } = await import("chart.js");
  return Chart;
};
```

### Third-Party Library Optimization

```typescript
// Load heavy libraries only when needed
const ChartComponent = () => {
  const [Chart, setChart] = useState(null);

  useEffect(() => {
    import("chart.js").then((chartModule) => {
      setChart(chartModule.Chart);
    });
  }, []);

  if (!Chart) return <ChartSkeleton />;

  return <Chart {...chartProps} />;
};
```

## State Performance

### State Updates Optimization

```typescript
// Batch state updates
const handleMultipleUpdates = () => {
  // React 18 automatically batches these
  setCount((c) => c + 1);
  setFlag(true);
  setData(newData);
};

// Use functional updates for performance
const updateItem = useCallback((id: string, updates: Partial<Item>) => {
  setItems((prevItems) =>
    prevItems.map((item) => (item.id === id ? { ...item, ...updates } : item))
  );
}, []);
```

### Context Optimization

```typescript
// Split contexts to prevent unnecessary re-renders
const UserContext = createContext<UserContextType | null>(null);
const ThemeContext = createContext<ThemeContextType | null>(null);

// Memoize context values
const UserProvider = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);

  const value = useMemo(
    () => ({
      user,
      setUser,
      isAuthenticated: !!user,
    }),
    [user]
  );

  return <UserContext.Provider value={value}>{children}</UserContext.Provider>;
};
```

## Form Performance

### Large Form Optimization

```typescript
// Use React Hook Form for better performance
const OptimizedForm = () => {
  const { register, handleSubmit, watch } = useForm({
    mode: "onChange", // Only validate on change
    reValidateMode: "onChange",
  });

  // Watch only specific fields
  const watchedField = watch("specificField");

  return (
    <form onSubmit={handleSubmit(onSubmit)}>
      <input {...register("field1")} />
      <input {...register("field2")} />
      {/* Many more fields */}
    </form>
  );
};
```

### Debounced Inputs

```typescript
// Debounce expensive operations
const useDebounce = <T>(value: T, delay: number): T => {
  const [debouncedValue, setDebouncedValue] = useState<T>(value);

  useEffect(() => {
    const handler = setTimeout(() => {
      setDebouncedValue(value);
    }, delay);

    return () => clearTimeout(handler);
  }, [value, delay]);

  return debouncedValue;
};

const SearchInput = () => {
  const [query, setQuery] = useState('');
  const debouncedQuery = useDebounce(query, 300);

  useEffect(() => {
    if (debouncedQuery) {
      performSearch(debouncedQuery);
    }
  }, [debouncedQuery]);

  return (
    <input
      value={query}
      onChange={(e) => setQuery(e.target.value)}
      placeholder="Search..."
    />
  );
};
```

## Monitoring Performance

### Performance Measurement

```typescript
// Custom performance hook
const usePerformanceMonitor = (componentName: string) => {
  useEffect(() => {
    const startTime = performance.now();

    return () => {
      const endTime = performance.now();
      console.log(`${componentName} render time: ${endTime - startTime}ms`);
    };
  });
};

// Web Vitals monitoring
import { getCLS, getFID, getFCP, getLCP, getTTFB } from "web-vitals";

const reportWebVitals = (onPerfEntry?: (metric: any) => void) => {
  if (onPerfEntry && onPerfEntry instanceof Function) {
    getCLS(onPerfEntry);
    getFID(onPerfEntry);
    getFCP(onPerfEntry);
    getLCP(onPerfEntry);
    getTTFB(onPerfEntry);
  }
};
```

### Bundle Analysis

```typescript
// Webpack Bundle Analyzer in package.json scripts
{
  "scripts": {
    "analyze": "npm run build && npx webpack-bundle-analyzer build/static/js/*.js"
  }
}

// Monitor bundle size in CI
const MAX_BUNDLE_SIZE = 500 * 1024; // 500KB

if (bundleSize > MAX_BUNDLE_SIZE) {
  throw new Error(`Bundle size ${bundleSize} exceeds limit ${MAX_BUNDLE_SIZE}`);
}
```

## Performance Checklist

### Component Level

- [ ] Use React.memo for expensive components
- [ ] Implement proper memoization with useMemo/useCallback
- [ ] Avoid creating objects/functions in render
- [ ] Use proper key props for lists
- [ ] Implement error boundaries

### Application Level

- [ ] Code splitting for routes and features
- [ ] Virtual scrolling for large lists
- [ ] Image lazy loading and optimization
- [ ] Tree-shake unused code
- [ ] Bundle size monitoring

### Runtime Performance

- [ ] Debounce expensive operations
- [ ] Batch state updates
- [ ] Optimize context usage
- [ ] Monitor Web Vitals
- [ ] Profile with React DevTools

## Key Performance Rules

1. **Measure first** - profile before optimizing
2. **Code split** routes and large features
3. **Memoize selectively** - only expensive operations
4. **Virtual scrolling** for large lists (>100 items)
5. **Image optimization** - lazy loading, WebP, responsive
6. **Tree shake** unused code and imports
7. **Debounce** user inputs and API calls
8. **Monitor bundle size** and set limits
9. **Use React DevTools** Profiler regularly
10. **Track Web Vitals** in production
