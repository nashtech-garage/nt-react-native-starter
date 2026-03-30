import React from 'react';
import {
  ActivityIndicator,
  RefreshControl,
} from 'react-native';
import { fireEvent, render, waitFor } from '@testing-library/react-native';
import ListScreen from './list-screen';
import { useAuth } from '../contexts/auth-context';
import { apiService } from '../services/api-service';
import { wishlistModule } from '../native/wishlist-module';

jest.mock('../contexts/auth-context', () => ({
  useAuth: jest.fn(),
}));

jest.mock('../services/api-service', () => ({
  apiService: {
    getProducts: jest.fn(),
  },
}));

jest.mock('../native/wishlist-module', () => ({
  wishlistModule: {
    getWishlistProductIds: jest.fn(),
  },
}));

const mockedUseAuth = useAuth as jest.MockedFunction<typeof useAuth>;
const mockedApiService = apiService as jest.Mocked<typeof apiService>;
const mockedWishlistModule = wishlistModule as jest.Mocked<typeof wishlistModule>;

const PRODUCTS = [
  {
    id: 11,
    name: 'Echo Buds',
    description: 'Wireless earbuds',
    image: 'https://img/1.png',
    price: 59.99,
    priceUnit: 'dollar',
  },
  {
    id: 12,
    name: 'Terra Mat',
    description: 'Yoga mat',
    image: 'https://img/2.png',
    price: 99,
    priceUnit: 'euro',
  },
];

type SetupOptions = {
  token?: string | null;
  products?: typeof PRODUCTS;
  status?: boolean;
  wishlistIds?: number[];
  getProductsImpl?: jest.Mock;
  getWishlistIdsImpl?: jest.Mock;
};

describe('ListScreen', () => {
  function setup({
    token = 'token',
    products = PRODUCTS,
    status = true,
    wishlistIds = [11],
    getProductsImpl,
    getWishlistIdsImpl,
  }: SetupOptions = {}) {
    mockedUseAuth.mockReturnValue({
      user: { username: 'john' },
      token,
      login: jest.fn(),
      register: jest.fn(),
      logout: jest.fn(),
      refreshUser: jest.fn(),
      updateProfile: jest.fn(),
    });

    if (getProductsImpl) {
      mockedApiService.getProducts.mockImplementation(getProductsImpl as any);
    } else {
      mockedApiService.getProducts.mockResolvedValue({
        data: status
          ? { status: true, data: products as any[] }
          : { status: false, error: { message: 'Wishlist API down' } },
      } as any);
    }

    if (getWishlistIdsImpl) {
      mockedWishlistModule.getWishlistProductIds.mockImplementation(
        getWishlistIdsImpl as any,
      );
    } else {
      mockedWishlistModule.getWishlistProductIds.mockResolvedValue(wishlistIds);
    }

    const view = render(<ListScreen />);
    return { ...view };
  }

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('shows sign-in prompt when token is missing', () => {
    const { getByText } = setup({ token: null });

    expect(
      getByText('Please sign in to view your wishlist.'),
    ).toBeTruthy();
    expect(mockedApiService.getProducts).not.toHaveBeenCalled();
  });

  it('shows loading then wishlist rows for saved product ids', async () => {
    const { getByText } = setup({
      wishlistIds: [11, 12],
    });

    await waitFor(() => {
      expect(getByText('Echo Buds')).toBeTruthy();
      expect(getByText('Terra Mat')).toBeTruthy();
    });

    expect(mockedApiService.getProducts).toHaveBeenCalledWith('token', 'all');
    expect(mockedWishlistModule.getWishlistProductIds).toHaveBeenCalled();
  });

  it('filters list to products whose ids are in native wishlist', async () => {
    const { getByText, queryByText } = setup({
      wishlistIds: [12],
    });

    await waitFor(() => {
      expect(getByText('Terra Mat')).toBeTruthy();
    });
    expect(queryByText('Echo Buds')).toBeNull();
  });

  it('shows empty state when wishlist has no matching products', async () => {
    const { getByText } = setup({ wishlistIds: [] });

    await waitFor(() => {
      expect(getByText('Your wishlist is empty.')).toBeTruthy();
    });
  });

  it('shows error when getProducts rejects', async () => {
    const { getByText } = setup({
      getProductsImpl: jest.fn().mockRejectedValue(new Error('network busted')),
    });

    await waitFor(() => {
      expect(getByText('network busted')).toBeTruthy();
    });
  });

  it('shows error from axios-style response body', async () => {
    const { getByText } = setup({
      getProductsImpl: jest
        .fn()
        .mockRejectedValue({
          response: { data: { error: { message: 'Server said no' } } },
        }),
    });

    await waitFor(() => {
      expect(getByText('Server said no')).toBeTruthy();
    });
  });

  it('shows error when API returns status false', async () => {
    const { getByText } = setup({ status: false });

    await waitFor(() => {
      expect(getByText('Wishlist API down')).toBeTruthy();
    });
  });

  it('shows generic error message when failure has no message', async () => {
    const { getByText } = setup({
      getProductsImpl: jest.fn().mockRejectedValue({}),
    });

    await waitFor(() => {
      expect(getByText('Could not load wishlist')).toBeTruthy();
    });
  });

  it('shows activity indicator while request is pending', async () => {
    const resolvers: {
      resolveProducts?: (value: unknown) => void;
      resolveIds?: (value: unknown) => void;
    } = {};
    const productsPromise = new Promise(resolve => {
      resolvers.resolveProducts = resolve;
    });
    const idsPromise = new Promise(resolve => {
      resolvers.resolveIds = resolve;
    });

    mockedUseAuth.mockReturnValue({
      user: { username: 'john' },
      token: 'token',
      login: jest.fn(),
      register: jest.fn(),
      logout: jest.fn(),
      refreshUser: jest.fn(),
      updateProfile: jest.fn(),
    });
    mockedApiService.getProducts.mockReturnValue(productsPromise as any);
    mockedWishlistModule.getWishlistProductIds.mockReturnValue(idsPromise as any);

    const { UNSAFE_getByType, getByText } = render(<ListScreen />);

    expect(() => UNSAFE_getByType(ActivityIndicator)).not.toThrow();

    resolvers.resolveProducts?.({
      data: { status: true, data: PRODUCTS as any[] },
    });
    resolvers.resolveIds?.([11]);

    await waitFor(() => {
      expect(getByText('Echo Buds')).toBeTruthy();
    });
  });

  it('pull-to-refresh loads wishlist again', async () => {
    const { UNSAFE_getByType, getByText } = setup({ wishlistIds: [11] });

    await waitFor(() => {
      expect(getByText('Echo Buds')).toBeTruthy();
    });

    expect(mockedApiService.getProducts).toHaveBeenCalledTimes(1);

    const refresh = UNSAFE_getByType(RefreshControl);
    fireEvent(refresh, 'refresh');

    await waitFor(() => {
      expect(mockedApiService.getProducts).toHaveBeenCalledTimes(2);
    });
  });
});
