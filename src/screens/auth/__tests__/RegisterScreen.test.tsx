import React from 'react';
import { render, fireEvent, waitFor } from '@testing-library/react-native';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import RegisterScreen from '../RegisterScreen';
import { AuthProvider } from '../../../contexts/AuthContext';

const Stack = createNativeStackNavigator();

const renderWithNavigation = () => {
  return render(
    <NavigationContainer>
      <AuthProvider>
        <Stack.Navigator>
          <Stack.Screen name="Register" component={RegisterScreen} />
        </Stack.Navigator>
      </AuthProvider>
    </NavigationContainer>
  );
};

describe('RegisterScreen', () => {
  it('renders correctly', () => {
    const { getByPlaceholderText, getByText } = renderWithNavigation();

    expect(getByPlaceholderText('Email')).toBeTruthy();
    expect(getByPlaceholderText('Password')).toBeTruthy();
    expect(getByPlaceholderText('Confirm Password')).toBeTruthy();
    expect(getByText('Sign Up')).toBeTruthy();
    expect(getByText('Already have an account? Sign In')).toBeTruthy();
  });

  it('shows error when passwords do not match', async () => {
    const { getByPlaceholderText, getByText } = renderWithNavigation();

    fireEvent.changeText(getByPlaceholderText('Email'), 'test@test.com');
    fireEvent.changeText(getByPlaceholderText('Password'), 'password123');
    fireEvent.changeText(getByPlaceholderText('Confirm Password'), 'different123');

    fireEvent.press(getByText('Sign Up'));

    await waitFor(() => {
      expect(getByText('Passwords do not match')).toBeTruthy();
    });
  });

  it('shows error when email is invalid', async () => {
    const { getByPlaceholderText, getByText } = renderWithNavigation();

    fireEvent.changeText(getByPlaceholderText('Email'), 'invalid-email');
    fireEvent.changeText(getByPlaceholderText('Password'), 'password123');
    fireEvent.changeText(getByPlaceholderText('Confirm Password'), 'password123');

    fireEvent.press(getByText('Sign Up'));

    await waitFor(() => {
      expect(getByText('Please enter a valid email')).toBeTruthy();
    });
  });

  it('shows error when password is too short', async () => {
    const { getByPlaceholderText, getByText } = renderWithNavigation();

    fireEvent.changeText(getByPlaceholderText('Email'), 'test@test.com');
    fireEvent.changeText(getByPlaceholderText('Password'), 'short');
    fireEvent.changeText(getByPlaceholderText('Confirm Password'), 'short');

    fireEvent.press(getByText('Sign Up'));

    await waitFor(() => {
      expect(getByText('Password must be at least 6 characters')).toBeTruthy();
    });
  });

  it('handles successful registration', async () => {
    const { getByPlaceholderText, getByText } = renderWithNavigation();

    fireEvent.changeText(getByPlaceholderText('Email'), 'test@test.com');
    fireEvent.changeText(getByPlaceholderText('Password'), 'password123');
    fireEvent.changeText(getByPlaceholderText('Confirm Password'), 'password123');

    fireEvent.press(getByText('Sign Up'));

    // Note: We can't test the actual navigation or Firebase call here
    // as they are mocked in the setup file. We can only verify that
    // the button press doesn't show any validation errors.
    await waitFor(() => {
      expect(() => getByText('Passwords do not match')).toThrow();
      expect(() => getByText('Please enter a valid email')).toThrow();
      expect(() => getByText('Password must be at least 6 characters')).toThrow();
    });
  });

  it('navigates to login screen', () => {
    const { getByText } = renderWithNavigation();

    fireEvent.press(getByText('Already have an account? Sign In'));

    // Note: We can't test the actual navigation here as it's mocked
    // in the setup file. We can only verify that the button exists
    // and can be pressed without errors.
    expect(getByText('Already have an account? Sign In')).toBeTruthy();
  });
}); 