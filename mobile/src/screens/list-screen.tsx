import React, { useCallback, useState } from 'react';
import {
  ActivityIndicator,
  FlatList,
  Image,
  RefreshControl,
  StyleSheet,
  Text,
  View,
} from 'react-native';
import { useFocusEffect } from '@react-navigation/native';
import { useAuth } from '../contexts/auth-context';
import { apiService, Product } from '../services/api-service';
import { wishlistModule } from '../native/wishlist-module';
import { CARD_BASE, COLORS, SPACING } from '../styles/ui-tokens';

const ListScreen: React.FC = () => {
  const { token } = useAuth();
  const [wishlist, setWishlist] = useState<Product[]>([]);
  const [loading, setLoading] = useState(false);
  const [refreshing, setRefreshing] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const loadWishlist = useCallback(async (isRefresh = false) => {
    if (!token) {
      setWishlist([]);
      setError(null);
      return;
    }
    if (isRefresh) {
      setRefreshing(true);
    } else {
      setLoading(true);
    }
    setError(null);
    try {
      const [productsResponse, wishlistIds] = await Promise.all([
        apiService.getProducts(token, 'all'),
        wishlistModule.getWishlistProductIds(),
      ]);

      const payload = productsResponse.data;
      if (!payload?.status || !payload.data) {
        throw new Error(payload?.error?.message ?? 'Could not load wishlist');
      }

      const wishSet = new Set(wishlistIds);
      const filtered = payload.data.filter(item => wishSet.has(item.id));
      setWishlist(filtered);
    } catch (e: any) {
      const message =
        e?.response?.data?.error?.message ??
        e?.message ??
        'Could not load wishlist';
      setError(String(message));
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  }, [token]);

  useFocusEffect(
    useCallback(() => {
      void loadWishlist();
    }, [loadWishlist]),
  );

  if (!token) {
    return (
      <View style={styles.centered}>
        <Text style={styles.message}>Please sign in to view your wishlist.</Text>
      </View>
    );
  }

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
      </View>
    );
  }

  if (!wishlist.length) {
    return (
      <View style={styles.centered}>
        <Text style={styles.message}>Your wishlist is empty.</Text>
      </View>
    );
  }

  return (
    <FlatList
      contentContainerStyle={styles.listContent}
      data={wishlist}
      keyExtractor={item => String(item.id)}
      refreshControl={
        <RefreshControl
          refreshing={refreshing}
          onRefresh={() => {
            void loadWishlist(true);
          }}
        />
      }
      renderItem={({ item }) => (
        <View style={styles.card}>
          <Image source={{ uri: item.image }} style={styles.image} />
          <View style={styles.info}>
            <Text style={styles.name}>{item.name}</Text>
            <Text style={styles.description} numberOfLines={2}>
              {item.description}
            </Text>
          </View>
        </View>
      )}
    />
  );
};

const styles = StyleSheet.create({
  listContent: {
    padding: SPACING.lg,
    gap: SPACING.md,
  },
  card: {
    ...CARD_BASE,
    flexDirection: 'row',
    gap: SPACING.md,
    alignItems: 'center',
  },
  image: {
    width: 56,
    height: 56,
    borderRadius: 8,
    backgroundColor: COLORS.surfaceSubtle,
  },
  info: {
    flex: 1,
  },
  name: {
    color: COLORS.textPrimary,
    fontSize: 16,
    fontWeight: '700',
  },
  description: {
    marginTop: SPACING.xs,
    color: COLORS.textSecondary,
    fontSize: 13,
  },
  centered: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    padding: SPACING.xl,
  },
  message: {
    color: COLORS.textSecondary,
    textAlign: 'center',
  },
  errorText: {
    color: COLORS.danger,
    textAlign: 'center',
  },
});

export default ListScreen;
