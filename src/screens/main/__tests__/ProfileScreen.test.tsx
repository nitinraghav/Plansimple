import React from 'react';
import { render, fireEvent, waitFor } from '@testing-library/react-native';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import ProfileScreen from '../ProfileScreen';
import { AuthProvider, useAuth } from '../../../contexts/AuthContext';

// Mock the auth context
jest.mock('../../../contexts/AuthContext', () => ({
  ...jest.requireActual('../../../contexts/AuthContext'),
  useAuth: jest.fn(),
}));

const Stack = createNativeStackNavigator();

const mockNavigation = {
  navigate: jest.fn(),
};

const mockUser = {
  email: 'test@test.com',
};

const mockLogout = jest.fn();

const renderWithNavigation = () => {
  (useAuth as jest.Mock).mockReturnValue({
    user: mockUser,
    logout: mockLogout,
  });

  return render(
    <NavigationContainer>
      <AuthProvider>
        <Stack.Navigator>
          <Stack.Screen
            name="Profile"
            component={(props: any) => (
              <ProfileScreen {...props} navigation={mockNavigation} />
            )}
          />
        </Stack.Navigator>
      </AuthProvider>
    </NavigationContainer>
  );
};

describe('ProfileScreen', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('renders correctly with user info', () => {
    const { getByText } = renderWithNavigation();

    expect(getByText('Profile')).toBeTruthy();
    expect(getByText('test@test.com')).toBeTruthy();
    expect(getByText('Logout')).toBeTruthy();
    expect(getByText('Version 1.0.0')).toBeTruthy();
  });

  it('handles logout successfully', async () => {
    mockLogout.mockResolvedValue(undefined);

    const { getByText } = renderWithNavigation();

    fireEvent.press(getByText('Logout'));

    await waitFor(() => {
      expect(mockLogout).toHaveBeenCalled();
    });
  });

  it('handles logout error', async () => {
    const error = new Error('Failed to logout');
    mockLogout.mockRejectedValue(error);

    const { getByText } = renderWithNavigation();

    fireEvent.press(getByText('Logout'));

    await waitFor(() => {
      expect(getByText('Error logging out')).toBeTruthy();
    });
  });

  it('renders with correct styles', () => {
    const { getByTestId } = renderWithNavigation();

    const card = getByTestId('profile-card');
    const email = getByTestId('user-email');
    const logoutButton = getByTestId('logout-button');
    const version = getByTestId('version-text');

    expect(card).toHaveStyle({
      margin: 16,
      elevation: 2,
    });

    expect(email).toHaveStyle({
      fontSize: 16,
      marginTop: 8,
    });

    expect(logoutButton).toHaveStyle({
      marginTop: 16,
    });

    expect(version).toHaveStyle({
      textAlign: 'center',
      marginTop: 32,
      opacity: 0.6,
    });
  });
}); 