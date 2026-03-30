import React from 'react';
import { fireEvent, render, waitFor } from '@testing-library/react-native';
import { ProfileScreen } from './profile-screen';
import { useAuth } from '../contexts/auth-context';

jest.mock('../contexts/auth-context', () => ({
  useAuth: jest.fn(),
}));

const mockedUseAuth = useAuth as jest.MockedFunction<typeof useAuth>;

describe('ProfileScreen', () => {
  function setup(
    updateResult: { ok: boolean; message?: string } = { ok: true },
    userOverride: any = null,
  ) {
    const logout = jest.fn();
    const refreshUser = jest.fn().mockResolvedValue({ ok: true });
    const updateProfile = jest.fn().mockResolvedValue(updateResult);
    const navigation = { replace: jest.fn(), navigate: jest.fn() };

    mockedUseAuth.mockReturnValue({
      user: userOverride ?? {
        username: 'johndoe',
        firstName: 'John',
        lastName: 'Doe',
        age: 28,
        email: 'john@example.com',
      },
      token: 'token',
      login: jest.fn(),
      register: jest.fn(),
      logout,
      refreshUser,
      updateProfile,
    });

    const screen = render(<ProfileScreen navigation={navigation} />);
    return { screen, navigation, logout, refreshUser, updateProfile };
  }

  it('renders profile details and triggers refresh on focus', async () => {
    const { screen, refreshUser } = setup();

    await waitFor(() => {
      expect(refreshUser).toHaveBeenCalled();
      expect(screen.getByText('Profile Settings')).toBeTruthy();
      expect(screen.getByText('John Doe')).toBeTruthy();
    });
  });

  it('enters edit mode and saves updated profile', async () => {
    const { screen, updateProfile } = setup({ ok: true });

    fireEvent.press(screen.getByText('Edit Details'));
    fireEvent.changeText(screen.getByPlaceholderText('First name'), 'Jane');
    fireEvent.changeText(screen.getByPlaceholderText('Last name'), 'Smith');
    fireEvent.changeText(screen.getByPlaceholderText('Age'), '30');
    fireEvent.press(screen.getByText('Save'));

    await waitFor(() => {
      expect(updateProfile).toHaveBeenCalledWith({
        firstName: 'Jane',
        lastName: 'Smith',
        age: 30,
      });
      expect(screen.getByText('Edit Details')).toBeTruthy();
    });
  });

  it('shows validation and api errors in edit mode', async () => {
    const { screen } = setup({ ok: false, message: 'Update failed' });

    fireEvent.press(screen.getByText('Edit Details'));
    fireEvent.changeText(screen.getByPlaceholderText('Age'), '0');
    fireEvent.press(screen.getByText('Save'));
    await waitFor(() => {
      expect(screen.getByText('Enter a valid age')).toBeTruthy();
    });

    fireEvent.changeText(screen.getByPlaceholderText('Age'), '24');
    fireEvent.changeText(screen.getByPlaceholderText('First name'), 'Jane');
    fireEvent.changeText(screen.getByPlaceholderText('Last name'), 'Smith');
    fireEvent.press(screen.getByText('Save'));
    await waitFor(() => {
      expect(screen.getByText('Update failed')).toBeTruthy();
    });
  });

  it('validates missing first/last name and can cancel edit', async () => {
    const { screen } = setup({ ok: true });

    fireEvent.press(screen.getByText('Edit Details'));
    fireEvent.changeText(screen.getByPlaceholderText('First name'), '');
    fireEvent.changeText(screen.getByPlaceholderText('Last name'), '');
    fireEvent.changeText(screen.getByPlaceholderText('Age'), '25');
    fireEvent.press(screen.getByText('Save'));

    await waitFor(() => {
      expect(screen.getByText('First and last name are required')).toBeTruthy();
    });

    fireEvent.press(screen.getByText('Cancel'));
    expect(screen.getByText('Edit Details')).toBeTruthy();
  });

  it('logs out and navigates to SignIn', () => {
    const { screen, logout, navigation } = setup();

    fireEvent.press(screen.getByText('Logout'));

    expect(logout).toHaveBeenCalled();
    expect(navigation.replace).toHaveBeenCalledWith('SignIn');
  });

  it('navigates back to Home from header', () => {
    const { screen, navigation } = setup();

    fireEvent.press(screen.getByText('‹'));

    expect(navigation.navigate).toHaveBeenCalledWith('Home');
  });

  it('sets focus refresh error except Not signed in', async () => {
    const logout = jest.fn();
    const refreshUser = jest
      .fn()
      .mockResolvedValue({ ok: false, message: 'Session expired' });
    const updateProfile = jest.fn().mockResolvedValue({ ok: true });
    const navigation = { replace: jest.fn(), navigate: jest.fn() };

    mockedUseAuth.mockReturnValue({
      user: {
        username: 'johndoe',
        firstName: 'John',
        lastName: 'Doe',
        age: 28,
        email: 'john@example.com',
      },
      token: 'token',
      login: jest.fn(),
      register: jest.fn(),
      logout,
      refreshUser,
      updateProfile,
    });

    const screen = render(<ProfileScreen navigation={navigation} />);

    await waitFor(() => {
      expect(screen.getByText('Session expired')).toBeTruthy();
    });
  });

  it('renders fallback initials/display when user is minimal', () => {
    const { screen } = setup(
      { ok: true },
      {
        username: '',
      },
    );
    expect(screen.getByText('?')).toBeTruthy();
    expect(screen.getByText('@—')).toBeTruthy();
  });
});

