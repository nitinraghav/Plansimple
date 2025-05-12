import React from 'react';
import { render, fireEvent } from '@testing-library/react-native';
import { NavigationContainer } from '@react-navigation/native';
import AppNavigator from '../AppNavigator';
import { AuthProvider, useAuth } from '../../contexts/AuthContext';

// Mock the auth context
jest.mock('../../contexts/AuthContext', () => ({
  ...jest.requireActual('../../contexts/AuthContext'),
  useAuth: jest.fn(),
}));

describe('AppNavigator', () => {
  const renderNavigator = (isAuthenticated = false) => {
    (useAuth as jest.Mock).mockReturnValue({
      user: isAuthenticated ? { email: 'test@test.com' } : null,
      loading: false,
    });

    return render(
      <NavigationContainer>
        <AuthProvider>
          <AppNavigator />
        </AuthProvider>
      </NavigationContainer>
    );
  };

  it('shows auth stack when not authenticated', () => {
    const { getByText } = renderNavigator(false);

    expect(getByText('Sign In')).toBeTruthy();
    expect(getByText('Sign Up')).toBeTruthy();
  });

  it('shows main stack when authenticated', () => {
    const { getByText } = renderNavigator(true);

    expect(getByText('Welcome to Plansimple')).toBeTruthy();
    expect(getByText('Profile')).toBeTruthy();
  });

  it('navigates between auth screens', () => {
    const { getByText } = renderNavigator(false);

    // Navigate to Sign Up
    fireEvent.press(getByText('Sign Up'));
    expect(getByText('Create Account')).toBeTruthy();

    // Navigate back to Sign In
    fireEvent.press(getByText('Already have an account? Sign In'));
    expect(getByText('Sign In')).toBeTruthy();
  });

  it('navigates between main screens', () => {
    const { getByText } = renderNavigator(true);

    // Navigate to Profile
    fireEvent.press(getByText('Profile'));
    expect(getByText('test@test.com')).toBeTruthy();

    // Navigate back to Dashboard
    fireEvent.press(getByText('Dashboard'));
    expect(getByText('Welcome to Plansimple')).toBeTruthy();
  });

  it('shows loading screen while checking auth state', () => {
    (useAuth as jest.Mock).mockReturnValue({
      user: null,
      loading: true,
    });

    const { getByText } = render(
      <NavigationContainer>
        <AuthProvider>
          <AppNavigator />
        </AuthProvider>
      </NavigationContainer>
    );

    expect(getByText('Loading...')).toBeTruthy();
  });
}); 