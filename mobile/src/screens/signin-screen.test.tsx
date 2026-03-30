import React from 'react';
import { fireEvent, render, waitFor } from '@testing-library/react-native';
import { SignInScreen } from './signin-screen';
import { useAuth } from '../contexts/auth-context';

jest.mock('../contexts/auth-context', () => ({
  useAuth: jest.fn(),
}));

const mockedUseAuth = useAuth as jest.MockedFunction<typeof useAuth>;

describe('SignInScreen', () => {
  let consoleSpy: jest.SpyInstance;

  function setup(
    authOverrides: Partial<ReturnType<typeof mockedUseAuth>> = {},
  ) {
    const navigation = { replace: jest.fn(), navigate: jest.fn() };

    const defaultAuth = {
      user: null,
      token: null,
      login: jest.fn(),
      biometricLogin: jest.fn().mockResolvedValue({ ok: true }),
      register: jest.fn(),
      logout: jest.fn(),
      refreshUser: jest.fn(),
      updateProfile: jest.fn(),
    };

    const auth = { ...defaultAuth, ...authOverrides };
    mockedUseAuth.mockReturnValue(auth as any);

    const screen = render(<SignInScreen navigation={navigation} />);
    return {
      screen,
      navigation,
      login: auth.login as jest.Mock,
    };
  }

  beforeEach(() => {
    jest.clearAllMocks();
    consoleSpy = jest.spyOn(console, 'log').mockImplementation(() => {});
  });

  afterEach(() => {
    consoleSpy.mockRestore();
  });

  it('calls login and navigates to Main on success', async () => {
    const login = jest.fn().mockResolvedValue({ ok: true });
    const { screen, navigation } = setup({ login });

    fireEvent.press(screen.getByText('Sign In'));

    await waitFor(() => {
      expect(login).toHaveBeenCalledWith('', '');
      expect(navigation.replace).toHaveBeenCalledWith('Main');
    });
  });

  it('shows error message when login fails', async () => {
    const login = jest.fn().mockResolvedValue({
      ok: false,
      message: 'Invalid credentials',
    });
    const { screen, navigation } = setup({ login });

    fireEvent.press(screen.getByText('Sign In'));

    await waitFor(() => {
      expect(screen.getByText('Invalid credentials')).toBeTruthy();
    });
    expect(navigation.replace).not.toHaveBeenCalled();
  });

  it('navigates to CreateProfile from Sign Up tab', () => {
    const { screen, navigation } = setup();

    fireEvent.press(screen.getByText('Sign Up'));
    fireEvent.press(screen.getByText('Continue to profile'));

    expect(navigation.navigate).toHaveBeenCalledWith('CreateProfile');
  });

  it('handles login form interactions and utility actions', () => {
    const biometricLogin = jest.fn().mockResolvedValue({ ok: true });
    const { screen } = setup({ biometricLogin });

    fireEvent.press(screen.getByText('Login'));
    fireEvent.changeText(screen.getByPlaceholderText('johndoe123'), 'alice');
    fireEvent.changeText(screen.getByPlaceholderText('••••••••'), 'pass123');
    fireEvent.press(screen.getByText('Use biometrics for faster login'));
    fireEvent.press(screen.getByText('Forgot Password?'));
    fireEvent.press(screen.getByText('Sign in with Biometrics'));

    expect(screen.getByDisplayValue('alice')).toBeTruthy();
    expect(screen.getByDisplayValue('pass123')).toBeTruthy();
    expect(consoleSpy).toHaveBeenCalledWith('Forgot password');
    expect(biometricLogin).toHaveBeenCalled();
  });
});
