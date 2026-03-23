import React, { useEffect, useMemo, useState } from 'react';
import {
  ActivityIndicator,
  FlatList,
  Image,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from 'react-native';
import { useAuth } from '../contexts/auth-context';
import { apiService, Product } from '../services/api-service';
import { CARD_BASE, COLORS, RADIUS, SPACING } from '../styles/ui-tokens';

interface HomeScreenProps {
  navigation: any;
}

type PriceUnitFilter = 'all' | 'dollar' | 'euro' | 'inr';

const PRICE_TABS: Array<{ key: PriceUnitFilter; label: string }> = [
  { key: 'all', label: 'All Items' },
  { key: 'dollar', label: 'Dollar' },
  { key: 'euro', label: 'Euro' },
  { key: 'inr', label: 'INR' },
];

function formatPrice(value: number, unit: string) {
  if (unit === 'euro') {
    return `EUR ${value.toFixed(2)}`;
  }
  if (unit === 'inr') {
    return `INR ${value.toFixed(2)}`;
  }
  return `$${value.toFixed(2)}`;
}

const HomeScreen: React.FC<HomeScreenProps> = ({ navigation }) => {
  const { user, token } = useAuth();
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(false);
  const [refreshing, setRefreshing] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [search, setSearch] = useState('');
  const [activeUnit, setActiveUnit] = useState<PriceUnitFilter>('all');

  async function loadProducts(isRefresh = false) {
    if (!token) {
      return;
    }
    if (isRefresh) {
      setRefreshing(true);
    } else {
      setLoading(true);
    }
    setError(null);
    try {
      const response = await apiService.getProducts(token, activeUnit);
      const payload = response.data;
      if (payload?.status && payload.data) {
        setProducts(payload.data);
      } else {
        setError(payload?.error?.message ?? 'Could not load products');
      }
    } catch (e: any) {
      const message =
        e?.response?.data?.error?.message ??
        e?.message ??
        'Network error. Check backend server is running.';
      setError(String(message));
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  }

  useEffect(() => {
    loadProducts();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [token, activeUnit]);

  const filteredProducts = useMemo(() => {
    const keyword = search.trim().toLowerCase();
    if (!keyword) {
      return products;
    }
    return products.filter(p => {
      const haystack = `${p.name} ${p.description}`.toLowerCase();
      return haystack.includes(keyword);
    });
  }, [products, search]);

  if (!token) {
    return (
      <View style={styles.centered}>
        <Text style={styles.emptyText}>Please sign in to browse products.</Text>
        <TouchableOpacity
          style={styles.primaryButton}
          onPress={() => navigation.navigate('SignIn')}
          activeOpacity={0.9}>
          <Text style={styles.primaryButtonText}>Go to Sign In</Text>
        </TouchableOpacity>
      </View>
    );
  }

  function renderCatalogContent() {
    if (loading) {
      return (
        <View style={styles.centered}>
          <ActivityIndicator size="large" color={COLORS.brand} />
        </View>
      );
    }

    if (error) {
      return (
        <View style={styles.centered}>
          <Text style={styles.errorText}>{error}</Text>
          <TouchableOpacity
            style={styles.primaryButton}
            onPress={() => loadProducts()}
            activeOpacity={0.9}>
            <Text style={styles.primaryButtonText}>Retry</Text>
          </TouchableOpacity>
        </View>
      );
    }

    return (
      <FlatList
        data={filteredProducts}
        keyExtractor={item => String(item.id)}
        numColumns={2}
        contentContainerStyle={styles.grid}
        columnWrapperStyle={styles.gridRow}
        refreshing={refreshing}
        onRefresh={() => loadProducts(true)}
        ListEmptyComponent={
          <View style={styles.centered}>
            <Text style={styles.emptyText}>No products found.</Text>
          </View>
        }
        renderItem={({ item }) => (
          <TouchableOpacity
            style={styles.productCard}
            activeOpacity={0.9}
            onPress={() =>
              navigation.navigate('ProductDetail', { product: item })
            }>
            <Image source={{ uri: item.image }} style={styles.productImage} />
            <Text style={styles.productName} numberOfLines={1}>
              {item.name}
            </Text>
            <Text style={styles.productDesc} numberOfLines={1}>
              {item.description}
            </Text>
            <View style={styles.priceRow}>
              <Text style={styles.productPrice}>
                {formatPrice(item.price, item.priceUnit)}
              </Text>
              <TouchableOpacity style={styles.addButton} activeOpacity={0.9}>
                <Text style={styles.addButtonText}>+</Text>
              </TouchableOpacity>
            </View>
          </TouchableOpacity>
        )}
      />
    );
  }

  return (
    <View style={styles.page}>
      <View style={styles.headerRow}>
        <View>
          <Text style={styles.headerTitle}>Discover</Text>
          <Text style={styles.headerSubtitle}>
            Welcome, {user?.username ?? 'Shopper'}
          </Text>
        </View>
      </View>

      <TextInput
        style={styles.searchInput}
        placeholder="Search products..."
        value={search}
        onChangeText={setSearch}
        placeholderTextColor={COLORS.textMuted}
      />

      <FlatList
        data={PRICE_TABS}
        horizontal
        showsHorizontalScrollIndicator={false}
        keyExtractor={item => item.key}
        contentContainerStyle={styles.chipsContainer}
        renderItem={({ item }) => {
          const isActive = activeUnit === item.key;
          return (
            <TouchableOpacity
              style={[styles.chip, isActive ? styles.chipActive : undefined]}
              onPress={() => setActiveUnit(item.key)}
              activeOpacity={0.9}>
              <Text
                style={[
                  styles.chipText,
                  isActive ? styles.chipTextActive : undefined,
                ]}>
                {item.label}
              </Text>
            </TouchableOpacity>
          );
        }}
      />

      {renderCatalogContent()}
    </View>
  );
};

const styles = StyleSheet.create({
  page: {
    flex: 1,
    backgroundColor: COLORS.pageBackground,
    paddingHorizontal: SPACING.lg,
    paddingTop: SPACING.xl,
  },
  headerRow: {
    marginBottom: SPACING.md,
  },
  headerTitle: {
    fontSize: 32,
    fontWeight: '700',
    color: COLORS.textPrimary,
  },
  headerSubtitle: {
    marginTop: SPACING.xs,
    color: COLORS.textSecondary,
    fontSize: 14,
  },
  searchInput: {
    backgroundColor: COLORS.surface,
    borderRadius: RADIUS.lg,
    paddingHorizontal: SPACING.xl,
    paddingVertical: 12,
    color: COLORS.textPrimary,
  },
  chipsContainer: {
    paddingVertical: SPACING.md,
    gap: SPACING.sm,
  },
  chip: {
    backgroundColor: '#e8eaee',
    borderRadius: RADIUS.lg,
    paddingHorizontal: SPACING.xl,
    height: 40,
    minWidth: 96,
    alignItems: 'center',
    justifyContent: 'center',
  },
  chipActive: {
    backgroundColor: COLORS.brand,
  },
  chipText: {
    color: '#4d5a6d',
    fontWeight: '600',
    lineHeight: 18,
  },
  chipTextActive: {
    color: '#001b2c',
  },
  grid: {
    paddingBottom: SPACING.xxl,
  },
  gridRow: {
    gap: SPACING.md,
    marginBottom: SPACING.md,
  },
  productCard: {
    ...CARD_BASE,
    flex: 1,
    padding: SPACING.sm,
  },
  productImage: {
    width: '100%',
    aspectRatio: 1,
    borderRadius: RADIUS.md,
    backgroundColor: COLORS.surfaceSubtle,
  },
  productName: {
    marginTop: SPACING.sm,
    fontSize: 24,
    fontWeight: '700',
    color: COLORS.textPrimary,
  },
  productDesc: {
    color: COLORS.textSecondary,
    marginTop: SPACING.xs,
  },
  priceRow: {
    marginTop: SPACING.sm,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  productPrice: {
    fontSize: 24,
    color: COLORS.textPrimary,
    fontWeight: '700',
  },
  addButton: {
    width: 34,
    height: 34,
    borderRadius: 17,
    backgroundColor: COLORS.brand,
    alignItems: 'center',
    justifyContent: 'center',
  },
  addButtonText: {
    color: COLORS.brandDark,
    fontSize: 24,
    fontWeight: '700',
    lineHeight: 24,
  },
  centered: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: SPACING.xl,
  },
  emptyText: {
    color: COLORS.textSecondary,
    fontSize: 16,
    textAlign: 'center',
    marginBottom: SPACING.md,
  },
  errorText: {
    color: COLORS.danger,
    fontSize: 14,
    textAlign: 'center',
    marginBottom: SPACING.md,
  },
  primaryButton: {
    backgroundColor: COLORS.brand,
    paddingHorizontal: SPACING.xl,
    paddingVertical: SPACING.sm,
    borderRadius: RADIUS.lg,
  },
  primaryButtonText: {
    color: COLORS.brandDark,
    fontWeight: '700',
  },
});

export { HomeScreen };
