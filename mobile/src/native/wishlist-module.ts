import { NativeModules, Platform } from 'react-native';

type WishlistNativeModule = {
  getWishlistProductIds: () => Promise<number[]>;
  addProduct: (productId: number) => Promise<boolean>;
  removeProduct: (productId: number) => Promise<boolean>;
};

const NativeWishlist = NativeModules.WishlistModule as
  | WishlistNativeModule
  | undefined;

async function getWishlistProductIds(): Promise<number[]> {
  if (Platform.OS !== 'android' || !NativeWishlist) {
    return [];
  }
  try {
    const ids = await NativeWishlist.getWishlistProductIds();
    return Array.isArray(ids) ? ids : [];
  } catch {
    return [];
  }
}

async function addProduct(productId: number): Promise<void> {
  if (Platform.OS !== 'android' || !NativeWishlist) {
    return;
  }
  await NativeWishlist.addProduct(productId);
}

async function removeProduct(productId: number): Promise<void> {
  if (Platform.OS !== 'android' || !NativeWishlist) {
    return;
  }
  await NativeWishlist.removeProduct(productId);
}

export const wishlistModule = {
  getWishlistProductIds,
  addProduct,
  removeProduct,
};
