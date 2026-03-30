import React from 'react';
import { fireEvent, render, waitFor } from '@testing-library/react-native';
import { HomeScreen } from './home-screen';
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
    addProduct: jest.fn(),
    removeProduct: jest.fn(),
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

describe('HomeScreen', () => {
  function setup({ token = 'token', products = PRODUCTS, status = true } = {}) {
    const navigation = { navigate: jest.fn(), replace: jest.fn() };
    mockedUseAuth.mockReturnValue({
      user: { username: 'john' },
      token,
      login: jest.fn(),
      register: jest.fn(),
      logout: jest.fn(),
      refreshUser: jest.fn(),
      updateProfile: jest.fn(),
    });
    mockedApiService.getProducts.mockResolvedValue({
      data: status
        ? { status: true, data: products as any[] }
        : { status: false, error: { message: 'Could not load products' } },
    } as any);
    mockedWishlistModule.getWishlistProductIds.mockResolvedValue([]);

    const screen = render(<HomeScreen navigation={navigation} />);
    return { screen, navigation };
  }

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('shows sign-in prompt when token is missing', () => {
    const { screen, navigation } = setup({ token: null as unknown as string });

    expect(screen.getByText('Please sign in to browse products.')).toBeTruthy();
    fireEvent.press(screen.getByText('Go to Sign In'));
    expect(navigation.navigate).toHaveBeenCalledWith('SignIn');
  });

  it('loads and renders products then navigates to detail on press', async () => {
    const { screen, navigation } = setup();

    await waitFor(() => {
      expect(screen.getByText('Echo Buds')).toBeTruthy();
      expect(mockedApiService.getProducts).toHaveBeenCalledWith('token', 'all');
      expect(mockedWishlistModule.getWishlistProductIds).toHaveBeenCalled();
    });

    fireEvent.press(screen.getByText('Echo Buds'));
    expect(navigation.navigate).toHaveBeenCalledWith('ProductDetail', {
      product: PRODUCTS[0],
    });
  });

  it('filters products by search and chip selection', async () => {
    const { screen } = setup();

    await waitFor(() => {
      expect(screen.getByText('Echo Buds')).toBeTruthy();
      expect(screen.getByText('Terra Mat')).toBeTruthy();
    });

    fireEvent.changeText(screen.getByPlaceholderText('Search products...'), 'terra');
    expect(screen.queryByText('Echo Buds')).toBeNull();
    expect(screen.getByText('Terra Mat')).toBeTruthy();

    fireEvent.press(screen.getByText('Euro'));
    await waitFor(() => {
      expect(mockedApiService.getProducts).toHaveBeenCalledWith('token', 'euro');
    });
  });

  it('shows error state and retries', async () => {
    const navigation = { navigate: jest.fn(), replace: jest.fn() };
    mockedUseAuth.mockReturnValue({
      user: { username: 'john' },
      token: 'token',
      login: jest.fn(),
      register: jest.fn(),
      logout: jest.fn(),
      refreshUser: jest.fn(),
      updateProfile: jest.fn(),
    });
    mockedApiService.getProducts
      .mockRejectedValueOnce(new Error('boom'))
      .mockResolvedValueOnce({ data: { status: true, data: PRODUCTS as any[] } } as any);

    const screen = render(<HomeScreen navigation={navigation} />);

    await waitFor(() => {
      expect(screen.getByText('boom')).toBeTruthy();
    });

    fireEvent.press(screen.getByText('Retry'));
    await waitFor(() => {
      expect(screen.getByText('Echo Buds')).toBeTruthy();
    });
  });
});

