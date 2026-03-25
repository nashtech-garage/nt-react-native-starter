import React from 'react';
import {
  Image,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import { CARD_BASE, COLORS, HEADER_BASE, RADIUS, SPACING } from '../styles/ui-tokens';

function formatPrice(value: number, unit: string) {
  if (unit === 'euro') {
    return `EUR ${value.toFixed(2)}`;
  }
  if (unit === 'inr') {
    return `INR ${value.toFixed(2)}`;
  }
  return `$${value.toFixed(2)}`;
}

const ProductDetailScreen: React.FC<any> = ({
  route,
  navigation,
}) => {
  const product = route?.params?.product;

  if (!product) {
    return (
      <View style={styles.page}>
        <View style={styles.header}>
          <TouchableOpacity
            style={styles.headerIconButton}
            onPress={() => navigation.goBack()}
            activeOpacity={0.85}>
            <Text style={styles.headerIcon}>‹</Text>
          </TouchableOpacity>
          <Text style={styles.headerTitle}>Product Details</Text>
          <View style={styles.headerIconButton} />
        </View>
        <View style={styles.emptyWrap}>
          <Text style={styles.emptyText}>Product not found.</Text>
        </View>
      </View>
    );
  }

  const oldPrice = product.price * 1.15;

  return (
    <View style={styles.page}>
      <View style={styles.header}>
        <TouchableOpacity
          style={styles.headerIconButton}
          onPress={() => navigation.goBack()}
          activeOpacity={0.85}>
          <Text style={styles.headerIcon}>‹</Text>
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Product Details</Text>
        <TouchableOpacity style={styles.headerIconButton} activeOpacity={0.85}>
          <Text style={styles.headerAction}>♡</Text>
        </TouchableOpacity>
      </View>

      <ScrollView contentContainerStyle={styles.content}>
        <View style={styles.imageWrap}>
          <Image source={{ uri: product.image }} style={styles.image} />
        </View>

        <View style={styles.infoCard}>
          <Text style={styles.badge}>NEW ARRIVAL</Text>
          <Text style={styles.name}>{product.name}</Text>
          <View style={styles.priceRow}>
            <Text style={styles.price}>{formatPrice(product.price, product.priceUnit)}</Text>
            <Text style={styles.oldPrice}>{formatPrice(oldPrice, product.priceUnit)}</Text>
          </View>
        </View>

        <View style={styles.card}>
          <Text style={styles.sectionTitle}>Key Features</Text>
          <View style={styles.featureGrid}>
            <View style={styles.featureItem}>
              <Text style={styles.featureLabel}>Battery</Text>
              <Text style={styles.featureValue}>48 Hours</Text>
            </View>
            <View style={styles.featureItem}>
              <Text style={styles.featureLabel}>Connectivity</Text>
              <Text style={styles.featureValue}>Bluetooth 5.2</Text>
            </View>
            <View style={styles.featureItem}>
              <Text style={styles.featureLabel}>Waterproof</Text>
              <Text style={styles.featureValue}>5ATM Resist</Text>
            </View>
            <View style={styles.featureItem}>
              <Text style={styles.featureLabel}>Warranty</Text>
              <Text style={styles.featureValue}>12 Months</Text>
            </View>
          </View>
        </View>

        <View style={styles.card}>
          <Text style={styles.sectionTitle}>Product Description</Text>
          <Text style={styles.description}>{product.description}</Text>
        </View>
      </ScrollView>

      <View style={styles.footer}>
        <TouchableOpacity style={styles.outlineBtn} activeOpacity={0.9}>
          <Text style={styles.outlineBtnText}>Add to Cart</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.primaryBtn} activeOpacity={0.9}>
          <Text style={styles.primaryBtnText}>Buy Now</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  page: {
    flex: 1,
    backgroundColor: COLORS.pageBackground,
  },
  header: HEADER_BASE,
  headerTitle: {
    color: COLORS.textPrimary,
    fontSize: 18,
    fontWeight: '700',
  },
  headerIconButton: {
    width: 34,
    height: 34,
    alignItems: 'center',
    justifyContent: 'center',
  },
  headerIcon: {
    color: COLORS.textPrimary,
    fontSize: 28,
  },
  headerAction: {
    color: COLORS.textPrimary,
    fontSize: 20,
  },
  content: {
    paddingBottom: SPACING.xl,
  },
  imageWrap: {
    backgroundColor: '#111',
  },
  image: {
    width: '100%',
    height: 340,
    resizeMode: 'cover',
  },
  infoCard: {
    ...CARD_BASE,
    borderRadius: 0,
  },
  badge: {
    color: COLORS.brand,
    fontSize: 12,
    fontWeight: '700',
  },
  name: {
    color: COLORS.textPrimary,
    fontSize: 38,
    fontWeight: '700',
    marginTop: SPACING.xs,
  },
  priceRow: {
    marginTop: SPACING.sm,
    flexDirection: 'row',
    alignItems: 'center',
    gap: SPACING.sm,
  },
  price: {
    color: COLORS.textPrimary,
    fontSize: 40,
    fontWeight: '800',
  },
  oldPrice: {
    color: COLORS.textMuted,
    fontSize: 28,
    textDecorationLine: 'line-through',
  },
  card: {
    ...CARD_BASE,
    marginTop: SPACING.md,
    marginHorizontal: SPACING.lg,
  },
  sectionTitle: {
    color: COLORS.textPrimary,
    fontSize: 20,
    fontWeight: '700',
    marginBottom: SPACING.md,
  },
  featureGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: SPACING.sm,
  },
  featureItem: {
    width: '48%',
    backgroundColor: COLORS.surfaceSubtle,
    borderRadius: RADIUS.md,
    borderWidth: 1,
    borderColor: COLORS.borderSubtle,
    padding: SPACING.md,
  },
  featureLabel: {
    color: COLORS.textMuted,
    fontSize: 12,
  },
  featureValue: {
    color: COLORS.textPrimary,
    marginTop: SPACING.xs,
    fontSize: 14,
    fontWeight: '700',
  },
  description: {
    color: COLORS.textSecondary,
    fontSize: 15,
    lineHeight: 22,
  },
  footer: {
    padding: SPACING.lg,
    borderTopWidth: 1,
    borderTopColor: COLORS.borderSubtle,
    backgroundColor: COLORS.surface,
    flexDirection: 'row',
    gap: SPACING.md,
  },
  outlineBtn: {
    flex: 1,
    borderRadius: RADIUS.lg,
    borderWidth: 1,
    borderColor: COLORS.brand,
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: SPACING.md,
  },
  outlineBtnText: {
    color: COLORS.brand,
    fontWeight: '700',
    fontSize: 16,
  },
  primaryBtn: {
    flex: 1,
    borderRadius: RADIUS.lg,
    backgroundColor: COLORS.brand,
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: SPACING.md,
  },
  primaryBtnText: {
    color: COLORS.brandDark,
    fontWeight: '700',
    fontSize: 16,
  },
  emptyWrap: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  emptyText: {
    color: COLORS.textSecondary,
    fontSize: 16,
  },
});

export { ProductDetailScreen };
